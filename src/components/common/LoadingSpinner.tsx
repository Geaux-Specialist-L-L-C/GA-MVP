import React from 'react';
import styled from 'styled-components';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 12, 
  color = 'var(--primary-color)' 
}) => {
  return (
    <SpinnerContainer>
      <Spinner $size={size} $color={color} />
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spinner = styled.div<{ $size: number; $color: string }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: 2px solid transparent;
  border-top-color: ${props => props.$color};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default LoadingSpinner;
