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

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          setParentProfile(profile);
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
