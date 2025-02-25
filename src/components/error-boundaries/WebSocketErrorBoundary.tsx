// File: /src/components/error-boundaries/WebSocketErrorBoundary.tsx
// Description: Error boundary for handling WebSocket connection failures
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WebSocketErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to your error reporting service
    console.error('WebSocket Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorMessage>
            Connection Error: Unable to establish real-time connection
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Retry Connection
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  padding: 1rem;
  border: 1px solid #fee2e2;
  border-radius: 0.375rem;
  background-color: #fef2f2;
  margin: 1rem 0;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #b91c1c;
  }
`;

export default WebSocketErrorBoundary;