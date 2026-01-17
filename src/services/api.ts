import axios, { type AxiosInstance } from 'axios';
import { auth } from '@/config/firebase';

const envBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
const fallbackBaseUrl = 'http://localhost:8080';
export const apiBaseUrl = envBaseUrl || fallbackBaseUrl;

if (import.meta.env.PROD && !envBaseUrl) {
  console.warn('[api] VITE_API_BASE_URL is not set for production builds.');
}

export const buildApiUrl = (path: string): string => {
  const base = apiBaseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true);
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed. Logging out...', refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message,
    });

    let errorMessage = 'An error occurred. Please try again.';
    switch (error.response?.status) {
      case 400:
        errorMessage = 'Bad request. Please check your input.';
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 500:
        errorMessage = 'Internal server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service unavailable. Please try again later.';
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);
