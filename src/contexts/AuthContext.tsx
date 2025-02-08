import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  onAuthStateChanged,
  getIdToken,
  UserCredential,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getParentProfile } from '../services/profileService';
import { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 Setting Firebase auth persistence...");
        await setPersistence(auth, browserSessionPersistence);

        const result = await getRedirectResult(auth);
        if (result) {
          console.log("✅ Redirect result received");
          await handleAuthResult(result);
        }

        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
        return () => unsubscribe();

      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        setAuthError("Failed to initialize authentication");
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleAuthResult = async (result: UserCredential) => {
    try {
      const token = await getIdToken(result.user);
      localStorage.setItem('token', token);

      const parentProfile = await getParentProfile(result.user.uid);
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email || null,
        displayName: result.user.displayName || null,
        photoURL: result.user.photoURL || null,
        ...parentProfile
      };

      setCurrentUser(userData);
      setLoading(false);
      
    } catch (error) {
      console.error("❌ Error processing auth result:", error);
      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email || null,
        displayName: result.user.displayName || null,
        photoURL: result.user.photoURL || null
      });
      setLoading(false);
    }
  };

  const handleAuthStateChange = async (user: any) => {
    console.log("🔄 Auth state changed:", user ? "User logged in" : "No user");
    
    if (!user) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const token = await getIdToken(user);
      localStorage.setItem('token', token);

      const parentProfile = await getParentProfile(user.uid);
      setCurrentUser({
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        ...parentProfile
      });
    } catch (error) {
      console.error("❌ Error updating user state:", error);
      setCurrentUser({
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetRedirectResult = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await getRedirectResult(auth);
      if (result) {
        await handleAuthResult(result);
      }
    } catch (error) {
      console.error("❌ Error getting redirect result:", error);
      setAuthError("Failed to complete authentication");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("❌ Login error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setAuthError(null);
      console.log("🔄 Starting Google sign-in...");
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithRedirect(auth, googleProvider);
      // Note: No need to set loading false here as it will be handled by
      // the auth state change listener when the redirect completes
    } catch (error) {
      console.error("❌ Google login error:", error);
      setAuthError("Failed to start Google sign-in. Please try again.");
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      setAuthError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("❌ Signup error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error("❌ Logout error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    login,
    loginWithGoogle,
    signup,
    logout,
    getRedirectResult: handleGetRedirectResult
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
