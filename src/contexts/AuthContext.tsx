// File: /src/contexts/AuthContext.tsx
// Description: Authentication context provider with popup and redirect handling
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  AuthError,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { debounce } from 'lodash';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  dismissError: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Debounced navigation to prevent history API spam
  const debouncedNavigate = debounce((path: string) => {
    window.history.pushState({}, '', path);
  }, 300);

  const handleAuthError = (error: AuthError) => {
    if (error.code === 'auth/popup-closed-by-user') {
      setError('Sign-in window was closed. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      setError('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
      // Fallback to redirect
      return true;
    } else {
      setError(`Authentication error: ${error.message}`);
    }
    return false;
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error: any) {
        if (handleAuthError(error)) {
          // Fallback to redirect method
          await signInWithRedirect(auth, provider);
        }
      }
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      debouncedNavigate('/login');
    } catch (error: any) {
      setError(`Logout error: ${error.message}`);
    }
  };

  const dismissError = () => setError(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        const authInstance = await auth;
        unsubscribe = onAuthStateChanged(authInstance, (firebaseUser: User | null) => {
          setUser(firebaseUser);
          setIsAuthReady(true);
        });
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setIsAuthReady(true); // Set to true even on error to prevent infinite loading
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      debouncedNavigate.cancel();
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        signInWithGoogle, 
        logout,
        dismissError,
        setUser,
        isAuthReady
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth, AuthContext };
