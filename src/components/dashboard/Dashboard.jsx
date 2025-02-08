import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getParentProfile } from '../../services/profileService';
import styled from 'styled-components';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [parentProfile, setParentProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getParentProfile(currentUser.uid);
          setParentProfile(profile);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  if (!currentUser) {
    navigate('/login'); // Force login before showing dashboard
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Profile</h1>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </DashboardHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ProfileSection>
        <h2>Account Details</h2>
        <p>Name: {parentProfile?.name || 'Parent'}</p>
        <p>Email: {currentUser?.email}</p>
        <p>Subscription: Active</p>
        <button onClick={() => navigate('/billing-settings')}>Billing Settings</button>
      </ProfileSection>

      <StudentManagement>
        <h2>Student Profiles</h2>
        <button onClick={() => navigate('/create-student')}>Add Student</button>
        {parentProfile?.students?.map((student) => (
          <StudentCard key={student.id}>
            <p>{student.name}</p>
            <button onClick={() => navigate(`/student-dashboard/${student.id}`)}>View Dashboard</button>
          </StudentCard>
        ))}
      </StudentManagement>
    </DashboardContainer>
  );
};

export default Dashboard;

// Styled Components
const DashboardContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const ProfileSection = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
`;

const StudentManagement = styled.div`
  margin-top: 2rem;
`;

const StudentCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
`;
