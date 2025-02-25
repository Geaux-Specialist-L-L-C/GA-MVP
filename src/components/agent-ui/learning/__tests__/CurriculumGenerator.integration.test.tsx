// File: /src/components/agent-ui/learning/__tests__/CurriculumGenerator.integration.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CurriculumGenerator } from '../CurriculumGenerator';
import { WebSocketMock } from '../../../../test/mocks/WebSocketMock';
import websocketService from '../../../../services/websocketService';
import { mongoService } from '../../../../services/mongoService';
import { useAuth } from '../../../../contexts/AuthContext';

// Mock dependencies
jest.mock('../../../../contexts/AuthContext');
jest.mock('../../../../services/mongoService');
jest.mock('../../../../services/websocketService');

describe('CurriculumGenerator Integration', () => {
  let mockWebSocket: WebSocketMock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth context
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'test-user' }
    });

    // Mock mongoService
    (mongoService.getLearningStyle as jest.Mock).mockResolvedValue({
      style: 'visual'
    });

    // Setup WebSocket mock
    mockWebSocket = new WebSocketMock('ws://test.com');
    (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
  });

  it('handles complete curriculum generation flow', async () => {
    render(<CurriculumGenerator />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: 'Mathematics' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Generate Curriculum/i));

    // Verify loading state
    expect(screen.getByText(/AI agents are collaborating/i)).toBeInTheDocument();

    // Simulate WebSocket connection
    await act(async () => {
      mockWebSocket.mockOpen();
    });

    // Verify connection status
    expect(screen.getByText(/Connected/i)).toBeInTheDocument();

    // Simulate task progress updates
    await act(async () => {
      mockWebSocket.mockMessage({
        type: 'task_update',
        task_id: 'test-task',
        status: {
          status: 'in_progress',
          details: 'researcher'
        }
      });
    });

    expect(screen.getByText(/Researcher is gathering/i)).toBeInTheDocument();

    // Simulate task completion
    await act(async () => {
      mockWebSocket.mockMessage({
        type: 'task_result',
        task_id: 'test-task',
        result: {
          content: {
            title: 'Mathematics for Visual Learners',
            grade_level: 'elementary',
            modules: [
              {
                title: 'Introduction to Numbers',
                content: 'Test content'
              }
            ],
            learning_style_adaptations: {
              style: 'visual',
              recommendations: ['Use diagrams']
            }
          }
        }
      });
    });

    // Verify curriculum is displayed
    expect(screen.getByText('Mathematics for Visual Learners')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Numbers')).toBeInTheDocument();
  });

  it('handles WebSocket disconnection and reconnection', async () => {
    render(<CurriculumGenerator />);

    // Start task
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: 'Mathematics' }
    });
    fireEvent.click(screen.getByText(/Generate Curriculum/i));

    // Simulate connection
    await act(async () => {
      mockWebSocket.mockOpen();
    });

    // Verify connected state
    expect(screen.getByText(/Connected/i)).toBeInTheDocument();

    // Simulate disconnection
    await act(async () => {
      mockWebSocket.mockClose();
    });

    // Verify disconnected state
    expect(screen.getByText(/Disconnected/i)).toBeInTheDocument();
    expect(screen.getByText(/Retry Connection/i)).toBeInTheDocument();

    // Attempt reconnection
    fireEvent.click(screen.getByText(/Retry Connection/i));

    // Simulate successful reconnection
    await act(async () => {
      mockWebSocket.mockOpen();
    });

    // Verify reconnected state
    expect(screen.getByText(/Connected/i)).toBeInTheDocument();
  });

  it('handles task errors gracefully', async () => {
    render(<CurriculumGenerator />);

    // Start task
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: 'Mathematics' }
    });
    fireEvent.click(screen.getByText(/Generate Curriculum/i));

    // Simulate task failure
    await act(async () => {
      mockWebSocket.mockMessage({
        type: 'task_update',
        task_id: 'test-task',
        status: {
          status: 'failed',
          details: 'Task processing error'
        }
      });
    });

    // Verify error state
    expect(screen.getByText(/Task processing error/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();

    // Verify retry functionality
    fireEvent.click(screen.getByText(/Try Again/i));
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
  });
});