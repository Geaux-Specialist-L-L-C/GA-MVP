import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { firebaseService } from '../services/firebaseService';
import type { AuthContextType } from '../types/auth';

export type AuthContextProps = AuthContextType;

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  user: null,
  loading: true,
  isLoading: true,
  isAuthReady: false,
  error: null,
  login: async () => {
    throw new Error('AuthProvider not initialized');
  },
  loginWithGoogle: async () => {
    throw new Error('AuthProvider not initialized');
  },
  signup: async () => {
    throw new Error('AuthProvider not initialized');
  },
  logout: async () => {
    throw new Error('AuthProvider not initialized');
  },
  clearError: () => undefined
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectHandledRef = useRef(false);
  const authResolvedRef = useRef(false);

  useEffect(() => {
    console.log('Auth init start');
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log('onAuthStateChanged user=', user);
        setCurrentUser(user);
        setError(null);
        if (!authResolvedRef.current) {
          authResolvedRef.current = true;
          setLoading(false);
          setIsAuthReady(true);
        }
      },
      (authError) => {
        console.error('Auth state change error:', authError);
        setError(authError instanceof Error ? authError.message : 'Failed to determine auth state');
        if (!authResolvedRef.current) {
          authResolvedRef.current = true;
          setLoading(false);
          setIsAuthReady(true);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (redirectHandledRef.current) {
      return;
    }
    redirectHandledRef.current = true;

    const resolveRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        console.log('getRedirectResult result=', result);
      } catch (redirectError) {
        console.error('getRedirectResult error:', redirectError);
        setError(
          redirectError instanceof Error
            ? redirectError.message
            : 'Failed to complete redirect sign-in'
        );
      }
    };

    resolveRedirect();
  }, []);

  const clearError = () => setError(null);

  const isPopupCancelled = (authError: unknown): boolean => {
    const firebaseError = authError as { code?: string };
    return firebaseError.code === 'auth/popup-closed-by-user';
  };

  const runWithAuthState = async <T,>(
    action: () => Promise<T>,
    fallbackMessage: string
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await action();
    } catch (authError) {
      if (isPopupCancelled(authError)) {
        return null as T;
      }
      const message =
        authError instanceof Error ? authError.message : fallbackMessage;
      setError(message);
      throw authError instanceof Error ? authError : new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = (email: string, password: string): Promise<UserCredential> =>
    runWithAuthState(
      () => signInWithEmailAndPassword(auth, email, password),
      'Failed to log in'
    );

  const signup = (email: string, password: string): Promise<UserCredential> =>
    runWithAuthState(
      () => createUserWithEmailAndPassword(auth, email, password),
      'Failed to sign up'
    );

  const loginWithGoogle = (): Promise<User | null> =>
    runWithAuthState(async () => {
      const user = await firebaseService.signInWithGoogle();
      if (user) {
        setCurrentUser(user);
      }
      return user;
    }, 'Failed to sign in with Google');

  const logout = (): Promise<void> =>
    runWithAuthState(async () => {
      await firebaseService.signOut();
    }, 'Failed to log out');

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        loading,
        isLoading: loading,
        isAuthReady,
        error,
        login,
        loginWithGoogle,
        signup,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
