// File: /src/contexts/AuthContext.tsx
// Description: Context for authentication using Firebase
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../firebase/auth-service';

export interface AuthContextProps {
  currentUser: User | null;
  isAuthReady: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((firebaseUser: User | null) => {
      setCurrentUser(firebaseUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextProps = {
    currentUser,
    isAuthReady,
    error,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
