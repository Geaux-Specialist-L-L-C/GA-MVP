import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirectChecked, setIsRedirectChecked] = useState(false);

  // Handle redirect result first
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      } finally {
        setIsRedirectChecked(true);
      }
    };

    handleRedirectResult();
  }, [navigate, location]);

  // Then handle auth state changes
  useEffect(() => {
    if (!isRedirectChecked) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user && !location.pathname.includes('/dashboard')) {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate, location, isRedirectChecked]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    try {
      clearError();
      const result = await signInWithEmailAndPassword(auth, email, password);
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      return result;
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message || 'Failed to login');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      clearError();
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      
      if (result.user) {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
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

  // Only render children after redirect check is complete
  if (!isRedirectChecked) {
    return null;
  }

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
