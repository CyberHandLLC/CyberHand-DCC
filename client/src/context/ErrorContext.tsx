import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ErrorNotification } from '../api/types/api.types';

interface ErrorContextType {
  errors: ErrorNotification[];
  addError: (error: ErrorNotification) => void;
  removeError: (errorId: string) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
}

/**
 * Provider component that wraps your app and makes error functions available
 */
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  maxErrors = 5 
}) => {
  const [errors, setErrors] = useState<ErrorNotification[]>([]);

  const addError = useCallback((error: ErrorNotification) => {
    setErrors(prevErrors => {
      // Add new error and limit the total number
      const updatedErrors = [error, ...prevErrors].slice(0, maxErrors);
      return updatedErrors;
    });

    // Auto-dismiss non-critical errors after 5 seconds
    if (error.severity !== 'critical') {
      setTimeout(() => {
        removeError(error.id);
      }, 5000);
    }
  }, [maxErrors]);

  const removeError = useCallback((errorId: string) => {
    setErrors(prevErrors => 
      prevErrors.map(error => 
        error.id === errorId ? { ...error, dismissed: true } : error
      )
    );
    
    // Actually remove from state after animation (500ms)
    setTimeout(() => {
      setErrors(prevErrors => prevErrors.filter(error => error.id !== errorId));
    }, 500);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

/**
 * Hook for components to consume the error context
 */
export const useErrors = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrors must be used within an ErrorProvider');
  }
  return context;
};
