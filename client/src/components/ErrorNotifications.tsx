import React from 'react';
import { useErrors } from '../context/ErrorContext';
import { ErrorSeverity } from '../api/types/api.types';

// Environment variable check that works in both browser and Node.js contexts
const isDevelopment = (): boolean => {
  // The safer way to check for Node.js environment in TypeScript
  if (typeof process !== 'undefined' && 
      process.env && 
      process.env.NODE_ENV) {
    return process.env.NODE_ENV === 'development';
  }
  // Check for browser environment variables
  if (typeof window !== 'undefined' && 
      'ENV' in window && 
      window.ENV && 
      'NODE_ENV' in window.ENV) {
    return window.ENV.NODE_ENV === 'development';
  }
  return false;
};

// Styles for notification types
const severityStyles: Record<ErrorSeverity, { bgColor: string; textColor: string; icon: string }> = {
  [ErrorSeverity.INFO]: {
    bgColor: 'bg-blue-50 border-blue-300',
    textColor: 'text-blue-800',
    icon: 'ℹ️'
  },
  [ErrorSeverity.WARNING]: {
    bgColor: 'bg-yellow-50 border-yellow-300',
    textColor: 'text-yellow-800',
    icon: '⚠️'
  },
  [ErrorSeverity.ERROR]: {
    bgColor: 'bg-red-50 border-red-300',
    textColor: 'text-red-800',
    icon: '❌'
  },
  [ErrorSeverity.CRITICAL]: {
    bgColor: 'bg-purple-50 border-purple-300',
    textColor: 'text-purple-800',
    icon: '🔥'
  },
};

/**
 * Individual error notification component
 */
const ErrorNotification: React.FC<{
  id: string;
  message: string;
  severity: ErrorSeverity;
  requestId?: string;
  details?: string;
  dismissed?: boolean;
  onClose: (id: string) => void;
}> = ({ id, message, severity, requestId, details, dismissed, onClose }) => {
  const style = severityStyles[severity];
  
  return (
    <div 
      className={`rounded-md border p-4 mb-3 shadow-md transition-all duration-300 ${style.bgColor} ${
        dismissed ? 'opacity-0 transform translate-y-2' : 'opacity-100'
      }`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <span className="text-lg">{style.icon}</span>
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${style.textColor}`}>{message}</p>
          
          {isDevelopment() && details && (
            <p className={`mt-1 text-xs ${style.textColor} opacity-75`}>{details}</p>
          )}
          
          {isDevelopment() && requestId && (
            <p className={`mt-1 text-xs ${style.textColor} opacity-60`}>
              Request ID: {requestId}
            </p>
          )}
        </div>
        <div>
          <button
            type="button"
            className={`${style.textColor} hover:bg-gray-200 rounded p-1`}
            onClick={() => onClose(id)}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Container component that displays all active error notifications
 */
const ErrorNotifications: React.FC = () => {
  const { errors, removeError } = useErrors();
  
  if (errors.length === 0) {
    return null;
  }
  
  return (
    <div 
      className="fixed right-0 top-0 pt-16 pr-4 z-50 max-w-sm w-full"
      aria-live="assertive"
    >
      {errors.map((error) => (
        <ErrorNotification
          key={error.id}
          id={error.id}
          message={error.message}
          severity={error.severity}
          requestId={error.requestId}
          details={error.details}
          dismissed={error.dismissed}
          onClose={removeError}
        />
      ))}
    </div>
  );
};

export default ErrorNotifications;
