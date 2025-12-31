import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LearningStyleChat from '../../../components/chat/LearningStyleChat';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

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
  const [needsSetup, setNeedsSetup] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const logDebug = (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug(...args);
    }
  };

  const fetchWithTimeout = async <T,>(promise: Promise<T>, timeoutMs: number) => {
    let timeoutId: number | undefined;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = window.setTimeout(() => {
        reject(new Error('Timed out loading dashboard data'));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    });
  };

  const handleRetry = () => {
    setLoading(true);
    setError('');
    setNeedsSetup(false);
    setReloadToken((value) => value + 1);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      const studentId = id ?? currentUser?.uid;
      setError('');
      setNeedsSetup(false);

      if (!studentId) {
        setError('Student ID not found');
        setLoading(false);
        return;
      }

      try {
        logDebug('Dashboard load start', studentId);
        const data = await fetchWithTimeout(getStudentProfile(studentId), 8000);
        if (data) {
          setStudentData({
            ...data,
            id: data.id || studentId,
            recentActivities: [],
            progress: []
          } as StudentData);
          logDebug('Dashboard load success', { data });
        } else {
          setStudentData(null);
          setNeedsSetup(true);
          logDebug('Dashboard load success', { data: null });
        }
      } catch (err) {
        logDebug('Dashboard load error', err);
        const message = err instanceof Error ? err.message : 'Failed to load student data';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUser?.uid, id, reloadToken]);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <LoadingSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return (
      <StyledErrorContainer>
        <p>{error}</p>
        <StyledRetryButton type="button" onClick={handleRetry}>Retry</StyledRetryButton>
      </StyledErrorContainer>
    );
  }

  if (needsSetup) {
    return (
      <StyledSetupContainer>
        <h2>Finish setting up your dashboard</h2>
        <p>No student profile was found yet. Complete your setup to start tracking progress.</p>
        <StyledRetryButton type="button" onClick={handleRetry}>Retry</StyledRetryButton>
      </StyledSetupContainer>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StyledHeader>
        <StyledHeaderLeft>
          <h1>Welcome, {studentData?.name}!</h1>
          <p>Grade {studentData?.grade}</p>
        </StyledHeaderLeft>
      </StyledHeader>

      <DashboardGrid>
        <MainSection>
          {!studentData?.hasTakenAssessment && (
            <AssessmentSection>
              <h2>Learning Style Assessment</h2>
              <p>Take your learning style assessment to get personalized recommendations.</p>
              <LearningStyleChat />
            </AssessmentSection>
          )}

          {studentData?.hasTakenAssessment && studentData.learningStyle && (
            <LearningStyleSection>
              <h2>Your Learning Style: {studentData.learningStyle}</h2>
              <p>Based on your assessment, we've customized your learning experience.</p>
            </LearningStyleSection>
          )}

          <ProgressSection>
            <h2>Recent Progress</h2>
            {/* Add progress visualization here */}
          </ProgressSection>
        </MainSection>
      </DashboardGrid>
    </m.div>
  );
};

const DashboardContainer = styled(m.div)`
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
  display: grid;
  gap: 1rem;
`;

const StyledSetupContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 12px;
  display: grid;
  gap: 0.75rem;
  color: #9a3412;
`;

const StyledRetryButton = styled.button`
  margin: 0 auto;
  padding: 0.6rem 1.5rem;
  border-radius: 999px;
  border: none;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: var(--primary-dark);
  }
`;

const StyledHeader = styled(m.header)`
  margin-bottom: 2rem;
`;

const StyledHeaderLeft = styled.div`
  h1 {
    margin: 0;
    color: var(--primary-color);
  }
  p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const MainSection = styled.div`
  display: grid;
  gap: 2rem;
`;

const AssessmentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LearningStyleSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default StudentDashboard;
