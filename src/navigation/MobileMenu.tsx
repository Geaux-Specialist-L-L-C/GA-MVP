// File: /src/components/navigation/MobileMenu.tsx
// Description: Mobile navigation menu component
// Author: evopimp
// Created: 2025-03-03

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest(".mobile-menu-container")) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleLogout = () => {
    logout();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="mobile-menu-container bg-primary-800 w-3/4 max-w-sm h-full overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
              <img src="/logo.svg" alt="Geaux Academy Logo" className="h-8 w-auto" />
              <span className="text-lg font-bold text-white">Geaux Academy</span>
            </Link>
            <button onClick={onClose} className="text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-white py-2 px-4 hover:bg-primary-700 rounded-md" onClick={onClose}>Home</Link>
            <Link to="/courses" className="text-white py-2 px-4 hover:bg-primary-700 rounded-md" onClick={onClose}>Courses</Link>
            <Link to="/learning-path" className="text-white py-2 px-4 hover:bg-primary-700 rounded-md" onClick={onClose}>My Learning Path</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-white py-2 px-4 hover:bg-primary-700 rounded-md" onClick={onClose}>Dashboard</Link>
                <Link to="/profile" className="text-white py-2 px-4 hover:bg-primary-700 rounded-md" onClick={onClose}>Profile</Link>
                <button onClick={handleLogout} className="text-white py-2 px-4 hover:bg-primary-700 rounded-md text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white py-2 px-4 hover:bg-primary-700 rounded-md" onClick={onClose}>Login</Link>
                <Link to="/signup" className="bg-secondary-500 text-white py-2 px-4 rounded-md font-medium" onClick={onClose}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;