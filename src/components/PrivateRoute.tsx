// File: /src/components/PrivateRoute.tsx
// Description: A route component that protects routes from unauthorized access
// Author: GitHub Copilot

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }): JSX.Element => {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (!isAuthReady) {
    if (import.meta.env.DEV) {
      console.debug('[PrivateRoute] auth ready:', isAuthReady, 'authed:', !!currentUser);
    }
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <span>Loading…</span>
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login with current location
  if (!currentUser) {
    const from = `${location.pathname}${location.search || ''}${location.hash || ''}`;
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from
        }} 
        replace 
      />
    );
  }

  // If authenticated, render the protected route
  if (import.meta.env.DEV) {
    console.debug('[PrivateRoute] auth ready:', isAuthReady, 'authed:', !!currentUser);
  }

  return <>{children}</>;
};

export default PrivateRoute;
