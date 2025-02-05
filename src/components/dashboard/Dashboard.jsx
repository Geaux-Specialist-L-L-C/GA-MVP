import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faUserEdit } from '@fortawesome/free-solid-svg-icons';

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
          <h2>User Profile</h2>
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
              <FontAwesomeIcon icon={faUserTie} />
              <h3>Parent Dashboard</h3>
              <p>View student progress and manage curriculum</p>
            </NavCard>
            <NavCard to="/edit-profile">
              <FontAwesomeIcon icon={faUserEdit} />
              <h3>Edit Profile</h3>
              <p>Update your profile information</p>
            </NavCard>
            <ActionButton onClick={() => navigate('/billing-settings')}>
              Billing Settings
            </ActionButton>
            <ActionButton onClick={() => navigate('/notifications')}>
              Notification Settings
            </ActionButton>
          </NavGrid>
        </NavigationSection>
      </DashboardContent>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--background-color);
  min-height: calc(100vh - 70px); // Account for header
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--primary-color);
    font-size: 2rem;
  }
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ProfileSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  h3 {
    margin: 0;
    color: var(--primary-color);
  }
  
  p {
    margin: 0.5rem 0;
    color: var(--text-color);
  }
`;

const NavigationSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const NavCard = styled(Link)`
  background: var(--primary-color);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-decoration: none;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  h3 {
    margin: 0;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const ActionButton = styled.button`
  background: white;
  color: var(--primary-color);
  padding: 1rem;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: var(--primary-color);
    color: white;
  }
`;

export default Dashboard;
