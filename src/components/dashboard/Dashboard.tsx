import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ParentProfileForm from '../../pages/profile/ParentProfile/ParentProfileForm';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import StudentCard from '../../components/student/StudentCard';
import { getParentProfile, getStudentProfile } from '../../services/profileService';
import styled from 'styled-components';

interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
  createdAt?: string;
  updatedAt?: string;
  assessmentStatus?: string;
}

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

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        if (!currentUser?.uid) {
          navigate('/login');
          return;
        }

        console.log('🔄 Fetching user data for:', currentUser.uid);
        
        setUserData({
          name: currentUser.displayName || currentUser.email || '',
          lastLogin: currentUser.metadata?.lastSignInTime || 'N/A',
        });

        const profile = await getParentProfile(currentUser.uid);
        console.log('📋 Parent profile loaded:', profile);
        setParentProfile(profile);

        if (profile?.students?.length) {
          const studentsData = await Promise.all(
            profile.students.map(async (studentId) => {
              try {
                const student = await getStudentProfile(studentId);
                return {
                  ...student,
                  id: studentId
                };
              } catch (err) {
                console.error(`Error fetching student ${studentId}:`, err);
                return null;
              }
            })
          );
          setStudents(studentsData.filter((s): s is Student => s !== null));
        }
      } catch (err) {
        console.error('❌ Error fetching user data:', err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleStudentSelect = (student: Student) => {
    if (!student.hasTakenAssessment) {
      navigate(`/learning-style-chat/${student.id}`);
    } else {
      navigate(`/student-profile/${student.id}`);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return <DashboardContainer>Error: {error}</DashboardContainer>;
  }

  if (!currentUser) {
    return <DashboardContainer>Please log in to access your dashboard.</DashboardContainer>;
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Welcome, {userData?.name}</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>

      <DashboardGrid>
        <ParentSection>
          <h2>Parent Dashboard</h2>
          <CreateStudent />
          <StudentsList>
            <h3>Your Students</h3>
            {students.length > 0 ? (
              <StudentGrid>
                {students.map((student) => (
                  <StudentCardWrapper key={student.id} onClick={() => handleStudentSelect(student)}>
                    <StudentName>{student.name}</StudentName>
                    <StudentInfo>Grade: {student.grade}</StudentInfo>
                    <AssessmentStatus $completed={student.hasTakenAssessment}>
                      {student.hasTakenAssessment ? 'Assessment Complete' : 'Take Assessment'}
                    </AssessmentStatus>
                    <ActionButton>
                      {student.hasTakenAssessment ? 'View Profile' : 'Start Assessment'}
                    </ActionButton>
                  </StudentCardWrapper>
                ))}
              </StudentGrid>
            ) : (
              <EmptyState>
                <p>No students added yet. Add your first student to get started!</p>
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

const StudentCardWrapper = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
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

export default Dashboard;
