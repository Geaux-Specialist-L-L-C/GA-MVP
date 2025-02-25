// File: /src/components/error-boundaries/__tests__/WebSocketErrorBoundary.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WebSocketErrorBoundary from '../WebSocketErrorBoundary';

// Mock component that throws an error
const ErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test WebSocket error');
  }
  return <div>No error</div>;
};

describe('WebSocketErrorBoundary', () => {
  beforeEach(() => {
    // Reset console.error to prevent noise in test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <WebSocketErrorBoundary>
        <div>Test content</div>
      </WebSocketErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(
      <WebSocketErrorBoundary>
        <ErrorComponent shouldThrow />
      </WebSocketErrorBoundary>
    );

    expect(screen.getByText(/Connection Error/)).toBeInTheDocument();
    expect(screen.getByText(/Retry Connection/)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const mockOnRetry = jest.fn();

    render(
      <WebSocketErrorBoundary onRetry={mockOnRetry}>
        <ErrorComponent shouldThrow />
      </WebSocketErrorBoundary>
    );

    fireEvent.click(screen.getByText(/Retry Connection/));
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('renders custom fallback when provided', () => {
    const fallback = <div>Custom error message</div>;

    render(
      <WebSocketErrorBoundary fallback={fallback}>
        <ErrorComponent shouldThrow />
      </WebSocketErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('resets error state after retry', () => {
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      
      return (
        <WebSocketErrorBoundary onRetry={() => setShouldThrow(false)}>
          <ErrorComponent shouldThrow={shouldThrow} />
        </WebSocketErrorBoundary>
      );
    };

    render(<TestComponent />);

    // Initially shows error
    expect(screen.getByText(/Connection Error/)).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByText(/Retry Connection/));

    // Should show success state
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});