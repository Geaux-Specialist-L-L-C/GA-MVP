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
  const { currentUser, isAuthReady, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (loading || !isAuthReady) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login with current location
  if (!loading && currentUser === null) {
    // Only redirect if we're not already on the login page
    if (location.pathname !== '/login') {
      return (
        <Navigate 
          to="/login" 
          state={{ 
            from: location,
            error: "Please sign in to access this page" 
          }} 
          replace 
        />
      );
    }
  }

  // If authenticated, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
