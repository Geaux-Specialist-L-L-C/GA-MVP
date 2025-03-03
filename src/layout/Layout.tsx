// File: /src/components/layout/Layout.tsx
// Description: Main layout wrapper for consistent page structure
// Author: evopimp
// Created: 2025-03-03

import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hideNavbar = false, 
  hideFooter = false 
}) => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-primary-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;