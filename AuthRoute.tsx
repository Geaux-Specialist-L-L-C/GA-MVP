import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './src/contexts/AuthContext';
import LoadingSpinner from './src/components/common/LoadingSpinner';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser) {
    return <>{children}</>;
  }

  // If authenticated, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default AuthRoute;