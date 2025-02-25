// File: /src/components/common/__tests__/ConnectionStatus.test.tsx
// Description: Tests for ConnectionStatus component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionStatus } from '../ConnectionStatus';
import websocketService from '../../../services/websocketService';

// Mock websocketService
jest.mock('../../../services/websocketService', () => ({
  __esModule: true,
  default: {
    connect: jest.fn()
  }
}));

describe('ConnectionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays connected status when connected', () => {
    render(<ConnectionStatus isConnected={true} />);
    
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.queryByText('Retry Connection')).not.toBeInTheDocument();
  });

  it('displays disconnected status with retry button when disconnected', () => {
    render(<ConnectionStatus isConnected={false} />);
    
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.getByText('Retry Connection')).toBeInTheDocument();
  });

  it('hides retry button when showRetry is false', () => {
    render(<ConnectionStatus isConnected={false} showRetry={false} />);
    
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(screen.queryByText('Retry Connection')).not.toBeInTheDocument();
  });

  it('calls connect and onRetry when retry button is clicked', () => {
    const mockOnRetry = jest.fn();
    render(<ConnectionStatus isConnected={false} onRetry={mockOnRetry} />);
    
    fireEvent.click(screen.getByText('Retry Connection'));
    
    expect(websocketService.connect).toHaveBeenCalled();
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('handles retry without onRetry callback', () => {
    render(<ConnectionStatus isConnected={false} />);
    
    fireEvent.click(screen.getByText('Retry Connection'));
    
    expect(websocketService.connect).toHaveBeenCalled();
    // Should not throw error without onRetry callback
  });

  it('applies custom className', () => {
    const { container } = render(
      <ConnectionStatus isConnected={true} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});