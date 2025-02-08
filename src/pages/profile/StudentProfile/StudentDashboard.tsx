import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

interface StudentData extends Student {
  recentActivities: Array<{
    id?: string;
    type: string;
    name: string;
    date: string;
  }>;
  progress: Array<{
    type: string;
    value: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID not found');
        return;
      }

      try {
        const data = await getStudentProfile(id);
        if (data) {
          setStudentData({
            ...data,
            id: data.id || id,
            recentActivities: [],
            progress: []
          } as StudentData);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <LoadingSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return <StyledErrorContainer>{error}</StyledErrorContainer>;
  }

  return (
    <StyledDashboardContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <StyledHeader>
          <StyledHeaderLeft>
            <StyledBackButton onClick={() => navigate('/dashboard')}>
              ← Back to Parent Dashboard
            </StyledBackButton>
            <h1>{studentData?.name}'s Dashboard</h1>
          </StyledHeaderLeft>
          {studentData?.hasTakenAssessment ? (
            <StyledAssessmentBadge $complete>
              Assessment Complete
            </StyledAssessmentBadge>
          ) : (
            <StyledAssessmentBadge>
              <StyledAssessmentButton onClick={() => navigate('/take-assessment')}>
                Take Assessment
              </StyledAssessmentButton>
            </StyledAssessmentBadge>
          )}
        </StyledHeader>

        <StyledDashboardGrid>
          <StyledCard>
            <StyledCardHeader>
              <FaGraduationCap />
              <h3>Learning Style</h3>
            </StyledCardHeader>
            <StyledCardContent>
              {studentData?.learningStyle ? (
                <StyledLearningStyleInfo>
                  {studentData.learningStyle}
                </StyledLearningStyleInfo>
              ) : (
                <StyledEmptyState>
                  Complete the assessment to discover your learning style
                </StyledEmptyState>
              )}
            </StyledCardContent>
          </StyledCard>

          <StyledCard>
            <StyledCardHeader>
              <FaChartLine />
              <h3>Progress</h3>
            </StyledCardHeader>
            <StyledCardContent>
              {studentData?.progress?.length ? (
                <StyledProgressGrid>
                  {studentData.progress.map((item, index) => (
                    <StyledProgressItem key={index}>
                      <StyledProgressLabel>{item.type}</StyledProgressLabel>
                      <StyledProgressBar>
                        <StyledProgressFill $width={item.value} />
                      </StyledProgressBar>
                      <StyledProgressValue>{item.value}%</StyledProgressValue>
                    </StyledProgressItem>
                  ))}
                </StyledProgressGrid>
              ) : (
                <StyledEmptyState>No progress data available yet</StyledEmptyState>
              )}
            </StyledCardContent>
          </StyledCard>

          <StyledCard>
            <StyledCardHeader>
              <FaBook />
              <h3>Recent Activities</h3>
            </StyledCardHeader>
            <StyledCardContent>
              {studentData?.recentActivities?.length ? (
                <StyledActivityList>
                  {studentData.recentActivities.map((activity, index) => (
                    <StyledActivityItem key={activity.id || index}>
                      <StyledActivityName>{activity.name}</StyledActivityName>
                      <StyledActivityDate>{activity.date}</StyledActivityDate>
                    </StyledActivityItem>
                  ))}
                </StyledActivityList>
              ) : (
                <StyledEmptyState>No recent activities</StyledEmptyState>
              )}
            </StyledCardContent>
          </StyledCard>
        </StyledDashboardGrid>
      </motion.div>
    </StyledDashboardContainer>
  );
};

// Styled Components
const StyledDashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const StyledErrorContainer = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledBackButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StyledAssessmentBadge = styled.div<{ $complete?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: ${props => props.$complete ? '#4CAF50' : '#FFF'};
  color: ${props => props.$complete ? '#FFF' : 'inherit'};
  border: ${props => props.$complete ? 'none' : '1px solid #ddd'};
`;

const StyledAssessmentButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StyledDashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const StyledCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
`;

const StyledCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
  
  h3 {
    margin: 0;
  }
`;

const StyledCardContent = styled.div`
  min-height: 200px;
`;

const StyledEmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

const StyledLearningStyleInfo = styled.div`
  font-size: 1.2rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem;
`;

const StyledProgressGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledProgressItem = styled.div``;

const StyledProgressLabel = styled.div`
  margin-bottom: 0.5rem;
`;

const StyledProgressBar = styled.div`
  background: #f0f0f0;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $width: number }>`
  background: var(--primary-color);
  height: 100%;
  width: ${props => props.$width}%;
  transition: width 0.3s ease;
`;

const StyledProgressValue = styled.div`
  text-align: right;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

const StyledActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledActivityItem = styled.div`
  padding: 0.75rem;
  border-radius: 4px;
  background: #f8f9fa;
`;

const StyledActivityName = styled.div`
  font-weight: 500;
`;

const StyledActivityDate = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

export default StudentDashboard;
