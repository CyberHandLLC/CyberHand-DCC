import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../utils/errorHandler';
import { ApiResponse } from './types/api.types';

// Get API URL from environment or use a default
const getApiBaseUrl = (): string => {
  // Check if running in Node.js environment
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback for browser environment or if env var is not defined
  return 'http://localhost:4000/api';
};

// Default API configuration
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Create configured axios instance for API requests
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // Required for cookies/auth
  });

  // Add request interceptor for correlation IDs and other common headers
  client.interceptors.request.use(
    (config) => {
      // Add a unique request ID for tracing
      config.headers = config.headers || {};
      config.headers['X-Request-ID'] = config.headers['X-Request-ID'] || uuidv4();
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Get request context for error logging
      const requestConfig = error.config || {};
      const context = {
        url: requestConfig.url,
        method: requestConfig.method,
        requestId: requestConfig.headers?.['X-Request-ID'],
      };

      // Let the error handler process it
      await handleError(error, context);
      
      // Continue the rejection for the calling code to handle
      return Promise.reject(error);
    }
  );

  return client;
};

// Create the API client instance
const apiClient = createApiClient();

/**
 * Generic API request function with typed response
 */
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient(config);
    return response.data;
  } catch (error) {
    // We've already handled the error in our interceptor,
    // but we need to re-throw to let the calling code know something went wrong
    throw error;
  }
};

/**
 * Convenience methods for common HTTP verbs
 */
export const apiGet = <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ ...config, method: 'GET', url });
};

export const apiPost = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ ...config, method: 'POST', url, data });
};

export const apiPut = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ ...config, method: 'PUT', url, data });
};

export const apiPatch = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ ...config, method: 'PATCH', url, data });
};

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>({ ...config, method: 'DELETE', url });
};

export default apiClient;
