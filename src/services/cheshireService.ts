import axios, { AxiosInstance } from 'axios';
import { auth } from '../firebase/config';

const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'Global=Auth'
  },
  withCredentials: true,
  timeout: 30000  // Increased timeout for development
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
  private static cheshireToken: string | null = null;
  private static retryCount = 0;
  private static maxRetries = 3;

  private static async authenticateWithCheshire(): Promise<string> {
    try {
      if (!CHESHIRE_API_URL) {
        throw new Error('Missing Cheshire API configuration');
      }

      const response = await cheshireAxios.post<AuthResponse>(
        '/auth/token',
        {
          username: 'admin',
          password: import.meta.env.VITE_CHESHIRE_ADMIN_PASSWORD || 'admin'
        }
      );
      
      if (!response.data?.access_token) {
        throw new Error('Invalid authentication response');
      }

      this.cheshireToken = response.data.access_token;
      this.retryCount = 0;
      return this.cheshireToken;
    } catch (error: any) {
      console.error('Cheshire authentication failed:', error);
      
      if (error.response?.status === 400) {
        console.error('Invalid credentials or malformed request');
      } else if (error.code === 'ERR_NETWORK') {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`Retrying authentication (attempt ${this.retryCount}/${this.maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
          return this.authenticateWithCheshire();
        }
        console.error('Network error after max retries - Please ensure the TIPI container is running');
      }
      throw error;
    }
  }

  private static async getAuthToken(): Promise<string> {
    if (!this.cheshireToken) {
      await this.authenticateWithCheshire();
    }
    if (!this.cheshireToken) {
      throw new Error('Failed to obtain Cheshire auth token');
    }
    return this.cheshireToken;
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
      
      // Get initial auth token
      await this.getAuthToken();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      await cheshireAxios.get('/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    const token = await this.getAuthToken();
    const firebaseToken = await this.getFirebaseToken();

    if (!firebaseToken) {
      throw new Error('Authentication required');
    }

    const response = await cheshireAxios.post<CheshireResponse>(
      '/message', 
      {
        text: message,
        firebase_token: firebaseToken
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return {
      data: response.data.response,
      memories: response.data.memories
    };
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    const token = await this.getAuthToken();
    const firebaseToken = await this.getFirebaseToken();

    if (!firebaseToken) {
      throw new Error('Authentication required');
    }

    const payload: CheshireUser = {
      username: email,
      permissions: {
        CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
        MEMORY: ["READ", "LIST"],
        STATIC: ["READ"],
        STATUS: ["READ"]
      }
    };

    try {
      await cheshireAxios.post(
        '/users/',
        {
          ...payload,
          firebase_token: firebaseToken
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw error;
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
      this.cheshireToken = null;
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