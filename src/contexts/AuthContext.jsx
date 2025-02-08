import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getParentProfile } from '../services/profileService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Handle redirect result when component mounts
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const token = await getIdToken(result.user, true);
          localStorage.setItem('token', token);
          
          // Get or create parent profile
          await getParentProfile(result.user.uid);
          setCurrentUser(result.user);
          console.log("✅ Redirect sign-in successful");
        }
      } catch (error) {
        console.error("❌ Redirect sign-in error:", error);
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleRedirectResult();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Auth state changed:", user ? "User logged in" : "User logged out");
      if (user) {
        try {
          const token = await getIdToken(user, true);
          localStorage.setItem('token', token);
          setCurrentUser(user);
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

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      console.log("🔄 Starting Google sign-in process...");
      
      // Try popup first
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result?.user) {
        const token = await getIdToken(result.user, true);
        localStorage.setItem('token', token);
        await getParentProfile(result.user.uid);
        setCurrentUser(result.user);
        console.log("✅ Popup sign-in successful");
        return { user: result.user };
      }
    } catch (error) {
      console.error("❌ Popup sign-in error:", error);
      
      // If popup fails, try redirect
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-request') {
        try {
          console.log("🔄 Switching to redirect sign-in...");
          await signInWithRedirect(auth, googleProvider);
          // The redirect result will be handled by the useEffect above
          return;
        } catch (redirectError) {
          console.error("❌ Redirect sign-in error:", redirectError);
          setAuthError(redirectError.message);
          throw redirectError;
        }
      }
      
      setAuthError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user, true);
      localStorage.setItem('token', token);
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      console.error("❌ Email/Password login error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      setAuthError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user, true);
      localStorage.setItem('token', token);
      setCurrentUser(result.user);
      return result;
    } catch (error) {
      console.error("❌ Signup error:", error);
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      setCurrentUser(null);
    } catch (error) {
      console.error("❌ Logout error:", error);
      setAuthError(error.message);
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
