import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  browserPopupRedirectResolver,
  signInWithEmailAndPassword,
  type User,
  type UserCredential,
  type AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<UserCredential | void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Login failed. Please try again.');
      });
  }, [navigate]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
      return result;
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message || 'Failed to sign in');
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<UserCredential | void> => {
    try {
      // Check for service worker support
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FIREBASE_AUTH_POPUP'
        });
      }

      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      
      if (result.user) {
        navigate('/dashboard');
        return result;
      }
    } catch (error) {
      const authError = error as AuthError;

      switch (authError.code) {
        case 'auth/popup-closed-by-user':
          console.warn('Popup closed. Attempting redirect login...');
          await signInWithRedirect(auth, googleProvider);
          break;
        case 'auth/cancelled-popup-request':
          setError('Another sign-in attempt is in progress. Please wait.');
          break;
        case 'auth/popup-blocked':
          console.warn('Popup blocked. Using redirect method...');
          await signInWithRedirect(auth, googleProvider);
          break;
        case 'auth/operation-not-supported-in-this-environment':
          console.warn('Popup not supported. Using redirect...');
          await signInWithRedirect(auth, googleProvider);
          break;
        default:
          if (authError.message?.includes('NS_ERROR_DOM_COEP_FAILED')) {
            setError('Browser security settings prevented login. Please try again or use a different browser.');
          } else {
            setError(authError.message || 'An unexpected error occurred');
            console.error('Auth error:', authError);
          }
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    clearError
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
