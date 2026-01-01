import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LearningStyleChat from '../../../components/chat/LearningStyleChat';

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

  const isDevEnvironment =
    typeof window !== 'undefined' && window.location.hostname === 'localhost';

  const logDebug = (...args: unknown[]) => {
    if (isDevEnvironment) {
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

  const hasAuth = Boolean(currentUser);
  const parentDashboardPath = hasAuth ? '/parent-dashboard' : '/login';
  const parentDashboardFallback = hasAuth ? '/dashboard' : '/login';
  const parentDashboardLabel = hasAuth ? 'Back to Parent Dashboard' : 'Go to Login';

  const handleBackToParentDashboard = () => {
    try {
      navigate(parentDashboardPath);
    } catch (navigationError) {
      console.error('Failed to navigate to parent dashboard:', navigationError);
      navigate(parentDashboardFallback);
    }
  };

  const handleAddStudent = () => {
    navigate('/create-student');
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      const studentId = id?.trim();
      setError('');
      setNeedsSetup(false);

      if (!studentId) {
        setStudentData(null);
        setNeedsSetup(true);
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
        if (message.toLowerCase().includes('not found')) {
          setNeedsSetup(true);
          setStudentData(null);
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, reloadToken]);

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
        <StyledActionGroup>
          <StyledPrimaryButton type="button" onClick={handleBackToParentDashboard}>
            {parentDashboardLabel}
          </StyledPrimaryButton>
          <StyledTertiaryButton type="button" onClick={handleRetry}>
            Retry
          </StyledTertiaryButton>
        </StyledActionGroup>
      </StyledErrorContainer>
    );
  }

  if (needsSetup || !studentData) {
    return (
      <StyledSetupContainer>
        <StyledSetupCard>
          <h2>Student profile not found</h2>
          <p>This dashboard needs a student profile before it can load.</p>
          <StyledActionGroup>
            <StyledPrimaryButton type="button" onClick={handleBackToParentDashboard}>
              {parentDashboardLabel}
            </StyledPrimaryButton>
            {hasAuth && (
              <StyledSecondaryButton type="button" onClick={handleAddStudent}>
                Add Student
              </StyledSecondaryButton>
            )}
            <StyledTertiaryButton type="button" onClick={handleRetry}>
              Retry
            </StyledTertiaryButton>
          </StyledActionGroup>
        </StyledSetupCard>
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
              <LearningStyleChat studentId={studentData.id ?? id} />
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
  display: grid;
  place-items: center;
`;

const StyledSetupCard = styled.div`
  max-width: 480px;
  width: 100%;
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 16px;
  padding: 2rem;
  display: grid;
  gap: 0.75rem;
  color: #9a3412;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
`;

const StyledActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const StyledPrimaryButton = styled.button`
  width: 100%;
  max-width: 260px;
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

const StyledSecondaryButton = styled.button`
  width: 100%;
  max-width: 260px;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  border: 1px solid var(--primary-color);
  background: #fff;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: rgba(99, 102, 241, 0.08);
  }
`;

const StyledTertiaryButton = styled.button`
  width: 100%;
  max-width: 260px;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 600;
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
