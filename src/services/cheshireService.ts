import axios, { AxiosInstance } from 'axios';
import { auth } from '../firebase/config';

// Use environment variable if set, otherwise fall back to the production URL
const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Add authentication interceptor
cheshireAxios.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
cheshireAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (CHESHIRE_DEBUG) {
      console.error('Cheshire API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to Cheshire API:', error);
      console.error('Please ensure the TIPI container is running and accessible at:', CHESHIRE_API_URL);
    }
    return Promise.reject(error);
  }
);

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireUser {
  username: string;
  permissions: {
    CONVERSATION: string[];
    MEMORY: string[];
    STATIC: string[];
    STATUS: string[];
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export class CheshireService {
  private static async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static async getFirebaseToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  static async checkTipiHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await cheshireAxios.get('/');
      return {
        status: 'healthy',
        version: response.data.version || 'unknown'
      };
    } catch (error: any) {
      console.error('TIPI health check failed:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('TIPI container is not accessible. Please ensure it is running.');
      }
      throw error;
    }
  }

  static async initialize(): Promise<void> {
    try {
      // Check TIPI container health
      await this.checkTipiHealth();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      await cheshireAxios.get('/', { headers });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await cheshireAxios.post<CheshireResponse>(
        '/message',
        { text: message },
        { headers }
      );
      
      return {
        data: response.data.response,
        memories: response.data.memories
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.getErrorMessage(error);
    }
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const payload: CheshireUser = {
        username: email,
        permissions: {
          CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
          MEMORY: ["READ", "LIST"],
          STATIC: ["READ"],
          STATUS: ["READ"]
        }
      };

      await cheshireAxios.post('/users/', payload, { headers });
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw this.getErrorMessage(error);
    }
  }

  static getErrorMessage(error: any): string {
    if (error.message === 'Authentication required') {
      return "Please log in to continue.";
    }
    if (error.message === 'Failed to obtain Cheshire auth token') {
      return "Unable to connect to the chat service. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.code === 'ERR_NETWORK') {
      if (error.message.includes('CORS')) {
        return "Unable to connect to the chat service due to CORS restrictions. Please contact support.";
      }
      return "Network error - Unable to connect to the chat service. Please check your connection and try again.";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please try again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}