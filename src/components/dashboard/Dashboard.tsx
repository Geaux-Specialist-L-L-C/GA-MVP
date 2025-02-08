import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ParentProfileForm from '../../pages/profile/ParentProfile/ParentProfileForm';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import StudentCard from '../../components/student/StudentCard';
import { getParentProfile } from '../../services/profileService';
import styled from 'styled-components';
import { Parent } from '../../types/auth';

interface UserData {
  name: string;
  lastLogin: string;
}

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [parentProfile, setParentProfile] = useState<Parent | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser?.uid) {
          navigate('/login');
          return;
        }

        console.log('🔄 Fetching user data for:', currentUser.uid);
        
        setUserData({
          name: currentUser.displayName || currentUser.email || 'User',
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
        <DashboardCard>
          <h3>Last Login</h3>
          <p>{userData?.lastLogin}</p>
        </DashboardCard>

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

// ... existing styled components ...

export default Dashboard;