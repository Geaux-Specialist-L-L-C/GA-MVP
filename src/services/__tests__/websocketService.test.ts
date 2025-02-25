// File: /src/services/__tests__/websocketService.test.ts
// Description: Unit tests for WebSocket service

import { WebSocketService } from '../websocketService';
import { TaskStatus, TaskResult } from '../../types/task';

// Mock WebSocket
class MockWebSocket {
  private listeners: Record<string, Function[]> = {
    open: [],
    message: [],
    close: [],
    error: []
  };
  public readyState = 0;

  constructor(public url: string) {
    setTimeout(() => {
      this.readyState = 1;
      this.listeners.open.forEach(listener => listener());
    }, 0);
  }

  addEventListener(event: string, listener: Function) {
    this.listeners[event].push(listener);
  }

  send(data: string) {}

  close() {
    this.readyState = 3;
    this.listeners.close.forEach(listener => listener());
  }

  // Helper to simulate incoming messages
  _receiveMessage(data: any) {
    this.listeners.message.forEach(listener => 
      listener({ data: JSON.stringify(data) })
    );
  }

  // Helper to simulate errors
  _triggerError() {
    this.listeners.error.forEach(listener => listener());
  }
}

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('WebSocketService', () => {
  let service: WebSocketService;
  const baseUrl = 'ws://test.com';

  beforeEach(() => {
    // Reset mocks
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.setItem.mockReset();
    mockLocalStorage.clear.mockReset();

    // Create new service instance
    service = new WebSocketService(baseUrl);

    // Mock WebSocket global
    (global as any).WebSocket = MockWebSocket;
  });

  it('should connect to WebSocket server with auth token', async () => {
    const mockToken = 'test-token';
    mockLocalStorage.getItem.mockResolvedValue(mockToken);

    let connected = false;
    service.subscribe('connect', () => {
      connected = true;
    });

    await service.connect();
    expect(connected).toBe(true);
  });

  it('should handle task updates correctly', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    const mockStatus: TaskStatus = {
      status: 'in_progress',
      task_id: 'test-123',
      last_updated: new Date().toISOString()
    };

    let receivedStatus: TaskStatus | null = null;
    service.subscribe('task_update', (status) => {
      receivedStatus = status;
    });

    // Simulate incoming task update
    (global as any).WebSocket.prototype._receiveMessage({
      type: 'task_update',
      status: mockStatus
    });

    expect(receivedStatus).toEqual(mockStatus);
  });

  it('should handle task results correctly', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    const mockResult: TaskResult = {
      content: { test: 'data' }
    };

    let receivedResult: TaskResult | null = null;
    service.subscribe('task_result', (result) => {
      receivedResult = result;
    });

    // Simulate incoming task result
    (global as any).WebSocket.prototype._receiveMessage({
      type: 'task_result',
      result: mockResult
    });

    expect(receivedResult).toEqual(mockResult);
  });

  it('should attempt reconnection on disconnect', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    let disconnectCount = 0;
    let connectCount = 0;

    service.subscribe('disconnect', () => {
      disconnectCount++;
    });

    service.subscribe('connect', () => {
      connectCount++;
    });

    // Simulate disconnect
    (global as any).WebSocket.prototype._triggerError();

    // Wait for reconnect attempt
    await new Promise(resolve => setTimeout(resolve, 2000));

    expect(disconnectCount).toBeGreaterThan(0);
    expect(connectCount).toBeGreaterThan(1);
  });

  it('should handle subscription acknowledgments', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    let receivedAck: { task_id: string } | null = null;
    service.subscribe('subscription_ack', (ack) => {
      receivedAck = ack;
    });

    const mockTaskId = 'test-123';
    service.subscribeToTask(mockTaskId);

    // Simulate subscription acknowledgment
    (global as any).WebSocket.prototype._receiveMessage({
      type: 'subscription_ack',
      task_id: mockTaskId
    });

    expect(receivedAck).toEqual({ task_id: mockTaskId });
  });

  it('should clean up resources on disconnect', async () => {
    mockLocalStorage.getItem.mockResolvedValue('test-token');
    await service.connect();

    let disconnected = false;
    service.subscribe('disconnect', () => {
      disconnected = true;
    });

    service.disconnect();
    expect(disconnected).toBe(true);
  });
});