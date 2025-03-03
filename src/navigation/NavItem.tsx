// File: /src/components/navigation/NavItem.tsx
// Description: Navigation item component for links and buttons
// Author: evopimp
// Created: 2025-03-03

import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  isButton?: boolean;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  children, 
  isButton = false, 
  className = "" 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  if (isButton) {
    return (
      <Link
        to={to}
        className={`px-4 py-2 bg-secondary-500 hover:bg-secondary-600 rounded-md font-medium transition-colors ${className}`}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <Link
      to={to}
      className={`text-white transition-colors ${isActive ? 'font-bold text-secondary-300' : 'hover:text-secondary-300'} ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavItem;