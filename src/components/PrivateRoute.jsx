import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Pass an error message as state if the user is unauthorized.
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

  return children;
};

export default PrivateRoute;