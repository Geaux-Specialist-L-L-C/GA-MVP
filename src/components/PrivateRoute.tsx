import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PrivateRouteProps } from '../types/auth';
import LoadingSpinner from '../common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (!currentUser) {
    // Save the attempted location and redirect to login
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

  return <>{children}</>;
};

export default PrivateRoute;
