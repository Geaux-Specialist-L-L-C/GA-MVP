import React, { useState, useEffect } from 'react';
import StudentProgressTracker from './components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from '../components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { getParentProfile } from '../../../services/profileService';
import { Parent, Student } from '../../../types/auth';

interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'curriculum' | 'insights'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const { currentUser: user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");

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
              })) || [], // Will be populated with actual student data
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
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
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
        <button onClick={() => navigate("/billing-settings")}>Billing Settings</button>
      </ProfileSection>

      <StudentManagement>
        <h2>Student Profiles</h2>
        <button onClick={() => navigate("/create-student")}>➕ Add Student</button>
        
        {parentProfile?.students?.map((student) => (
          <StudentCard key={student.id}>
            <p>{student.name}</p>
            <button onClick={() => navigate(`/take-assessment/${student.id}`)}>Take Assessment</button>
          </StudentCard>
        ))}
      </StudentManagement>

      <DashboardNav>
        <NavButton isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview
        </NavButton>
        <NavButton isActive={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>
          Progress
        </NavButton>
        <NavButton isActive={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>
          Curriculum
        </NavButton>
        <NavButton isActive={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>
          Insights
        </NavButton>
      </DashboardNav>

      <DashboardContent>
        {activeTab === 'overview' && (
          <>
            <StudentProgressTracker studentData={parentProfile?.students} />
            <NotificationCenter />
          </>
        )}
        {activeTab === 'progress' && <StudentProgressTracker studentData={parentProfile?.students} />}
        {activeTab === 'curriculum' && <CurriculumApproval studentData={parentProfile?.students} />}
        {activeTab === 'insights' && <LearningStyleInsights studentData={parentProfile?.students} />}
      </DashboardContent>

      {!user && (
        <LoginSection>
          <h2>Login to Access More Features</h2>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <GoogleButton onClick={handleGoogleLogin}>
            <FcGoogle className="text-xl" />
            Sign in with Google
          </GoogleButton>
        </LoginSection>
      )}
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

const DashboardNav = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.isActive ? '#4CAF50' : '#fff'};
  color: ${props => props.isActive ? '#fff' : '#333'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${props => props.isActive ? '#43A047' : '#f5f5f5'};
  }
`;

const DashboardContent = styled.div`
  margin-top: 2rem;
`;

const LoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin: 0 auto;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin: 1rem 0;
`;

const ProfileSection = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StudentManagement = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StudentCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 10px 0;
`;

export default ParentDashboard;
