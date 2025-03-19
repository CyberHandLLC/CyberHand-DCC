import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { ApiResponse } from '../types/api.types';
import { AppError } from '../middleware/errorHandler';
import { generateToken, verifyToken, markTokenAsUsed, revokeTokens } from '../utils/token.utils';
import bcrypt from 'bcryptjs';
import { logInfo, logError, logWarn } from '../utils/logger';

/**
 * User registration handler
 * 
 * @route POST /api/auth/register
 * @param {Object} req.body - Registration details
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {string} req.body.firstName - User first name
 * @param {string} req.body.lastName - User last name
 * @param {string} req.body.role - User role (defaults to CLIENT)
 * @returns {ApiResponse} Response with user data or error
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role = 'CLIENT' } = req.body;
    
    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: role as any // Will be validated by Prisma schema against UserRole enum
      }
    });
    
    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        resource: 'USER',
        details: {
          email: user.email,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        }
      }
    });
    
    // Return user data (exclude sensitive fields)
    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    logInfo('User registered successfully', {
      requestId: req.requestId || 'unknown',
      environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
      userId: user.id,
      email: user.email
    });
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * User login handler
 * 
 * @route POST /api/auth/login
 * @param {Object} req.body - Login credentials
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @returns {ApiResponse} Response with user data or error and sets cookies
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new AppError('Account is not active', 401);
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      // Log failed login attempt
      logWarn('Failed login attempt', {
        requestId: req.requestId || 'unknown',
        environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
        email,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });
      
      throw new AppError('Invalid credentials', 401);
    }
    
    // Generate tokens
    const { token: accessToken, expiresAt: accessExpiresAt } = await generateToken(
      user.id,
      user.email,
      user.role,
      user.securityVersion,
      'ACCESS'
    );
    
    const { token: refreshToken, expiresAt: refreshExpiresAt } = await generateToken(
      user.id,
      user.email,
      user.role,
      user.securityVersion,
      'REFRESH'
    );
    
    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: accessExpiresAt,
        ipAddress: req.ip || req.socket.remoteAddress || 'UNKNOWN',
        userAgent: req.headers['user-agent'] || 'UNKNOWN'
      }
    });
    
    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        resource: 'USER',
        details: {
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        }
      }
    });
    
    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      domain: process.env.COOKIE_DOMAIN || undefined
    };
    
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      expires: accessExpiresAt
    });
    
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      expires: refreshExpiresAt
    });
    
    // Return user data (exclude sensitive fields)
    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    logInfo('User logged in successfully', {
      requestId: req.requestId || 'unknown',
      environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
      userId: user.id
    });
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * User logout handler
 * 
 * @route POST /api/auth/logout
 * @returns {ApiResponse} Success response and clears cookies
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated
    if (req.user) {
      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'LOGOUT',
          resource: 'USER',
          details: {
            ipAddress: req.ip || req.socket.remoteAddress,
            userAgent: req.headers['user-agent']
          }
        }
      });
    }
    
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    const response: ApiResponse = {
      success: true,
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Token refresh handler
 * 
 * @route POST /api/auth/refresh
 * @returns {ApiResponse} Response with new tokens or error
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401);
    }
    
    // Verify the refresh token
    const decoded = await verifyToken(refreshToken, 'REFRESH');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      throw new AppError('User not found', 401);
    }
    
    // Check for suspicious activity (refresh count)
    const refreshCount = await prisma.session.count({
      where: {
        userId: user.id,
        lastRefreshedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    });
    
    if (refreshCount > 5) {
      // Too many refreshes in the last hour - possible token theft
      logWarn('Suspicious refresh activity detected', {
        requestId: req.requestId || 'unknown',
        environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
        userId: user.id,
        refreshCount,
        ipAddress: req.ip || req.socket.remoteAddress
      });
      
      // Revoke all tokens
      await revokeTokens(user.id, { all: true });
      
      throw new AppError('Security alert: too many token refreshes. Please log in again.', 401);
    }
    
    // Mark the old token as used
    await markTokenAsUsed(decoded.jti);
    
    // Generate new tokens
    const { token: newAccessToken, expiresAt: accessExpiresAt } = await generateToken(
      user.id,
      user.email,
      user.role,
      user.securityVersion,
      'ACCESS'
    );
    
    const { token: newRefreshToken, expiresAt: refreshExpiresAt } = await generateToken(
      user.id,
      user.email,
      user.role,
      user.securityVersion,
      'REFRESH'
    );
    
    // Update session
    await prisma.session.updateMany({
      where: { userId: user.id, token: refreshToken },
      data: {
        lastRefreshedAt: new Date(),
        refreshCount: { increment: 1 }
      }
    });
    
    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      domain: process.env.COOKIE_DOMAIN || undefined
    };
    
    res.cookie('accessToken', newAccessToken, {
      ...cookieOptions,
      expires: accessExpiresAt
    });
    
    res.cookie('refreshToken', newRefreshToken, {
      ...cookieOptions,
      expires: refreshExpiresAt
    });
    
    const response: ApiResponse = {
      success: true,
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    logInfo('Token refreshed successfully', {
      requestId: req.requestId || 'unknown',
      environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
      userId: user.id
    });
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user info
 * 
 * @route GET /api/auth/me
 * @returns {ApiResponse} Response with user data or error
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        client: req.user.role === 'CLIENT' ? {
          select: {
            id: true,
            companyName: true
          }
        } : undefined,
        staffProfile: req.user.role === 'STAFF' || req.user.role === 'ADMIN' ? {
          select: {
            id: true,
            department: true,
            title: true
          }
        } : undefined
      }
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    const response: ApiResponse = {
      success: true,
      data: { user },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke tokens
 * 
 * @route POST /api/auth/revoke
 * @param {Object} req.body - Revocation options
 * @param {string[]} [req.body.tokenIds] - Specific token IDs to revoke
 * @param {boolean} [req.body.all] - Revoke all tokens
 * @param {boolean} [req.body.exceptCurrent] - Exclude current token from revocation
 * @returns {ApiResponse} Response with count of revoked tokens
 */
