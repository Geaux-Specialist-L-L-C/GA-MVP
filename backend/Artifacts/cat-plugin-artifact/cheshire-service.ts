// File: functions/src/services/cheshire.ts
import axios, { AxiosInstance } from 'axios';
import { logger } from 'firebase-functions';
import { config } from '../config';

class CheshireService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = config.cheshire.apiUrl;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.cheshire.apiToken}`
      },
      timeout: 30000 // 30 second timeout
    });

    // Add logging interceptor
    this.client.interceptors.request.use(request => {
      logger.debug('Cheshire API Request:', {
        method: request.method,
        url: request.url,
        structuredData: true
      });
      return request;
    });

    this.client.interceptors.response.use(
      response => {
        logger.debug('Cheshire API Response:', {
          status: response.status,
          structuredData: true
        });
        return response;
      },
      error => {
        logger.error('Cheshire API Error:', {
          error: error.message,
          status: error.response?.status,
          structuredData: true
        });
        throw error;
      }
    );
  }

  /**
   * Store content in episodic memory
   */
  async storeEpisodicMemory(
    content: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      await this.client.post('/memory/collections/episodic/points', {
        content,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Failed to store episodic memory:', error);
      throw error;
    }
  }

  /**
   * Search episodic memory for patterns
   */
  async searchEpisodicMemory(
    query: string,
    metadata?: Record<string, any>,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const response = await this.client.post('/memory/recall', {
        text: query,
        metadata,
        k: limit
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to search episodic memory:', error);
      throw error;
    }
  }

  /**
   * Store curriculum in declarative memory
   */
  async storeDeclarativeMemory(
    content: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      await this.client.post('/memory/collections/declarative/points', {
        content,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Failed to store declarative memory:', error);
      throw error;
    }
  }

  /**
   * Process content through Rabbit Hole
   */
  async processRabbitHole(
    content: string,
    options: {
      chunkSize?: number;
      chunkOverlap?: number;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('content', content);
      
      if (options.chunkSize) {
        formData.append('chunk_size', options.chunkSize.toString());
      }
      
      if (options.chunkOverlap) {
        formData.append('chunk_overlap', options.chunkOverlap.toString());
      }
      
      if (options.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata));
      }

      await this.client.post('/rabbithole/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      logger.error('Failed to process through Rabbit Hole:', error);
      throw error;
    }
  }

  /**
   * Make generic request to Cheshire Cat API
   */
  async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method,
        url: endpoint,
        data
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  // Shorthand methods
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }
}

export const cheshireService = new CheshireService();