import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface AuthRouteProps {}

const AuthRoute: React.FC<AuthRouteProps> = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/dashboard' && !currentUser.profileComplete) {
    return <Navigate to="/create-profile" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
