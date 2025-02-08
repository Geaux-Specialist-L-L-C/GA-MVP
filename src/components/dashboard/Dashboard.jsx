import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ParentProfileForm from '../../pages/profile/ParentProfile/ParentProfileForm';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import StudentCard from '../../components/student/StudentCard';
import { getParentProfile } from '../../services/profileService';
import styled from 'styled-components';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parentProfile, setParentProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser?.uid) {
          navigate('/login');
          return;
        }

        console.log('🔄 Fetching user data for:', currentUser.uid);
        
        setUserData({
          name: currentUser.displayName || currentUser.email,
          lastLogin: currentUser.metadata?.lastSignInTime || 'N/A',
        });

        const profile = await getParentProfile(currentUser.uid);
        console.log('📋 Parent profile loaded:', profile);
        setParentProfile(profile);
      } catch (err) {
        console.error('❌ Error fetching user data:', err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
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
        <h1>Welcome, {userData?.name || 'User'}</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>

      <DashboardGrid>
        <DashboardCard>
          <h3>Last Login</h3>
          <p>{userData?.lastLogin || 'N/A'}</p>
        </DashboardCard>

        {/* Parent Dashboard Section - Always show if user is logged in */}
        <ParentSection>
          <h2>Parent Dashboard</h2>
          {parentProfile ? (
            <>
              <CreateStudent />
              {parentProfile.students?.length > 0 ? (
                <StudentsList>
                  <h3>Your Students</h3>
                  {parentProfile.students.map(studentId => (
                    <StudentCard key={studentId} studentId={studentId} />
                  ))}
                </StudentsList>
              ) : (
                <EmptyState>
                  <p>No students added yet. Add your first student to get started!</p>
                </EmptyState>
              )}
            </>
          ) : (
            <ParentProfileForm />
          )}
        </ParentSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }
`;

const LogoutButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: var(--primary-dark);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const DashboardCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
`;

const ParentSection = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  grid-column: 1 / -1;
`;

const StudentsList = styled.div`
  margin-top: 2rem;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
`;

const StudentCardContainer = styled.div`
  background: white;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

export default Dashboard;
