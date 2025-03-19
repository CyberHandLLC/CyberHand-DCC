import { ApiError, ApiResponse, ErrorNotification, ErrorSeverity } from '../api/types/api.types';

/**
 * Default error messages by status code
 */
const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'You need to be logged in to access this resource.',
  403: 'You don\'t have permission to access this resource.',
  404: 'The requested resource was not found.',
  409: 'There was a conflict with your request.',
  422: 'We couldn\'t process your request. Please check your input.',
  429: 'Too many requests. Please try again later.',
  500: 'Something went wrong on our end. We\'re working to fix it.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
  504: 'Request timed out. Please try again later.',
};

/**
 * Error categories mapped to severities for UI display
 */
const ERROR_SEVERITY_MAP: Record<number, ErrorSeverity> = {
  400: ErrorSeverity.WARNING,
  401: ErrorSeverity.WARNING,
  403: ErrorSeverity.WARNING,
  404: ErrorSeverity.WARNING,
  409: ErrorSeverity.WARNING,
  422: ErrorSeverity.WARNING,
  429: ErrorSeverity.WARNING,
  500: ErrorSeverity.ERROR,
  502: ErrorSeverity.ERROR,
  503: ErrorSeverity.ERROR,
  504: ErrorSeverity.ERROR,
};

/**
 * Parse error from any source into a standardized ApiError
 */
export const parseError = (error: any): ApiError => {
  // Already a structured API error
  if (error?.statusCode && error?.message) {
    return error as ApiError;
  }

  // Error from API response
  if (error?.response?.data) {
    const responseData = error.response.data as ApiResponse;
    return {
      message: responseData.error || 'An unexpected error occurred',
      statusCode: error.response.status || 500,
      requestId: responseData.meta?.requestId,
      timestamp: responseData.meta?.timestamp,
    };
  }

  // Network error
  if (error?.message === 'Network Error') {
    return {
      message: 'Unable to connect to the server. Please check your internet connection.',
      statusCode: 0,
      code: 'NETWORK_ERROR',
    };
  }

  // Request timeout
  if (error?.code === 'ECONNABORTED') {
    return {
      message: 'Request timed out. Please try again later.',
      statusCode: 408,
      code: 'TIMEOUT',
    };
  }

  // Generic error
  return {
    message: error?.message || 'An unexpected error occurred',
    statusCode: 500,
  };
};

/**
 * Get a user-friendly error message based on the error
 */
export const getUserFriendlyErrorMessage = (error: ApiError): string => {
  // Use the error message if it's already user-friendly
  if (error.message && !error.message.includes('Error:') && !error.message.includes('Exception:')) {
    return error.message;
  }

  // Use default message based on status code
  return DEFAULT_ERROR_MESSAGES[error.statusCode] || 'An unexpected error occurred. Please try again later.';
};

/**
 * Create a user-facing error notification from an API error
 */
export const createErrorNotification = (error: ApiError): ErrorNotification => {
  const friendlyMessage = getUserFriendlyErrorMessage(error);
  const severity = ERROR_SEVERITY_MAP[error.statusCode] || ErrorSeverity.ERROR;
  
  return {
    id: Math.random().toString(36).substring(2, 15), // Simple random ID
    message: friendlyMessage,
    severity,
    requestId: error.requestId,
    timestamp: error.timestamp || new Date().toISOString(),
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  };
};

/**
 * Log error to backend logs endpoint
 */
export const logErrorToServer = async (error: ApiError, context: Record<string, any> = {}): Promise<void> => {
  try {
    const logData = {
      level: 'error',
      message: error.message,
      context: {
        ...context,
        statusCode: error.statusCode,
        requestId: error.requestId,
        timestamp: error.timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
    };

    // Don't await to avoid blocking
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
      // Don't set credentials here to avoid CORS issues when the error is auth-related
    }).catch(() => {
      // Silent fail - we don't want logging errors to cause more errors
      console.error('Failed to send error log to server');
    });
  } catch (logError) {
    // Fail silently - this is just for logging
    console.error('Failed to log error to server:', logError);
  }
};

/**
 * Main error handler function that processes error, logs it, and returns a user-friendly notification
 */
export const handleError = async (
  error: any, 
  context: Record<string, any> = {}
): Promise<ErrorNotification> => {
  // Parse to standard format
  const apiError = parseError(error);
  
  // Create user notification
  const notification = createErrorNotification(apiError);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', apiError, context);
  }
  
  // Log to server
  await logErrorToServer(apiError, {
    ...context,
    notificationId: notification.id,
  });
  
  return notification;
};

/**
 * Create a Promise that rejects with a standard API error
 */
export const createErrorResponse = (
  message: string, 
  statusCode: number = 500, 
  code?: string
): Promise<never> => {
  return Promise.reject({
    message,
    statusCode,
    code,
    timestamp: new Date().toISOString(),
  } as ApiError);
};
