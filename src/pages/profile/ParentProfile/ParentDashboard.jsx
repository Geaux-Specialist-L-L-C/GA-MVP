import { useState, useEffect } from 'react';
import StudentProgressTracker from './dashboard/components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from './dashboard/components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch student data
    const fetchData = async () => {
      // Add data fetching logic
    };
    fetchData();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <DashboardNav>
        <NavButton 
          isActive={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </NavButton>
        <NavButton 
          isActive={activeTab === 'progress'}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </NavButton>
        <NavButton 
          isActive={activeTab === 'curriculum'}
          onClick={() => setActiveTab('curriculum')}
        >
          Curriculum
        </NavButton>
        <NavButton 
          isActive={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </NavButton>
      </DashboardNav>

      <DashboardContent>
        {activeTab === 'overview' && (
          <>
            <StudentProgressTracker studentData={studentData} />
            <NotificationCenter />
          </>
        )}
        {activeTab === 'progress' && (
          <StudentProgressTracker studentData={studentData} />
        )}
        {activeTab === 'curriculum' && (
          <CurriculumApproval studentData={studentData} />
        )}
        {activeTab === 'insights' && (
          <LearningStyleInsights studentData={studentData} />
        )}
      </DashboardContent>

      <LoginSection>
        <h2>Login to Access More Features</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </LoginSection>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    color: var(--primary-color);
  }
`;

const DashboardNav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.isActive ? 'var(--primary-color)' : 'white'};
  color: ${props => props.isActive ? 'white' : 'var(--primary-color)'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.isActive ? 'var(--primary-color)' : 'var(--light-bg)'};
  }
`;

const DashboardContent = styled.div`
  display: grid;
  gap: 2rem;
`;

const LoginSection = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default ParentDashboard;
