import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logInfo } from '../utils/logger';

/**
 * Middleware to log all incoming requests
 * Attaches a unique requestId to each request for tracing
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate or use existing request ID
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  
  // Attach request ID to response headers
  res.setHeader('x-request-id', requestId);
  
  // Attach request ID to request object for use in other middleware and controllers
  req.requestId = requestId;
  
  // Add user ID to request if authenticated
  const userId = req.user?.id || undefined;
  
  // Log the request
  logInfo(`${req.method} ${req.path}`, {
    requestId,
    environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
    userId,
    path: req.path,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.socket.remoteAddress,
    query: req.query,
    startTime: Date.now() // Used to calculate request duration
  });
  
  // Record response time on completion
  res.on('finish', () => {
    const duration = Date.now() - (req as any).startTime;
    logInfo(`Completed ${req.method} ${req.path} - ${res.statusCode}`, {
      requestId,
      environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
      userId,
      statusCode: res.statusCode,
      duration
    });
  });
  
  next();
};

// Extend Express Request interface to include our custom properties
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        role: string;
        email: string;
        securityVersion: number;
      };
      startTime?: number;
    }
  }
}
