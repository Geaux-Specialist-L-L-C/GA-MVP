import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

  // Handle redirect result when the page loads
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate('/dashboard');
        }
      })
      .catch((error: AuthError) => {
        console.error('Redirect login failed:', error);
        throw new Error('Login failed. Please try again.');
      });
  }, [navigate]);

  const loginWithGoogle = async (): Promise<void> => {
    try {
      // Notify service worker about upcoming popup
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FIREBASE_AUTH_POPUP'
        });
      }

      // Attempt to sign in with popup
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      const authError = error as AuthError;

      if (authError.code === 'auth/popup-closed-by-user') {
        console.warn('Popup closed. Trying redirect login...');
        await signInWithRedirect(auth, googleProvider);
      } else if (authError.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in attempt is in progress. Please wait.');
      } else if (authError.message.includes('NS_ERROR_DOM_COEP_FAILED')) {
        throw new Error('Cross-Origin-Embedder-Policy error. Please check your browser settings.');
      } else if (authError.code === 'auth/popup-blocked') {
        console.warn('Popup blocked. Trying redirect login...');
        await signInWithRedirect(auth, googleProvider);
      } else if (authError.code === 'auth/operation-not-supported-in-this-environment') {
        console.warn('Popup not supported. Using redirect...');
        await signInWithRedirect(auth, googleProvider);
      } else {
        throw error; // Handle other errors normally
      }
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
