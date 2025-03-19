import express, { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRoles } from '../types/prisma.types';
import { logBuffer, flushLogs } from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /api/logs:
 *   post:
 *     tags:
 *       - Logs
 *     summary: Submit logs to the system
 *     description: Accepts a batch of log entries for processing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - logs
 *             properties:
 *               logs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - level
 *                     - message
 *                     - context
 *                     - timestamp
 *                   properties:
 *                     level:
 *                       type: string
 *                       enum: [debug, info, warn, error, critical]
 *                     message:
 *                       type: string
 *                     context:
 *                       type: object
 *                       required:
 *                         - requestId
 *                         - environment
 *                       properties:
 *                         requestId:
 *                           type: string
 *                         environment:
 *                           type: string
 *                           enum: [dev, prod]
 *                         userId:
 *                           type: string
 *                         clientId:
 *                           type: string
 *                         operation:
 *                           type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       200:
 *         description: Logs processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     processedCount:
 *                       type: integer
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { logs } = req.body;
    
    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid log format. Logs must be an array of log entries.',
        meta: {
          requestId: req.requestId || 'unknown',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Process and store logs
    for (const log of logs) {
      if (!log.level || !log.message || !log.context || !log.timestamp) {
        continue; // Skip invalid log entries
      }
      
      // Add to buffer based on log level
      switch (log.level) {
        case 'debug':
          logBuffer.push({ level: 'debug', message: log.message, context: log.context, timestamp: log.timestamp });
          break;
        case 'info':
          logBuffer.push({ level: 'info', message: log.message, context: log.context, timestamp: log.timestamp });
          break;
        case 'warn':
          logBuffer.push({ level: 'warn', message: log.message, context: log.context, timestamp: log.timestamp });
          break;
        case 'error':
          logBuffer.push({ level: 'error', message: log.message, context: log.context, timestamp: log.timestamp });
          break;
        case 'critical':
          logBuffer.push({ level: 'critical', message: log.message, context: log.context, timestamp: log.timestamp });
          // For critical logs, flush immediately
          flushLogs();
          break;
        default:
          // Default to info level
          logBuffer.push({ level: 'info', message: log.message, context: log.context, timestamp: log.timestamp });
      }
    }
    
    res.status(200).json({
      success: true,
      data: {
        processedCount: logs.length
      },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/logs/flush:
 *   post:
 *     tags:
 *       - Logs
 *     summary: Force log flushing
 *     description: Forces the immediate flushing of all buffered logs to storage (Admin/Staff only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs flushed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post('/flush', authenticate, authorize([UserRoles.ADMIN, UserRoles.STAFF]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for log flush endpoint
    res.status(200).json({
      success: true,
      data: { flushedCount: 0 },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/logs/summary:
 *   get:
 *     tags:
 *       - Logs
 *     summary: Get log summary
 *     description: Retrieves a summary of logs by level, timeframe, etc. (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: day
 *         description: Timeframe for the summary
 *     responses:
 *       200:
 *         description: Log summary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get('/summary', authenticate, authorize([UserRoles.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder for log summary endpoint
    res.status(200).json({
      success: true,
      data: {
        summary: {
          debug: 0,
          info: 0,
          warn: 0,
          error: 0,
          critical: 0
        }
      },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/logs:
 *   get:
 *     tags:
 *       - Logs
 *     summary: Get logs
 *     description: Retrieves logs with optional filtering (Admin/Staff only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [debug, info, warn, error, critical]
 *         description: Filter by log level
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *         description: Filter by client ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: List of logs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get('/', authenticate, authorize([UserRoles.ADMIN, UserRoles.STAFF]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would be implemented with database queries in the actual implementation
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        logs: []
      },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString(),
        pagination: {
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 50,
          total: 0,
          totalPages: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
