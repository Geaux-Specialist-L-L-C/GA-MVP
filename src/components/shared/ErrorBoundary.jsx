import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We apologize for the inconvenience. Please try refreshing the page.
          </ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #e53e3e;
  font-size: 24px;
  margin-bottom: 16px;
`;

const ErrorMessage = styled.p`
  color: #4a5568;
  margin-bottom: 24px;
`;

const RetryButton = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #2c5282;
  }
`;

export default ErrorBoundary;
