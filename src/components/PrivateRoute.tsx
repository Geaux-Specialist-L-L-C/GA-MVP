import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
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
