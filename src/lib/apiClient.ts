// File: /src/lib/apiClient.ts
// Description: Axios client configuration with interceptors
// Author: GitHub Copilot
// Created: 2024-02-20

import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { getAuth } from 'firebase/auth';

const baseURL = process.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const customError = {
      code: error.response?.status?.toString() || 'UNKNOWN',
      message: 'An unexpected error occurred',
    };

    if (error.response?.status === 401) {
      customError.message = 'Authentication required';
    } else if (error.response?.status === 403) {
      customError.message = 'You do not have permission to perform this action';
    } else if (error.response?.status === 404) {
      customError.message = 'Resource not found';
    } else if (error.response?.status === 429) {
      customError.message = 'Too many requests. Please try again later';
    } else if (error.response?.status >= 500) {
      customError.message = 'Server error. Please try again later';
    }

    return Promise.reject(customError);
  }
);

export interface ApiClientConfig extends AxiosRequestConfig {
  secure?: boolean;
}

export const createRequest = async <T>(
  config: ApiClientConfig
): Promise<T> => {
  // Check for secure context when required
  if (config.secure && !window.isSecureContext && process.env.NODE_ENV !== 'development') {
    throw new Error('This operation requires a secure context (HTTPS)');
  }

  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};