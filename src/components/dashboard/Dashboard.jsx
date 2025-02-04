import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
      console.error('Logout error:', err);
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Account Dashboard</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <DashboardContent>
        <ProfileSection>
          <h2>Profile Information</h2>
          <ProfileCard>
            <ProfileImage 
              src={currentUser?.photoURL || '/default-avatar.png'} 
              alt="Profile" 
            />
            <ProfileInfo>
              <h3>{currentUser?.displayName || 'User'}</h3>
              <p>{currentUser?.email}</p>
            </ProfileInfo>
          </ProfileCard>
        </ProfileSection>

        <NavigationSection>
          <h2>Quick Navigation</h2>
          <NavGrid>
            <NavCard to="/parent-dashboard">
              <h3>Parent Dashboard</h3>
              <p>View student progress and manage curriculum</p>
            </NavCard>
            {/* Additional navigation cards */}
          </NavGrid>
        </NavigationSection>
      </DashboardContent>
    </DashboardContainer>
  );
};

// ... existing styled components ...

export default Dashboard;
