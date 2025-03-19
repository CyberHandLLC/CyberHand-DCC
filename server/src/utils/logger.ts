import { LogLevel, LogContext, LogEntry } from '../types/api.types';

/**
 * In-memory log buffer to reduce API calls
 */
export let logBuffer: LogEntry[] = [];
const LOG_BUFFER_SIZE = 50;
const LOG_BUFFER_FLUSH_INTERVAL = 30000; // 30 seconds

/**
 * Log function for creating structured logs
 * @param level Log severity level
 * @param message Log message
 * @param context Context information
 */
export const log = (level: LogLevel, message: string, context: LogContext): void => {
  // Ensure required context fields
  if (!context.requestId) {
    context.requestId = 'unknown';
  }
  if (!context.environment) {
    context.environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
  }

  const logEntry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString()
  };

  // Add to buffer
  logBuffer.push(logEntry);

  // Also log to console
  const formattedMessage = `[${logEntry.timestamp}] [${level.toUpperCase()}] [${context.requestId}] ${message}`;
  switch (level) {
    case 'debug':
      console.debug(formattedMessage, context);
      break;
    case 'info':
      console.info(formattedMessage, context);
      break;
    case 'warn':
      console.warn(formattedMessage, context);
      break;
    case 'error':
    case 'critical':
      console.error(formattedMessage, context);
      break;
  }

  // Flush if buffer is full
  if (logBuffer.length >= LOG_BUFFER_SIZE) {
    flushLogs();
  }
};

/**
 * Debug level logging
 */
export const logDebug = (message: string, context: Partial<LogContext>): void => {
  log('debug', message, context as LogContext);
};

/**
 * Info level logging
 */
export const logInfo = (message: string, context: Partial<LogContext>): void => {
  log('info', message, context as LogContext);
};

/**
 * Warning level logging
 */
export const logWarn = (message: string, context: Partial<LogContext>): void => {
  log('warn', message, context as LogContext);
};

/**
 * Error level logging
 */
export const logError = (message: string, context: Partial<LogContext>): void => {
  log('error', message, context as LogContext);
};

/**
 * Critical level logging - always flushes immediately
 */
export const logCritical = (message: string, context: Partial<LogContext>): void => {
  log('critical', message, context as LogContext);
  // Critical logs are flushed immediately
  flushLogs();
};

/**
 * Send accumulated logs to the API server
 * In a real implementation, this would call the /api/logs endpoint
 * @returns The number of logs flushed
 */
export const flushLogs = (): number => {
  if (logBuffer.length === 0) return 0;
  
  const logsToFlush = [...logBuffer];
  const count = logsToFlush.length;
  
  // In a real implementation, this would be an API call to /api/logs
  console.log(`Flushing ${count} logs to API server`);
  
  // Clear the buffer
  logBuffer = [];
  
  return count;
};

// Set up flush interval
setInterval(flushLogs, LOG_BUFFER_FLUSH_INTERVAL);

// Flush logs on process exit
process.on('exit', () => {
  flushLogs();
});
