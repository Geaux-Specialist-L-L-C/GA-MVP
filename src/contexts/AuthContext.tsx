// File: /src/contexts/AuthContext.tsx
// Description: Provides authentication state and methods via React context
// Author: Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Auth,
  User,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { debounce } from '@mui/material/utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [auth] = useState<Auth>(getAuth());
  const maxRetries = parseInt(process.env.VITE_MAX_AUTH_RETRIES || '3', 10);

  // Initialize auth persistence with retry logic
  const initializePersistence = useCallback(async (retries = 0) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (err) {
      if (retries < maxRetries) {
        setTimeout(() => initializePersistence(retries + 1), 1000);
      } else {
        console.error('Failed to initialize auth persistence:', err);
      }
    }
  }, [auth, maxRetries]);

  useEffect(() => {
    initializePersistence();
  }, [initializePersistence]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const debouncedNavigate = debounce((callback: () => void) => callback(), 300);

  const googleSignIn = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      try {
        // Try popup first
        await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user') {
          // Fallback to redirect
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (err: any) {
      setError(new Error(err.message || 'Failed to sign in with Google'));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      debouncedNavigate(() => window.location.href = '/');
    } catch (err: any) {
      setError(new Error(err.message || 'Failed to sign out'));
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    googleSignIn,
    signOut
  };

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

export default AuthProvider;
