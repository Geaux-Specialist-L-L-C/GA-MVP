// File: /src/hooks/useAuth.tsx
// Description: Custom hook for Firebase authentication
// Author: evopimp
// Created: 2025-03-03 06:23:10

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create new user with email and password
  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        role: "student"
      });
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
          role: "student"
        });
      }
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};