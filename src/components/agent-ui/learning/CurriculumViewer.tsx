// File: /src/components/agent-ui/learning/CurriculumViewer.tsx
// Description: Displays generated curriculum content
// Author: GitHub Copilot
// Created: 2024

import React from 'react';
import styled from 'styled-components';
import type { TaskResult } from '../../../types/task';

interface CurriculumViewerProps {
  result: TaskResult;
}

export const CurriculumViewer: React.FC<CurriculumViewerProps> = ({ result }) => {
  const curriculum = result.content;

  return (
    <Container>
      <Header>
        <Title>{curriculum.title}</Title>
        <GradeLevel>Grade Level: {curriculum.grade_level}</GradeLevel>
      </Header>

      <ModulesContainer>
        {curriculum.modules.map((module: any, index: number) => (
          <ModuleCard key={index}>
            <ModuleTitle>{module.title}</ModuleTitle>
            <ModuleContent>{module.content}</ModuleContent>
          </ModuleCard>
        ))}
      </ModulesContainer>

      <AdaptationsSection>
        <AdaptationsTitle>Learning Style Adaptations</AdaptationsTitle>
        <AdaptationsList>
          {curriculum.learning_style_adaptations.recommendations.map((rec: string, index: number) => (
            <AdaptationItem key={index}>{rec}</AdaptationItem>
          ))}
        </AdaptationsList>
      </AdaptationsSection>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h2`
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const GradeLevel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const ModulesContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ModuleCard = styled.div`
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
`;

const ModuleTitle = styled.h3`
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ModuleContent = styled.div`
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const AdaptationsSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const AdaptationsTitle = styled.h3`
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const AdaptationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AdaptationItem = styled.li`
  color: #4b5563;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

export default CurriculumViewer;