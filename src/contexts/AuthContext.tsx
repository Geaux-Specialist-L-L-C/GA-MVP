// File: /src/contexts/AuthContext.tsx
// Description: Context for handling authentication state and actions
// Author: GitHub Copilot
// Created: 2023-10-10

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  browserPopupRedirectResolver,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
  type AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<UserCredential | void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirectChecked, setIsRedirectChecked] = useState(false);
  const [lastNavigationTimestamp, setLastNavigationTimestamp] = useState(0);

  // Debounced navigation function
  const navigateDebounced = useCallback((to: string) => {
    const now = Date.now();
    const NAVIGATION_THRESHOLD = 1000; // 1 second threshold

    if (location.pathname === to) {
      return; // Don't navigate if we're already at the target path
    }

    if (now - lastNavigationTimestamp > NAVIGATION_THRESHOLD) {
      setLastNavigationTimestamp(now);
      navigate(to, { replace: true });
    } else {
      console.debug('Navigation throttled to prevent history API spam');
    }
  }, [navigate, location.pathname, lastNavigationTimestamp]);

  // Handle redirect result first
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigateDebounced(from);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      } finally {
        setIsRedirectChecked(true);
      }
    };

    handleRedirectResult();
  }, [navigateDebounced, location.state]);

  // Then handle auth state changes
  useEffect(() => {
    if (!isRedirectChecked) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigateDebounced(from);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigateDebounced, isRedirectChecked, location.state]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    try {
      clearError();
      const result = await signInWithEmailAndPassword(auth, email, password);
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigateDebounced(from);
      return result;
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message || 'Failed to login');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      clearError();
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      
      if (result.user) {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigateDebounced(from);
        return result;
      }
    } catch (error) {
      const authError = error as AuthError;

      switch (authError.code) {
        case 'auth/popup-closed-by-user':
          console.warn('Popup closed. Attempting redirect login...');
          await signInWithRedirect(auth, googleProvider);
          break;
        case 'auth/cancelled-popup-request':
          setError('Another sign-in attempt is in progress. Please wait.');
          break;
        case 'auth/popup-blocked':
          console.warn('Popup blocked. Using redirect method...');
          await signInWithRedirect(auth, googleProvider);
          break;
        case 'auth/operation-not-supported-in-this-environment':
          console.warn('Popup not supported. Using redirect...');
          await signInWithRedirect(auth, googleProvider);
          break;
        default:
          if (authError.message?.includes('NS_ERROR_DOM_COEP_FAILED')) {
            setError('Browser security settings prevented login. Please try again or use a different browser.');
          } else {
            setError(authError.message || 'An unexpected error occurred');
            console.error('Auth error:', authError);
          }
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    clearError
  };

  // Only render children after redirect check is complete
  if (!isRedirectChecked) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
