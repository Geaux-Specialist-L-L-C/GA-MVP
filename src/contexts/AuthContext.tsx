// File: /src/contexts/AuthContext.tsx
// Description: Authentication context provider with popup and redirect handling
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { AuthService } from "../firebase/auth-service";
import AuthErrorDialog from "../components/auth/AuthErrorDialog";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthReady: boolean;
  error: AuthError | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthError {
  message: string;
  retry?: boolean;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [showError, setShowError] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const auth = await authService.getAuth();
        auth.onAuthStateChanged((firebaseUser) => {
          setCurrentUser(firebaseUser);
          setLoading(false);
          setIsAuthReady(true);
        });
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setLoading(false);
        setIsAuthReady(true);
      }
    };

    initializeAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      const response = await authService.signInWithGoogle();
      if (!response.success && response.error) {
        setError(response.error);
        setShowError(true);
      }
    } catch (error) {
      setError({
        message: "An unexpected error occurred. Please try again.",
        retry: true,
      });
      setShowError(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      setError({
        message: "Failed to sign out. Please try again.",
        retry: true,
      });
      setShowError(true);
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
    setShowError(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthReady,
        error,
        signIn: handleSignIn,
        signOut: handleSignOut,
        loginWithGoogle: handleSignIn,
        clearError,
      }}
    >
      {children}
      <AuthErrorDialog
        open={showError}
        error={error}
        onClose={handleErrorClose}
        onRetry={error?.retry ? handleSignIn : undefined}
      />
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth, AuthContext };
