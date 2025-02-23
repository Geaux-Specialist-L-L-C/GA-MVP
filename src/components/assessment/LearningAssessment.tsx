// File: /src/components/assessment/LearningAssessment.tsx
// Description: AI-powered learning style assessment component
// Author: GitHub Copilot
// Created: 2024-02-20

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningAssessment } from '@/hooks/useLearningAssessment';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { LearningStyleIndicator } from './LearningStyleIndicator';
import type { LearningStyle, AssessmentResult } from '@/types/assessment';

interface LearningAssessmentProps {
  studentId: string;
  onComplete?: (result: AssessmentResult) => void;
}

export const LearningAssessment: React.FC<LearningAssessmentProps> = ({ 
  studentId,
  onComplete 
}) => {
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { 
    startAssessment,
    learningStyle,
    isLoading,
    progress
  } = useLearningAssessment(studentId);

  const handleStartAssessment = useCallback(async () => {
    if (!currentUser) {
      setError('Authentication required');
      return;
    }

    try {
      setError(null);
      const result = await startAssessment();
      onComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete assessment');
    }
  }, [currentUser, startAssessment, onComplete]);

  return (
    <AssessmentContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AssessmentHeader>
        <h2>Learning Style Assessment</h2>
        {learningStyle && <LearningStyleIndicator style={learningStyle} />}
      </AssessmentHeader>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <AssessmentContent>
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Analyzing learning style... {progress}%</LoadingText>
          </LoadingContainer>
        ) : (
          <StartButton 
            onClick={handleStartAssessment}
            disabled={isLoading}
            aria-label="Start Learning Assessment"
          >
            Start Assessment
          </StartButton>
        )}

        {learningStyle && (
          <ResultsSection>
            <h3>Your Learning Profile</h3>
            <LearningStyleBreakdown style={learningStyle} />
          </ResultsSection>
        )}
      </AssessmentContent>
    </AssessmentContainer>
  );
};

const AssessmentContainer = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const AssessmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AssessmentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`;

const StartButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default LearningAssessment;