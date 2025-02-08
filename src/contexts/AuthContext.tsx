import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  getIdToken,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getParentProfile } from '../services/profileService';
import { AuthContextType, User } from '../types/auth';

const defaultContext: AuthContextType = {
  currentUser: null,
  loading: true,
  authError: null,
  login: async () => ({ user: null }),
  loginWithGoogle: async () => undefined,
  signup: async () => ({ user: null }),
  logout: async () => {}
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Handle redirect result when component mounts
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const token = await getIdToken(result.user, true);
          localStorage.setItem('token', token);
          
          await getParentProfile(result.user.uid);
          setCurrentUser(result.user as User);
          console.log("✅ Redirect sign-in successful");
        }
      } catch (error) {
        console.error("❌ Redirect sign-in error:", error);
        setAuthError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Auth state changed:", user ? "User logged in" : "User logged out");
      if (user) {
        try {
          const token = await getIdToken(user, true);
          localStorage.setItem('token', token);
          setCurrentUser(user as User);
        } catch (error) {
          console.error("❌ Token refresh error:", error);
        }
      } else {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<{ user: User } | void> => {
    try {
      setAuthError(null);
      console.log("🔄 Starting Google sign-in process...");
      
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result?.user) {
        const token = await getIdToken(result.user, true);
        localStorage.setItem('token', token);
        await getParentProfile(result.user.uid);
        setCurrentUser(result.user as User);
        console.log("✅ Popup sign-in successful");
        return { user: result.user as User };
      }
    } catch (error) {
      console.error("❌ Popup sign-in error:", error);
      
      if ((error as { code?: string }).code === 'auth/popup-blocked' || 
          (error as { code?: string }).code === 'auth/popup-closed-by-user' ||
          (error as { code?: string }).code === 'auth/cancelled-popup-request') {
        try {
          console.log("🔄 Switching to redirect sign-in...");
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          console.error("❌ Redirect sign-in error:", redirectError);
          setAuthError((redirectError as Error).message);
          throw redirectError;
        }
      }
      
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user, true);
      localStorage.setItem('token', token);
      setCurrentUser(result.user as User);
      return result;
    } catch (error) {
      console.error("❌ Email/Password login error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const signup = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setAuthError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user, true);
      localStorage.setItem('token', token);
      setCurrentUser(result.user as User);
      return result;
    } catch (error) {
      console.error("❌ Signup error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      setCurrentUser(null);
    } catch (error) {
      console.error("❌ Logout error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    authError,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}