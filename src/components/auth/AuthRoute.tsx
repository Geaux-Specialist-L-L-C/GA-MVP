import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface AuthRouteProps {
  children: React.ReactElement;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === '/dashboard' && !(currentUser as any).profileComplete) {
    return <Navigate to="/create-profile" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
