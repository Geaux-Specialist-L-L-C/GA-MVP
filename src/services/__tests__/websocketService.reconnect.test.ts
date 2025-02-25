// File: /src/services/__tests__/websocketService.reconnect.test.ts
import websocketService from '../websocketService';
import { WebSocketMock } from '../../test/mocks/WebSocketMock';

describe('WebSocketService - Reconnection', () => {
  let mockWebSocket: WebSocketMock;
  
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.getItem = jest.fn().mockResolvedValue('test-token');
    
    mockWebSocket = new WebSocketMock('ws://test.com');
    
    // Assign the mock constructor to global WebSocket
    (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should attempt reconnection with exponential backoff', async () => {
    const connectSpy = jest.spyOn(websocketService as any, 'connect');
    await websocketService.connect();

    // Simulate connection error and close
    mockWebSocket.mockError();
    mockWebSocket.mockClose();

    // First reconnect attempt (1s ± 30% jitter)
    jest.advanceTimersByTime(1000);
    expect(connectSpy).toHaveBeenCalledTimes(2);

    // Second reconnect attempt (2s ± 30% jitter)
    jest.advanceTimersByTime(2000);
    expect(connectSpy).toHaveBeenCalledTimes(3);

    // Third reconnect attempt (4s ± 30% jitter)
    jest.advanceTimersByTime(4000);
    expect(connectSpy).toHaveBeenCalledTimes(4);
  });

  it('should stop reconnecting after max attempts', async () => {
    const connectSpy = jest.spyOn(websocketService as any, 'connect');
    const errorHandler = jest.fn();
    websocketService.subscribe('error', errorHandler);
    
    await websocketService.connect();

    // Simulate multiple connection failures
    for (let i = 0; i < 6; i++) {
      mockWebSocket.mockError();
      mockWebSocket.mockClose();
      jest.advanceTimersByTime(30000);
    }

    expect(connectSpy).toHaveBeenCalledTimes(6); // Initial + 5 retries
    expect(errorHandler).toHaveBeenCalledWith(
      expect.any(Error)
    );
    expect(errorHandler.mock.calls[0][0].message).toMatch(/Failed to reconnect/);
  });

  it('should reset reconnection attempts on successful connection', async () => {
    await websocketService.connect();

    // Simulate two failed connections
    mockWebSocket.mockError();
    mockWebSocket.mockClose();
    jest.advanceTimersByTime(1000);
    
    mockWebSocket.mockError();
    mockWebSocket.mockClose();
    jest.advanceTimersByTime(2000);

    // Simulate successful connection
    mockWebSocket.mockSetReadyState(WebSocketMock.OPEN);
    mockWebSocket.mockOpen();

    // Verify attempts were reset by checking next reconnection
    mockWebSocket.mockError();
    mockWebSocket.mockClose();

    const reconnectSpy = jest.spyOn(websocketService as any, 'attemptReconnect');
    jest.advanceTimersByTime(1000);

    expect(reconnectSpy).toHaveBeenCalled();
    expect(websocketService as any).toHaveProperty('reconnectAttempts', 1);
  });

  it('should maintain message queue during reconnection', async () => {
    await websocketService.connect();
    
    // Queue a message while disconnected
    mockWebSocket.mockSetReadyState(WebSocketMock.CLOSED);
    websocketService.subscribeToTask('test-task');

    // Create new mock for reconnection
    const newMockWebSocket = new WebSocketMock('ws://test.com');
    const sendSpy = jest.spyOn(newMockWebSocket, 'send');
    
    // Update the mock WebSocket constructor
    (global as any).WebSocket = jest.fn().mockImplementation(() => newMockWebSocket);
    
    await websocketService.connect();
    newMockWebSocket.mockOpen();

    expect(sendSpy).toHaveBeenCalledWith(
      expect.stringContaining('test-task')
    );
  });
});