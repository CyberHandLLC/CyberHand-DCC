/**
 * Standard API response format for CyberHand platform
 * @template T The type of data returned in successful responses
 */
export interface ApiResponse<T = any> {
  /** Whether the request was successful */
  success: boolean;
  /** Data returned on successful requests (undefined for errors) */
  data?: T;
  /** Error message for failed requests (undefined for success) */
  error?: string;
  /** Additional metadata */
  meta?: {
    /** Pagination information for list endpoints */
    pagination?: {
      /** Current page number (1-based) */
      page: number;
      /** Items per page */
      limit: number;
      /** Total number of items */
      total: number;
      /** Total number of pages */
      totalPages: number;
    };
    /** Unique identifier for request tracking */
    requestId: string;
    /** ISO timestamp of when the response was generated */
    timestamp: string;
  };
}

/**
 * Log level for structured logging
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

/**
 * Context information for logs
 */
export interface LogContext {
  /** Unique request identifier for tracing */
  requestId: string;
  /** Environment (development or production) */
  environment: 'dev' | 'prod';
  /** User ID if authenticated */
  userId?: string;
  /** Client ID if applicable */
  clientId?: string;
  /** Operation being performed */
  operation?: string;
  /** Additional contextual information */
  [key: string]: any;
}

/**
 * Structure for log entries
 */
export interface LogEntry {
  /** Log severity level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Contextual information */
  context: LogContext;
  /** Timestamp when log was created */
  timestamp: string;
}

/**
 * Purpose types for state transfer
 */
export type StateTransferPurpose = 
  | 'auth_flow'
  | 'password_reset'
  | 'email_verification'
  | 'form_persistence'
  | 'wizard_progress'
  | string; // Allows for custom namespace formats
