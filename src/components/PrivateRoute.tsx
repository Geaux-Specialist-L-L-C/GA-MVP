import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PrivateRouteProps } from '../types/auth';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location, 
          error: "You must be logged in to view that page." 
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;