import jwt, { SignOptions, Secret, JwtPayload as JWTPayload } from 'jsonwebtoken';
import { prisma } from '../index';
import { TokenType } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logInfo, logError } from './logger';

/**
 * Interface for JWT payload structure
 */
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  securityVersion: number;
  type: string;
  jti: string; // JWT ID for token identification
}

/**
 * Generate a JWT token for authentication
 * 
 * @param userId User ID
 * @param email User email
 * @param role User role
 * @param securityVersion User's security version
 * @param type Token type (access or refresh)
 * @returns Object containing token string and expiry date
 */
export const generateToken = async (
  userId: string,
  email: string,
  role: string,
  securityVersion: number,
  type: TokenType
): Promise<{ token: string; expiresAt: Date }> => {
  // Define expiresIn with correct typing to match JWT library requirements
  let expiresIn: number;
  switch (type) {
    case 'ACCESS':
      expiresIn = 60 * 60 * 24; // 24 hours in seconds
      break;
    case 'REFRESH':
      expiresIn = 60 * 60 * 24 * 14; // 14 days in seconds
      break;
    default:
      expiresIn = 60 * 60 * 24; // 24 hours in seconds
  }

  // Calculate expiration date
  const expiresAt = new Date();
  switch (type) {
    case 'ACCESS':
      expiresAt.setHours(expiresAt.getHours() + 24);
      break;
    case 'REFRESH':
      expiresAt.setDate(expiresAt.getDate() + 14);
      break;
    default:
      expiresAt.setHours(expiresAt.getHours() + 24);
  }

  // Create token record in database
  const tokenRecord = await prisma.token.create({
    data: {
      userId,
      type,
      token: '', // Will be updated after JWT generation
      securityVersion, // Add the required securityVersion field
      expiresAt,
    },
  });

  // Generate JWT with token ID as jti
  const secret = getSecretForTokenType(type);
  
  // Validate that we have a secret
  if (!secret) {
    throw new AppError(`JWT secret for ${type} token is not defined`, 500);
  }
  
  const tokenPayload: JwtPayload = {
    userId,
    email,
    role,
    securityVersion,
    type,
    jti: tokenRecord.id, // Use the database token ID as JWT ID
  };

  // Properly type the options for the JWT sign function
  const signOptions: SignOptions = {
    expiresIn
  };

  // Use proper type casting for the secret to match jwt.sign function signature
  const token = jwt.sign(tokenPayload, secret as Secret, signOptions);

  // Update token in database with actual JWT
  await prisma.token.update({
    where: { id: tokenRecord.id },
    data: { token },
  });

  logInfo('Token generated', {
    requestId: 'system',
    environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
    userId,
    tokenId: tokenRecord.id,
    tokenType: type,
  });

  return { token, expiresAt };
};

/**
 * Verify and decode a JWT token
 * 
 * @param token JWT token string
 * @param type Token type
 * @returns Decoded token payload
 * @throws AppError if token is invalid
 */
export const verifyToken = async (token: string, type: TokenType): Promise<JwtPayload> => {
  try {
    const secret = getSecretForTokenType(type);
    
    // Validate that we have a secret
    if (!secret) {
      throw new AppError(`JWT secret for ${type} token is not defined`, 500);
    }
    
    // Decode and verify token with proper type casting
    const decoded = jwt.verify(token, secret as Secret) as JwtPayload;
    
    // Validate token type
    if (decoded.type !== type) {
      throw new AppError(`Invalid token type. Expected ${type}`, 401);
    }
    
    // Check if token exists and is valid in the database
    const tokenRecord = await prisma.token.findUnique({
      where: { id: decoded.jti },
      include: { user: true }
    });
    
    if (!tokenRecord) {
      throw new AppError('Token not found', 401);
    }
    
    if (tokenRecord.used) {
      throw new AppError('Token has already been used', 401);
    }
    
    if (tokenRecord.revokedAt) {
      throw new AppError('Token has been revoked', 401);
    }
    
    if (new Date() > tokenRecord.expiresAt) {
      throw new AppError('Token has expired', 401);
    }
    
    // Check security version
    if (tokenRecord.user && tokenRecord.user.securityVersion > decoded.securityVersion) {
      throw new AppError('Token is invalid due to security update', 401);
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Invalid token: ${(error as Error).message}`, 401);
  }
};

/**
 * Mark a refresh token as used after successful rotation
 * 
 * @param tokenId Token ID
 */
export const markTokenAsUsed = async (tokenId: string): Promise<void> => {
  await prisma.token.update({
    where: { id: tokenId },
    data: { used: true }
  });
};

/**
 * Revoke tokens
 * 
 * @param userId User ID
 * @param options Revocation options
 */
export const revokeTokens = async (
  userId: string,
  options: {
    tokenIds?: string[];
    all?: boolean;
    exceptCurrent?: boolean;
    currentTokenId?: string;
  }
): Promise<number> => {
  const { tokenIds, all, exceptCurrent, currentTokenId } = options;
  
  if (!tokenIds && !all) {
    throw new AppError('Either tokenIds or all must be specified', 400);
  }
  
  if (exceptCurrent && !currentTokenId) {
    throw new AppError('currentTokenId must be provided when exceptCurrent is true', 400);
  }
  
  const where: any = {
    userId,
    revokedAt: null
  };
  
  if (tokenIds) {
    where.id = { in: tokenIds };
  }
  
  if (exceptCurrent && currentTokenId) {
    where.id = { not: currentTokenId };
  }
  
  // Revoke tokens
  const result = await prisma.token.updateMany({
    where,
    data: { 
      revokedAt: new Date()
    }
  });
  
  logInfo(`Revoked ${result.count} tokens for user ${userId}`, {
    requestId: 'system',
    environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
    userId,
    count: result.count
  });
  
  return result.count;
};

/**
 * Get the appropriate secret key for the token type
 * 
 * @param type Token type
 * @returns Secret key
 */
const getSecretForTokenType = (type: TokenType): string => {
  const defaultSecret = 'fallback-secret-for-development-only-change-me';
  let secret: string | undefined;
  
  switch (type) {
    case 'ACCESS':
      secret = process.env.JWT_ACCESS_SECRET;
      break;
    case 'REFRESH':
      secret = process.env.JWT_REFRESH_SECRET;
      break;
    default:
      secret = process.env.JWT_ACCESS_SECRET;
  }
  
  // In production, require actual secrets
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error(`JWT_${type}_SECRET environment variable is required in production`);
  }
  
  // Only use fallback in development
  return secret || defaultSecret;
};
