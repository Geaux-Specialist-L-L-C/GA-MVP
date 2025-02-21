// File: /src/components/Layout.tsx
// Description: Layout system component for the application.
// Author: GitHub Copilot
// Created: [Date]

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto p-4">
      {children}
    </div>
  );
};

export default Layout;