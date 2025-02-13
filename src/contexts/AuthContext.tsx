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
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      await authService.signInWithGoogle();
    } catch (error: any) {
      console.error("Sign in failed:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled. Please try again.');
      } else {
        setError(error.message || "Failed to sign in. Please try again.");
      }
      throw error; // Re-throw to be handled by components
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (error: any) {
      setError("Failed to sign out. Please try again.");
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
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
        open={!!error}
        error={error ? { message: error } : null}
        onClose={clearError}
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
