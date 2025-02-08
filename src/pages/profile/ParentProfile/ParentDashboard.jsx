import { useState, useEffect } from 'react';
import StudentProgressTracker from './dashboard/components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from './dashboard/components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { getParentProfile } from '../../services/profileService';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState(null);
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const parentProfile = await getParentProfile(user.uid);
          setStudentData(parentProfile.students || []);
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchData();
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
            <StudentProgressTracker studentData={studentData} />
            <NotificationCenter />
          </>
        )}
        {activeTab === 'progress' && <StudentProgressTracker studentData={studentData} />}
        {activeTab === 'curriculum' && <CurriculumApproval studentData={studentData} />}
        {activeTab === 'insights' && <LearningStyleInsights studentData={studentData} />}
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

export default ParentDashboard;
