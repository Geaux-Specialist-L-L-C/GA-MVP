import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../types/student';

interface LearningStyleInsightsProps {
  studentData?: Student[];
}

const LearningStyleInsights: React.FC<LearningStyleInsightsProps> = ({ studentData }) => {
  return (
    <InsightsContainer>
      <h3>Learning Style Analytics</h3>
      {studentData?.map(student => (
        <InsightCard key={student.id}>
          <h4>{student.name}</h4>
          <InsightContent>
            <div>Learning Style: {student.learningStyle || 'Not assessed'}</div>
            <div>Recommended Activities: {student.recommendedActivities?.length || 0}</div>
          </InsightContent>
        </InsightCard>
      ))}
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const InsightCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const InsightContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default LearningStyleInsights;