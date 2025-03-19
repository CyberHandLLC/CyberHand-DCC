import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserData, LoginCredentials, RegisterData } from '../api/services/authService';
import { AxiosError } from 'axios';

// Authentication context state type
interface AuthContextState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear authentication error
  const clearError = () => setError(null);

  // Login user
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.error || 'Authentication failed'
        : 'Authentication failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      clearError();
      
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.error || 'Registration failed'
        : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Force logout even if API fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user on initial mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await authService.getCurrentUser();
        
        if (response.success && response.data) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
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
