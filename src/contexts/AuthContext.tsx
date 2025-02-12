import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup,
  onAuthStateChanged,
  browserPopupRedirectResolver,
  User
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
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Please allow popups for this site to enable Google login');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Popup closed by user. Please try again.');
      } else if (error.message.includes('NS_ERROR_DOM_COEP_FAILED')) {
        throw new Error('Cross-Origin-Embedder-Policy error. Please check your browser settings.');
      }
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
