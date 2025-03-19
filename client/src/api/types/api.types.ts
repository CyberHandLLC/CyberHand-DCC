/**
 * Standard API response structure
 * @template T The data type for successful responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    requestId: string;
    timestamp: string;
    [key: string]: any;
  };
}

/**
 * Error response structure for custom application errors
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  requestId?: string;
  timestamp?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Error severity levels for UI display
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * User-facing error notification structure
 */
export interface ErrorNotification {
  id: string;
  message: string;
  severity: ErrorSeverity;
  requestId?: string;
  timestamp: string;
  details?: string;
  dismissed?: boolean;
}
