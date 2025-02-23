// File: /src/components/shared/LoadingSpinner.tsx
// Description: Reusable loading spinner component
// Author: GitHub Copilot
// Created: 2024-02-20

import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: '16px',
  medium: '24px',
  large: '32px',
} as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  return (
    <SpinnerContainer 
      $size={sizeMap[size]}
      role="progressbar"
      aria-label="Loading"
    >
      <SpinnerRing />
    </SpinnerContainer>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ $size: string }>`
  position: relative;
  width: ${props => props.$size};
  height: ${props => props.$size};
`;

const SpinnerRing = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${({ theme }) => theme.colors.primary} transparent transparent transparent;
`;