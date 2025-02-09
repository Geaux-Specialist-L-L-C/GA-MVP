import axios from 'axios';
import { auth } from '../firebase/config';

const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL;
const CHESHIRE_ADMIN_PASSWORD = import.meta.env.VITE_CHESHIRE_ADMIN_PASSWORD;

// Validate environment variables
if (!CHESHIRE_API_URL) {
  console.error('VITE_CHESHIRE_API_URL environment variable is not set');
}
if (!CHESHIRE_ADMIN_PASSWORD) {
  console.error('VITE_CHESHIRE_ADMIN_PASSWORD environment variable is not set');
}

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

  private static async authenticateWithCheshire(): Promise<string> {
    try {
      if (!CHESHIRE_API_URL || !CHESHIRE_ADMIN_PASSWORD) {
        throw new Error('Missing Cheshire API configuration');
      }

      const response = await axios.post<AuthResponse>(
        `${CHESHIRE_API_URL}/auth/token`,
        {
          username: 'admin',
          password: CHESHIRE_ADMIN_PASSWORD
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.data?.access_token) {
        throw new Error('Invalid authentication response');
      }

      this.cheshireToken = response.data.access_token;
      return this.cheshireToken;
    } catch (error: any) {
      console.error('Cheshire authentication failed:', error);
      if (error.response?.status === 400) {
        console.error('Invalid credentials or malformed request');
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

  static async checkConnection(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      await axios.get(`${CHESHIRE_API_URL}/`, {
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

    const response = await axios.post<CheshireResponse>(
      `${CHESHIRE_API_URL}/message`, 
      {
        text: message,
        firebase_token: firebaseToken // Include Firebase token for user verification
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`
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
      await axios.post(
        `${CHESHIRE_API_URL}/users/`,
        {
          ...payload,
          firebase_token: firebaseToken // Include Firebase token for user verification
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
    if (error.response?.status === 401) {
      this.cheshireToken = null; // Clear invalid token
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