import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken } from '../utils/token.utils';
import { UserRole } from '@prisma/client';
import { logError } from '../utils/logger';
import { prisma } from '../index';

/**
 * Middleware to authenticate user with JWT token
 * Extracts JWT from Authorization header or cookies
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies (preferred) or authorization header
    const accessToken = req.cookies.accessToken || extractTokenFromHeader(req);
    
    if (!accessToken) {
      throw new AppError('Authentication required', 401);
    }
    
    // Verify the token
    const decoded = await verifyToken(accessToken, 'ACCESS');
    
    // Attach user info to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      securityVersion: decoded.securityVersion
    };
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logError('Authentication error', {
        requestId: req.requestId || 'unknown',
        environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
        error: error instanceof Error ? error.message : 'Unknown error',
        path: req.path
      });
      next(new AppError('Authentication failed', 401));
    }
  }
};

/**
 * Middleware to authorize user roles
 * @param allowedRoles Array of roles that are permitted access
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return next(new AppError('You do not have permission to access this resource', 403));
    }
    
    next();
  };
};

/**
 * Extract JWT token from Authorization header
 */
const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
};

/**
 * Middleware to check if user has permission to access client resources
 * Verifies user is either an admin/staff or is associated with the specific client
 */
export const authorizeClientAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    
    const clientId = req.params.id;
    
    // Admin and staff can access all client resources
    if (req.user.role === 'ADMIN' || req.user.role === 'STAFF') {
      return next();
    }
    
    // For client role, verify the user is associated with the requested client
    if (req.user.role === 'CLIENT') {
      // Get user's client association from database
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { clientId: true }
      });
      
      if (!user || user.clientId !== clientId) {
        throw new AppError('You do not have permission to access this client', 403);
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        securityVersion: number;
      };
      requestId?: string;
    }
  }
}
