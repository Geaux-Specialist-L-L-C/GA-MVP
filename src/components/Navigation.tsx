// File: /home/wicked/GA-MVP/src/components/Navigation.tsx
// Description: Navigation bar component for the application.
// Author: GitHub Copilot
// Created: [Date]

import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="text-white">Home</Link></li>
        <li><Link to="/profile" className="text-white">Profile</Link></li>
        <li><Link to="/assessment" className="text-white">Assessment</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
