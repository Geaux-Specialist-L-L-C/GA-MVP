import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getIdToken,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getParentProfile } from '../services/profileService';

interface AuthContextType {
  user: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser, true);
        localStorage.setItem('token', token);
        setUser(firebaseUser);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(userCredential.user, true);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await getIdToken(result.user, true);
      localStorage.setItem("token", token);

      const parentProfile = await getParentProfile(result.user.uid);

      console.log("✅ Google Sign-in Successful:", result.user);
    } catch (error) {
      console.error("❌ Google login error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        alert("Google sign-in was closed before completion. Please try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.warn("A previous sign-in popup was closed. Trying again...");
      } else {
        alert("Google sign-in failed. Please check your Firebase configuration.");
      }

      throw error;
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(userCredential.user, true);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
