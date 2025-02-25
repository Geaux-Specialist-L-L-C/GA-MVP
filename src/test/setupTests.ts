// File: /src/test/setupTests.ts
// Description: Jest setup configuration for testing WebSocket functionality

import '@testing-library/jest-dom';

// Mock WebSocket
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: { error: Error }) => void) | null = null;
  readyState: number = WebSocket.CONNECTING;
  url: string;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
    
    // Simulate connection
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.();
    }, 0);
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose?.();
  }

  send(data: string) {
    // Mock send implementation
  }

  // Test helper methods
  static mockMessage(data: any) {
    MockWebSocket.instances.forEach(instance => {
      instance.onmessage?.({ data: JSON.stringify(data) });
    });
  }

  static mockError(error: Error) {
    MockWebSocket.instances.forEach(instance => {
      instance.onerror?.({ error });
    });
  }

  static mockClose() {
    MockWebSocket.instances.forEach(instance => {
      instance.close();
    });
  }

  static reset() {
    MockWebSocket.instances = [];
  }
}

// Mock window.WebSocket
(global as any).WebSocket = MockWebSocket;

// Reset WebSocket mocks between tests
beforeEach(() => {
  MockWebSocket.reset();
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });