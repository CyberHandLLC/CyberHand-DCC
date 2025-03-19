import { apiPost, apiGet } from '../apiClient';
import { ApiResponse } from '../types/api.types';

// Types for authentication service
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
  staffProfile?: any | null;
  clientProfile?: any | null;
}

export interface LoginResponse {
  user: UserData;
}

export interface RegisterResponse {
  user: UserData;
}

// Service functions for authentication API interactions
const authService = {
  /**
   * Login user with credentials
   * 
   * @param credentials User email and password
   * @returns ApiResponse with user data
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    return apiPost<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Register a new user
   * 
   * @param userData User registration data
   * @returns ApiResponse with created user
   */
  register: async (userData: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    return apiPost<RegisterResponse>('/auth/register', userData);
  },

  /**
   * Get current authenticated user info
   * 
   * @returns ApiResponse with user data
   */
  getCurrentUser: async (): Promise<ApiResponse<{ user: UserData }>> => {
    return apiGet<{ user: UserData }>('/auth/me');
  },

  /**
   * Logout current user
   * 
   * @returns ApiResponse with success status
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return apiPost<void>('/auth/logout');
  },

  /**
   * Refresh authentication tokens
   * 
   * @returns ApiResponse with new tokens
   */
  refreshTokens: async (): Promise<ApiResponse<void>> => {
    return apiPost<void>('/auth/refresh');
  },

  /**
   * Revoke user's tokens
   * 
   * @param options Options for token revocation
   * @returns ApiResponse with count of revoked tokens
   */
  revokeTokens: async (options: { all?: boolean, exceptCurrent?: boolean, tokenIds?: string[] }): Promise<ApiResponse<{ revokedCount: number }>> => {
    return apiPost<{ revokedCount: number }>('/auth/revoke', options);
  }
};

export default authService;
