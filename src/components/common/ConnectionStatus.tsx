// File: /src/components/common/ConnectionStatus.tsx
// Description: Displays WebSocket connection status with retry functionality
// Author: GitHub Copilot
// Created: 2024

import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import websocketService from '../../services/websocketService';

interface ConnectionStatusProps {
  className?: string;
  isConnected: boolean;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className,
  isConnected,
  onRetry,
  showRetry = true
}) => {
  const handleRetry = () => {
    websocketService.connect().catch(console.error);
    onRetry?.();
  };

  return (
    <Container className={className} $isConnected={isConnected}>
      <StatusDot $isConnected={isConnected} />
      <StatusText>
        {isConnected ? 'Connected' : 'Disconnected'}
      </StatusText>
      {!isConnected && showRetry && (
        <RetryButton onClick={handleRetry}>
          Retry Connection
        </RetryButton>
      )}
    </Container>
  );
};

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

const Container = styled.div<{ $isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: ${props => props.$isConnected ? '#ecfdf5' : '#fff3cd'};
  color: ${props => props.$isConnected ? '#059669' : '#92400e'};
  transition: background-color 0.2s ease-in-out;
`;

const StatusDot = styled.div<{ $isConnected: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${props => props.$isConnected ? '#059669' : '#92400e'};
  ${props => !props.$isConnected && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const RetryButton = styled.button`
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #92400e;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #78340f;
  }

  &:focus {
    outline: 2px solid #92400e;
    outline-offset: 2px;
  }
`;

export default ConnectionStatus;