import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { useProfile } from './ProfileContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateProfile } = useProfile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Update profile context when user is authenticated
        updateProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        updateProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [updateProfile]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
