import React, { Component, ErrorInfo } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      isOffline: !navigator.onLine
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
    if (navigator.onLine && this.state.error?.message.includes('offline')) {
      // Clear offline-related errors when back online
      this.setState({ hasError: false, error: null });
    }
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isOffline: !navigator.onLine
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if error is Firebase offline error
      const isFirebaseOffline = this.state.error?.message.includes('offline') || 
                               this.state.error?.message.includes('network');

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>
              {this.state.isOffline ? '📡 You\'re Offline' : '❌ Something went wrong'}
            </ErrorTitle>
            
            <ErrorMessage>
              {this.state.isOffline || isFirebaseOffline ? (
                <>
                  <p>It looks like you're offline or having connection issues.</p>
                  <p>Some features may be limited until you're back online.</p>
                  <p>Your data will sync automatically when you reconnect.</p>
                </>
              ) : (
                <>
                  <p>An unexpected error occurred.</p>
                  <p>{this.state.error?.message}</p>
                </>
              )}
            </ErrorMessage>

            <RetryButton 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try Again
            </RetryButton>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
`;

const ErrorCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #4a5568;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
  }
`;

const RetryButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3182ce;
  }
`;

export default ErrorBoundary;
