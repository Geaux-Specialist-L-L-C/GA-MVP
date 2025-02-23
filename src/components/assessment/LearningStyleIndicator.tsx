// File: /src/components/assessment/LearningStyleIndicator.tsx
// Description: Visual indicator for student's learning style
// Author: GitHub Copilot
// Created: 2024-02-20

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { LearningStyle } from '@/types/assessment';

interface LearningStyleIndicatorProps {
  style: LearningStyle;
}

const styleConfig = {
  visual: {
    icon: '👁️',
    color: '#60A5FA', // blue-400
    description: 'Visual Learner'
  },
  auditory: {
    icon: '👂',
    color: '#34D399', // green-400
    description: 'Auditory Learner'
  },
  reading: {
    icon: '📚',
    color: '#FBBF24', // yellow-400
    description: 'Reading/Writing Learner'
  },
  kinesthetic: {
    icon: '🤚',
    color: '#A78BFA', // purple-400
    description: 'Kinesthetic Learner'
  }
} as const;

export const LearningStyleIndicator: React.FC<LearningStyleIndicatorProps> = ({ style }) => {
  const config = styleConfig[style.primary];
  const confidencePercent = Math.round(style.confidence * 100);

  return (
    <Container
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyleIcon>{config.icon}</StyleIcon>
      <Content>
        <Description>{config.description}</Description>
        <ConfidenceBar>
          <ConfidenceFill
            style={{
              width: `${confidencePercent}%`,
              backgroundColor: config.color
            }}
          />
        </ConfidenceBar>
        <ConfidenceText>
          {confidencePercent}% Confidence
        </ConfidenceText>
      </Content>
    </Container>
  );
};

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const StyleIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Description = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ConfidenceBar = styled.div`
  width: 100px;
  height: 4px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  transition: width 0.3s ease-in-out;
`;

const ConfidenceText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default LearningStyleIndicator;