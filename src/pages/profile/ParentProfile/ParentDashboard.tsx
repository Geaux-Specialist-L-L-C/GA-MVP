import React, { useState, useEffect } from 'react';
import StudentProgressTracker from './components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from '../components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useAuth } from "../../../contexts/AuthContext";
import { getParentProfile } from '../../../services/profileService';
import { Parent, Student } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';

interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'curriculum' | 'insights'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { currentUser: user, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          if (profile) {
            setParentProfile({
              ...profile,
              name: profile.displayName,
              id: profile.id || user.uid,
              students: profile.students.map((student: string) => ({
                id: student,
                name: '',
                age: 0,
                grade: '',
                parentId: profile.id || user.uid,
                hasTakenAssessment: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })) || [],
              createdAt: profile.createdAt || new Date().toISOString(),
              updatedAt: profile.updatedAt || new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleProfileSwitch = (studentId: string) => {
    setSelectedStudent(studentId);
    navigate(`/student-dashboard/${studentId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <ProfileSection>
        <h2>Account Details</h2>
        <p>Name: {parentProfile?.name || "Parent"}</p>
        <p>Email: {user?.email}</p>
        {!user && (
          <GoogleButton onClick={handleGoogleLogin}>
            Sign in with Google
          </GoogleButton>
        )}
      </ProfileSection>

      {user && (
        <>
          <StudentManagement>
            <h2>Student Profiles</h2>
            <AddStudentButton>➕ Add Student</AddStudentButton>
            
            <StudentList>
              {parentProfile?.students?.map((student) => (
                <StudentCard key={student.id} onClick={() => handleProfileSwitch(student.id)}>
                  <h3>{student.name}</h3>
                  <p>Grade: {student.grade}</p>
                  <p>Assessment: {student.hasTakenAssessment ? 'Completed' : 'Pending'}</p>
                  <ViewProfileButton>View Profile</ViewProfileButton>
                </StudentCard>
              ))}
            </StudentList>
          </StudentManagement>

          <TabContainer>
            <TabList>
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</Tab>
              <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</Tab>
              <Tab active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>Curriculum</Tab>
              <Tab active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>Insights</Tab>
            </TabList>

            <TabContent>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'progress' && <StudentProgressTracker />}
              {activeTab === 'curriculum' && <CurriculumApproval />}
              {activeTab === 'insights' && <LearningStyleInsights />}
            </TabContent>
          </TabContainer>

          <NotificationSection>
            <NotificationCenter />
          </NotificationSection>
        </>
      )}
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }
`;

const ProfileSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StudentManagement = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AddStudentButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
`;

const TabContainer = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NotificationSection = styled.div`
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

const OverviewTab = styled.div`
  // Add specific styles for the overview tab content
`;

const ViewProfileButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default ParentDashboard;