// File: /home/wicked/GA-MVP/src/components/Logout.tsx
// Description: Logout component for user authentication.
// Author: GitHub Copilot
// Created: [Date]

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Failed to log out');
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
