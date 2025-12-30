import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  UserCredential
} from 'firebase/auth';
import { auth, authInit } from '../config/firebase';
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
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (isDev) {
      console.debug('[AuthProvider] mount');
    }
    return () => {
      if (isDev) {
        console.debug('[AuthProvider] unmount');
      }
    };
  }, [isDev]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => undefined;
    let hasResolved = false;
    let authReadyTimeout: ReturnType<typeof setTimeout> | null = null;

    const initAuth = async () => {
      if (isDev) {
        console.debug('[AuthProvider] awaiting authInit');
      }
      try {
        await authInit;
      } catch (authError) {
        console.warn('[AuthProvider] authInit failed (continuing):', authError);
      }

      if (!isMounted) return;
      if (isDev) {
        console.debug('[AuthProvider] subscribing onAuthStateChanged');
      }
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          console.log('[AuthProvider] onAuthStateChanged fired uid=', user?.uid ?? null);
          if (isDev) {
            console.debug('[AuthProvider] onAuthStateChanged', {
              userUid: user?.uid ?? null,
              currentUserUid: auth.currentUser?.uid ?? null,
              persistenceManager: (auth as { persistenceManager?: unknown }).persistenceManager
            });
          }
          setCurrentUser(user);
          setError(null);
          if (!hasResolved) {
            hasResolved = true;
            setLoading(false);
            setIsAuthReady(true);
            if (authReadyTimeout) {
              clearTimeout(authReadyTimeout);
              authReadyTimeout = null;
            }
          }
        },
        (authError) => {
          console.error('Auth state change error:', authError);
          setError(authError instanceof Error ? authError.message : 'Failed to determine auth state');
          if (!hasResolved) {
            hasResolved = true;
            setLoading(false);
            setIsAuthReady(true);
            if (authReadyTimeout) {
              clearTimeout(authReadyTimeout);
              authReadyTimeout = null;
            }
          }
        }
      );

      authReadyTimeout = setTimeout(() => {
        if (!hasResolved) {
          console.error('[AuthProvider] auth readiness timeout: forcing ready state');
          hasResolved = true;
          setIsAuthReady(true);
          setLoading(false);
        }
      }, 2000);
    };

    initAuth();

    return () => {
      isMounted = false;
      unsubscribe();
      if (authReadyTimeout) {
        clearTimeout(authReadyTimeout);
      }
    };
  }, [isDev]);

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
    runWithAuthState(async () => {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(credential.user);
      return credential;
    }, 'Failed to log in');

  const signup = (email: string, password: string): Promise<UserCredential> =>
    runWithAuthState(async () => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(credential.user);
      return credential;
    }, 'Failed to sign up');

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
