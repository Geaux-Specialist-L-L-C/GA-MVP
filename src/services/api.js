import axios from 'axios';
import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://learn.geaux.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add request interceptor for auth headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Get a fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors and try token refresh
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
        console.error("Token refresh failed. Logging out...", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    // Handle other error cases
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message
    });

    // Enhanced error handling
    let errorMessage = "An error occurred. Please try again.";
    switch (error.response?.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