export const revokeUserTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }
    
    const { tokenIds, all, exceptCurrent } = req.body;
    
    // Get current token ID if exceptCurrent is true
    let currentTokenId: string | undefined;
    if (exceptCurrent) {
      const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
      if (accessToken) {
        try {
          const decoded = await verifyToken(accessToken, 'ACCESS');
          currentTokenId = decoded.jti;
        } catch (error) {
          // Ignore token verification errors here
        }
      }
    }
    
    // Revoke tokens
    const revokedCount = await revokeTokens(req.user.id, {
      tokenIds,
      all,
      exceptCurrent,
      currentTokenId
    });
    
    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE',
        resource: 'USER',
        details: {
          operation: 'REVOKE_TOKENS',
          tokenIds,
          all,
          exceptCurrent,
          revokedCount,
          ipAddress: req.ip || req.socket.remoteAddress
        }
      }
    });
    
    const response: ApiResponse = {
      success: true,
      data: { revokedCount },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password handler
 * 
 * @route POST /api/auth/forgot-password
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email
 * @returns {ApiResponse} Success response
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      throw new AppError('Email is required', 400);
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Don't reveal if user exists for security
    if (!user) {
      const response: ApiResponse = {
        success: true,
        meta: {
          requestId: req.requestId || 'unknown',
          timestamp: new Date().toISOString()
        }
      };
      
      return res.status(200).json(response);
    }
    
    // Generate password reset token
    const { token } = await generateToken(
      user.id,
      user.email,
      user.role,
      user.securityVersion,
      'PASSWORD_RESET'
    );
    
    // In a real implementation, send email with reset link
    // For the implementation guide, we'll just log it
    logInfo('Password reset requested', {
      requestId: req.requestId || 'unknown',
      environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
      userId: user.id,
      resetToken: process.env.NODE_ENV === 'development' ? token : '[redacted]'
    });
    
    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET',
        resource: 'USER',
        details: {
          operation: 'REQUEST',
          ipAddress: req.ip || req.socket.remoteAddress
        }
      }
    });
    
    const response: ApiResponse = {
      success: true,
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password handler
 * 
 * @route POST /api/auth/reset-password
 * @param {Object} req.body - Request body
 * @param {string} req.body.token - Password reset token
 * @param {string} req.body.password - New password
 * @returns {ApiResponse} Success response
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      throw new AppError('Token and new password are required', 400);
    }
    
    // Verify the reset token
    const decoded = await verifyToken(token, 'PASSWORD_RESET');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Update user password and increment security version
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        securityVersion: { increment: 1 }
      }
    });
    
    // Revoke all tokens
    await revokeTokens(user.id, { all: true });
    
    // Mark the reset token as used
    await markTokenAsUsed(decoded.jti);
    
    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET',
        resource: 'USER',
        details: {
          operation: 'COMPLETE',
          ipAddress: req.ip || req.socket.remoteAddress
        }
      }
    });
    
    const response: ApiResponse = {
      success: true,
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Email verification handler
 * 
 * @route POST /api/auth/verify-email
 * @param {Object} req.body - Request body
 * @param {string} req.body.token - Email verification token
 * @returns {ApiResponse} Success response
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw new AppError('Verification token is required', 400);
    }
    
    // Verify the email verification token
    const decoded = await verifyToken(token, 'EMAIL_VERIFICATION');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Update user's email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true }
    });
    
    // Mark the verification token as used
    await markTokenAsUsed(decoded.jti);
    
    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE',
        resource: 'USER',
        details: {
          operation: 'VERIFY_EMAIL',
          ipAddress: req.ip || req.socket.remoteAddress
        }
      }
    });
    
    const response: ApiResponse = {
      success: true,
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
