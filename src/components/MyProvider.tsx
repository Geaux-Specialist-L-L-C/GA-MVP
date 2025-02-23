import React, { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { BrowserRouter } from 'react-router-dom';

interface MyProviderProps {
  children: ReactNode;
}

const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>  {/* Ensures routing is available in tests */}
      <AuthProvider>
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default MyProvider;
