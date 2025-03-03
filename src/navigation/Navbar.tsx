// File: /src/components/navigation/Navbar.tsx
// Description: Main navigation bar component for Geaux Academy
// Author: evopimp
// Created: 2025-03-03

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "@/components/navigation/MobileMenu";
import NavItem from "@/components/navigation/NavItem";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`bg-primary-900 text-white shadow-md ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Geaux Academy Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold">Geaux Academy</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/courses">Courses</NavItem>
            <NavItem to="/learning-path">My Learning Path</NavItem>
            {user ? (
              <>
                <NavItem to="/dashboard">Dashboard</NavItem>
                <NavItem to="/profile">Profile</NavItem>
                <button 
                  onClick={logout} 
                  className="text-white hover:text-secondary-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavItem to="/login">Login</NavItem>
                <NavItem to="/signup" isButton={true}>Sign Up</NavItem>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Navbar;