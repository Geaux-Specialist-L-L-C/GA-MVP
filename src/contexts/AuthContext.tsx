import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup,
  onAuthStateChanged,
  browserPopupRedirectResolver,
  User,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async (): Promise<void> => {
    try {
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FIREBASE_AUTH_POPUP'
        });
      }

      const result = await signInWithPopup(
        auth, 
        googleProvider,
        browserPopupRedirectResolver
      );
      
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/popup-blocked') {
        throw new Error('Please allow popups for this site to enable Google login');
      } else if (authError.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled. Please try again when ready.');
      } else if (authError.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in attempt is in progress. Please wait.');
      }
      // For any other errors, throw the original error
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle
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
