import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../types/api.types';
import { logError } from '../utils/logger';

/**
 * Custom error class with HTTP status code and additional metadata
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates if this is a known operational error
    this.details = details;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Formats errors according to the standard API response structure
 */
export const errorHandler = (
  err: Error | AppError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Generate request ID if not already present
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  
  // Set default values
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let details: any = undefined;
  
  // Handle operational errors with specific status codes
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors (e.g., from Zod or other validators)
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    // Handle JWT specific errors
    statusCode = 401;
    errorMessage = 'Authentication error: ' + err.message;
  }
  
  // Create standardized response
  const response: ApiResponse = {
    success: false,
    error: errorMessage,
    meta: {
      requestId: requestId,
      timestamp: new Date().toISOString()
    }
  };
  
  // Log additional debug information but don't include it in the response to comply with ApiResponse type
  if (process.env.NODE_ENV === 'development') {
    // Instead of modifying the meta object (which would break the ApiResponse type),
    // We'll only log the extended details
    logError(errorMessage, {
      requestId,
      environment: 'dev',
      path: req.path,
      method: req.method,
      userId: req.user?.id,
      statusCode,
      stack: err.stack,
      details
    });
  } else {
    // For production, log with less detail
    logError(errorMessage, {
      requestId,
      environment: 'prod',
      path: req.path,
      method: req.method,
      userId: req.user?.id,
      statusCode
    });
  }
  
  res.status(statusCode).json(response);
};
