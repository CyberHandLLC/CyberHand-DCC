import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserData, LoginCredentials, RegisterData } from '../api/services/authService';
import { useApiError } from '../hooks/useApiError';
import { ErrorNotification } from '../api/types/api.types';

// Authentication context state type
interface AuthContextState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ErrorNotification | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Default context state
const defaultAuthContext: AuthContextState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
};

// Create context
const AuthContext = createContext<AuthContextState>(defaultAuthContext);

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const { error, isLoading: apiLoading, setIsLoading, clearError, handleApiCall } = useApiError();
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Combined loading state
  const isLoading = initialLoading || apiLoading;

  // Login user
  const login = async (credentials: LoginCredentials) => {
    const response = await handleApiCall(
      authService.login(credentials),
      { context: 'login', credentials: { email: credentials.email } }
    );
    
    if (response?.success && response.data) {
      setUser(response.data.user);
    } else if (!error) {
      // If handleApiCall didn't set an error but the response was unsuccessful
      throw new Error('Login failed');
    } else {
      // If handleApiCall set an error, re-throw
      throw new Error(error.message);
    }
  };

  // Register new user
  const register = async (userData: RegisterData) => {
    const response = await handleApiCall(
      authService.register(userData),
      { context: 'register', email: userData.email }
    );
    
    if (response?.success && response.data) {
      setUser(response.data.user);
    } else if (!error) {
      // If handleApiCall didn't set an error but the response was unsuccessful
      throw new Error('Registration failed');
    } else {
      // If handleApiCall set an error, re-throw
      throw new Error(error.message);
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    try {
      await handleApiCall(
        authService.logout(),
        { context: 'logout' }
      );
      // Always clear user data even if API call fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user on initial mount
  useEffect(() => {
    const loadUser = async () => {
      setInitialLoading(true);
      try {
        const response = await authService.getCurrentUser();
        
        if (response.success && response.data) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setUser(null);
        // We don't show the error to user on initial load as it's expected that they might not be logged in
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, []);

  // Context value
  const value: AuthContextState = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
