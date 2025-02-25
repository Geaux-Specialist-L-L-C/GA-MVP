// File: /src/services/websocketService.ts
// Description: WebSocket service for handling real-time task updates
import { TaskStatus, TaskResult } from '../types/task';

export interface WebSocketMessage {
  type: string;
  task_id?: string;
  status?: TaskStatus;
  result?: TaskResult;
  error?: string;
}

interface WebSocketEventMap {
  connect: void;
  disconnect: void;
  error: Error;
  task_update: TaskStatus;
  task_result: TaskResult;
  subscription_ack: { task_id: string };
}

type WebSocketEventListener<K extends keyof WebSocketEventMap> = 
  (data: WebSocketEventMap[K]) => void;

type EventListeners = {
  [K in keyof WebSocketEventMap]: Set<WebSocketEventListener<K>>;
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;
  // Change the listeners type to use a more flexible Record type
  private listeners: Record<keyof WebSocketEventMap, Set<any>> = {
    connect: new Set(),
    disconnect: new Set(),
    error: new Set(),
    task_update: new Set(),
    task_result: new Set(),
    subscription_ack: new Set()
  };
  private pendingMessages: string[] = [];
  private isConnecting = false;

  constructor(private readonly baseUrl: string) {}

  private async getAuthToken(): Promise<string | null> {
    try {
      // This should be implemented based on your authentication method
      return await localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      this.ws = new WebSocket(`${this.baseUrl}/ws/tasks/${token}`);
      
      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connect', undefined);
        
        // Send any pending messages
        while (this.pendingMessages.length > 0) {
          const message = this.pendingMessages.shift();
          if (message) this.send(message);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'task_update':
              if (message.status) {
                this.emit('task_update', message.status);
              }
              break;
            
            case 'task_result':
              if (message.result) {
                this.emit('task_result', message.result);
              }
              break;
            
            case 'subscription_ack':
              if (message.task_id) {
                this.emit('subscription_ack', { task_id: message.task_id });
              }
              break;
            
            case 'error':
              if (message.error) {
                this.emit('error', new Error(message.error));
              }
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.emit('disconnect', undefined);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        this.isConnecting = false;
        this.emit('error', new Error('WebSocket error occurred'));
      };
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }

  private getBackoffDelay(): number {
    // Calculate exponential backoff with random jitter
    const minDelay = 1000; // 1 second minimum
    const maxDelay = 30000; // 30 seconds maximum
    const baseDelay = Math.min(
      minDelay * Math.pow(2, this.reconnectAttempts),
      maxDelay
    );
    
    // Add random jitter (±30%)
    const jitter = baseDelay * 0.3 * (Math.random() * 2 - 1);
    return Math.max(minDelay, Math.min(baseDelay + jitter, maxDelay));
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('Failed to reconnect after maximum attempts'));
      return;
    }

    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = this.getBackoffDelay();
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  subscribe<K extends keyof WebSocketEventMap>(
    event: K,
    listener: WebSocketEventListener<K>
  ): () => void {
    this.listeners[event].add(listener);
    
    return () => {
      this.listeners[event].delete(listener);
    };
  }

  private emit<K extends keyof WebSocketEventMap>(
    event: K,
    data: WebSocketEventMap[K]
  ): void {
    this.listeners[event].forEach((listener: WebSocketEventListener<K>) => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  subscribeToTask(taskId: string): void {
    const message = JSON.stringify({
      type: 'subscribe_task',
      task_id: taskId
    });

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send(message);
    } else {
      this.pendingMessages.push(message);
      this.connect().catch(error => {
        console.error('Error connecting to WebSocket:', error);
      });
    }
  }

  private send(message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.pendingMessages.push(message);
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  hasActiveSubscriptions(): boolean {
    // Check if there are any active listeners for task-related events
    return (
      this.listeners.task_update.size > 0 ||
      this.listeners.task_result.size > 0 ||
      this.listeners.subscription_ack.size > 0
    );
  }
}

export const websocketService = new WebSocketService(
  process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000'
);

export default websocketService;