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
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirectChecked, setIsRedirectChecked] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Improved navigation with request animation frame for better performance
  const navigateDebounced = useCallback((to: string) => {
    if (location.pathname === to || pendingNavigation === to) {
      return;
    }

    setPendingNavigation(to);
    requestAnimationFrame(() => {
      navigate(to, { replace: true });
      setPendingNavigation(null);
    });
  }, [navigate, location.pathname, pendingNavigation]);

  // Improved redirect result handling
  useEffect(() => {
    let isMounted = true;

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth, browserPopupRedirectResolver);
        if (result?.user && isMounted) {
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigateDebounced(from);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        if (isMounted) {
          setError('Failed to complete sign-in. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsRedirectChecked(true);
        }
      }
    };

    handleRedirectResult();
    return () => { isMounted = false; };
  }, [navigateDebounced, location.state]);

  // Improved auth state change handling
  useEffect(() => {
    if (!isRedirectChecked) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user && location.pathname === '/login') {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigateDebounced(from);
      }
    });

    return unsubscribe;
  }, [navigateDebounced, isRedirectChecked, location.pathname, location.state]);

  const clearError = useCallback(() => setError(null), []);

  // Improved login with better error handling
  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      clearError();
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      const errorMessage = getAuthErrorMessage(authError.code);
      setError(errorMessage);
      throw error;
    }
  };

  // Improved Google sign-in with better error handling and fallback
  const loginWithGoogle = async (): Promise<UserCredential | void> => {
    try {
      clearError();
      return await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    } catch (error) {
      const authError = error as AuthError;
      
      if (isPopupError(authError.code)) {
        console.warn('Popup failed, falling back to redirect:', authError.code);
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      const errorMessage = getAuthErrorMessage(authError.code);
      setError(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
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

// Helper functions for better error handling
function isPopupError(code: string): boolean {
  return [
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
    'auth/popup-blocked',
    'auth/operation-not-supported-in-this-environment'
  ].includes(code);
}

function getAuthErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/popup-closed-by-user': 'Sign-in window was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in already in progress. Please wait.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/internal-error': 'An internal error occurred. Please try again.',
    'auth/operation-not-supported-in-this-environment': 'This sign-in method is not supported in your browser.',
  };

  return errorMessages[code] || 'An unexpected error occurred. Please try again.';
}
