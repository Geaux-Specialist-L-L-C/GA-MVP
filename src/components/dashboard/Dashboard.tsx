import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import StudentCard from '../../components/student/StudentCard';
import { ProfileService, getStudentProfile } from '../../services/profileService';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Student, BaseProfile } from '../../types/profiles';

interface UserData {
  name: string;
  lastLogin: string;
}

interface ParentProfile {
  id?: string;
  students?: string[];
  name?: string;
  email?: string;
}

interface DashboardProps {
  onProfileUpdate?: (profile: BaseProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProfileUpdate }): JSX.Element => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Retry data fetch when back online
      if (currentUser) fetchUserData();
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      if (!currentUser?.uid) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError('');
      
      // Set basic user data immediately from auth
      setUserData({
        name: currentUser.displayName || currentUser.email || '',
        lastLogin: currentUser.metadata?.lastSignInTime || 'N/A',
      });

      // Fetch parent profile with retry mechanism
      const fetchProfileWithRetry = async () => {
        try {
          const profileService = new ProfileService();
          const profile = await profileService.getUserProfile(currentUser.uid);
          if (profile) {
            setParentProfile(profile);
            if (onProfileUpdate) {
              onProfileUpdate(profile);
            }
            return profile;
          }
          throw new Error('Profile not found');
        } catch (err) {
          if (retryCount < MAX_RETRIES && !isOffline) {
            setRetryCount(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return fetchProfileWithRetry();
          }
          throw err;
        }
      };

      const profile = await fetchProfileWithRetry();

      // Fetch students data if profile exists
      if (profile?.students?.length) {
        const studentsData = await Promise.all(
          profile.students.map(async (studentId: string) => {
            try {
              const student = await getStudentProfile(studentId);
              return student;
            } catch (err) {
              console.error(`Error fetching student ${studentId}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null values and cast to Student array
        setStudents(studentsData.filter((s): s is Student => s !== null && s.id !== undefined));
      }

      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(isOffline ? 
        'You are currently offline. Some features may be limited.' :
        'Failed to fetch user data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, navigate, onProfileUpdate, retryCount, isOffline]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleStudentSelect = (student: Student) => {
    if (isOffline) {
      setError('This action is not available while offline');
      return;
    }
    
    if (!student.hasTakenAssessment) {
      navigate(`/learning-style-chat/${student.id}`);
    } else {
      navigate(`/student-profile/${student.id}`);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <AnimatePresence>
        {isOffline && (
          <OfflineBanner
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            You are currently offline. Some features may be limited.
          </OfflineBanner>
        )}
      </AnimatePresence>

      <DashboardHeader>
        <h1>Welcome, {userData?.name}</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>

      {error && (
        <ErrorMessage>
          {error}
          <RetryButton onClick={fetchUserData}>Retry</RetryButton>
        </ErrorMessage>
      )}

      <DashboardGrid>
        <ParentSection>
          <h2>Parent Dashboard</h2>
          {!isOffline && <CreateStudent />}
          <StudentsList>
            <h3>Your Students</h3>
            {students.length > 0 ? (
              <StudentGrid>
                {students.map((student) => (
                  <StudentCardWrapper 
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    disabled={isOffline}
                  >
                    <StudentName>{student.name}</StudentName>
                    <StudentInfo>Grade: {student.grade}</StudentInfo>
                    <AssessmentStatus $completed={student.hasTakenAssessment}>
                      {student.hasTakenAssessment ? 'Assessment Complete' : 'Take Assessment'}
                    </AssessmentStatus>
                  </StudentCardWrapper>
                ))}
              </StudentGrid>
            ) : (
              <EmptyState>
                No students found. {!isOffline && 'Add your first student to get started.'}
              </EmptyState>
            )}
          </StudentsList>
        </ParentSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ParentSection = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StudentsList = styled.div`
  margin-top: 1rem;
`;

const StudentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCardWrapper = styled.div<{ disabled?: boolean }>`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const StudentName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
`;

const StudentInfo = styled.p`
  color: #4a5568;
  margin: 0 0 0.5rem 0;
`;

const AssessmentStatus = styled.div<{ $completed: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: ${props => props.$completed ? '#48BB78' : '#4299E1'};
  color: white;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  
  &:hover {
    background-color: #2563EB;
  }
`;

const EmptyState = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

const OfflineBanner = styled(motion.div)`
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const regex = /some-pattern/;

export default Dashboard;
