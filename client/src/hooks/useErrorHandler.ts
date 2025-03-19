import { useCallback } from 'react';
import { useErrors } from '../context/ErrorContext';
import { handleError } from '../utils/errorHandler';
import { ErrorNotification } from '../api/types/api.types';

/**
 * Hook that combines error handling and error context
 * for easy use in any component
 */
export const useErrorHandler = () => {
  const { addError, removeError, clearErrors, errors } = useErrors();

  /**
   * Process an error and display it to the user
   */
  const processError = useCallback(async (
    error: any, 
    context: Record<string, any> = {}
  ): Promise<ErrorNotification> => {
    // Process through the error handler
    const notification = await handleError(error, context);
    
    // Add to the UI via context
    addError(notification);
    
    return notification;
  }, [addError]);

  /**
   * Safely execute a function with error handling
   * @param fn The function to execute
   * @param errorContext Additional context for error logging
   */
  const tryCatch = useCallback(async <T>(
    fn: () => Promise<T>, 
    errorContext: Record<string, any> = {}
  ): Promise<T | undefined> => {
    try {
      return await fn();
    } catch (error) {
      await processError(error, errorContext);
      return undefined;
    }
  }, [processError]);

  return {
    processError,
    tryCatch,
    removeError,
    clearErrors,
    errors,
  };
};

export default useErrorHandler;
