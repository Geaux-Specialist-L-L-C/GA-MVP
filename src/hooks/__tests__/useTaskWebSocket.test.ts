import { renderHook } from '@testing-library/react';
import { useTaskWebSocket } from '../useTaskWebSocket';
import websocketService from '../../services/websocketService';
import type { TaskStatus } from '../../types/task';

// Mock the websocketService module
jest.mock('../../services/websocketService', () => ({
  __esModule: true,
  default: {
    subscribe: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined),
    subscribeToTask: jest.fn(),
    hasActiveSubscriptions: jest.fn(),
    disconnect: jest.fn()
  }
}));

describe('useTaskWebSocket', () => {
  const mockWebsocketService = websocketService as jest.Mocked<typeof websocketService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should cleanup subscriptions on unmount', async () => {
    const mockUnsubscribe = jest.fn();
    mockWebsocketService.subscribe.mockReturnValue(mockUnsubscribe);
    mockWebsocketService.hasActiveSubscriptions.mockReturnValue(false);

    const { unmount } = renderHook(() => useTaskWebSocket('test-task-id'));

    // Trigger unmount
    unmount();

    // Should call unsubscribe for each event type
    expect(mockUnsubscribe).toHaveBeenCalledTimes(5);

    // Should check for active subscriptions
    expect(mockWebsocketService.hasActiveSubscriptions).toHaveBeenCalled();

    // Should disconnect if no active subscriptions
    expect(mockWebsocketService.disconnect).toHaveBeenCalled();
  });

  it('should not disconnect if there are other active subscriptions', () => {
    const mockUnsubscribe = jest.fn();
    mockWebsocketService.subscribe.mockReturnValue(mockUnsubscribe);
    mockWebsocketService.hasActiveSubscriptions.mockReturnValue(true);

    const { unmount } = renderHook(() => useTaskWebSocket('test-task-id'));

    unmount();

    expect(mockWebsocketService.disconnect).not.toHaveBeenCalled();
  });

  it('should reset state when taskId changes', () => {
    const mockUnsubscribe = jest.fn();
    mockWebsocketService.subscribe.mockReturnValue(mockUnsubscribe);

    const { result, rerender } = renderHook(
      (props: { taskId: string | null }) => useTaskWebSocket(props.taskId),
      { initialProps: { taskId: 'task-1' } }
    );

    // Get the task update callback that was registered
    const [[, taskUpdateCallback]] = (mockWebsocketService.subscribe as jest.Mock).mock.calls
      .filter(([eventName]: [string]) => eventName === 'task_update');

    // Simulate receiving a task update
    const mockStatus: TaskStatus = {
      status: 'in_progress',
      task_id: 'task-1'
    };
    taskUpdateCallback(mockStatus);

    expect(result.current.status).toEqual(mockStatus);

    // Change taskId
    rerender({ taskId: 'task-2' });

    // State should be reset
    expect(result.current.status).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
