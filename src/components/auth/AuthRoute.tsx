import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    if (import.meta.env.DEV) {
      console.debug('[AuthRoute] auth ready:', isAuthReady, 'authed:', !!currentUser);
    }
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (currentUser) {
    const from = (location.state as { from?: string } | null)?.from || '/dashboard';
    return <Navigate to={from} replace />;
  }

  if (import.meta.env.DEV) {
    console.debug('[AuthRoute] auth ready:', isAuthReady, 'authed:', !!currentUser);
  }

  // Allow access to auth pages if not authenticated
  return <>{children}</>;
};

export default AuthRoute;
