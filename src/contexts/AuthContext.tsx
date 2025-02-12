import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  getIdToken,
  UserCredential,
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
      navigate('/dashboard');
    } catch (error) {
      console.error("❌ Error processing auth result:", error);
      // Still set the basic user data even if profile fetch fails
      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email || null,
        displayName: result.user.displayName || null,
        photoURL: result.user.photoURL || null
      });
    } finally {
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
      console.error("❌ Error handling auth state change:", error);
      setAuthError("Failed to load user profile");
      // Set basic user data even if profile load fails
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

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setAuthError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthResult(result);
      return result;
    } catch (error) {
      console.error("❌ Login error:", error);
      setAuthError((error as Error).message);
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setAuthError(null);
    
    // Function to check if popup is blocked
    const isPopupBlocked = () => {
      const popup = window.open('', '_blank', 'width=1,height=1');
      const isBlocked = !popup || popup.closed;
      if (popup) popup.close();
      return isBlocked;
    };

    try {
      // Clear any existing tokens and check for popup blocker
      localStorage.removeItem('token');
      if (isPopupBlocked()) {
        throw new Error('auth/popup-blocked');
      }
      
      // Add popup timeout handling with retry
      const popupTimeoutMs = 120000; // 2 minutes
      const maxRetries = 2;
      let retryCount = 0;
      
      const attemptLogin = async (): Promise<UserCredential> => {
        const popupPromise = signInWithPopup(auth, googleProvider);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('popup-timeout')), popupTimeoutMs);
        });

        try {
          return await Promise.race([popupPromise, timeoutPromise]) as UserCredential;
        } catch (error: any) {
          if (error.message === 'popup-timeout' && retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying popup login (attempt ${retryCount}/${maxRetries})`);
            return attemptLogin();
          }
          throw error;
        }
      };

      const result = await attemptLogin();
      await handleAuthResult(result);
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      
      // Enhanced error handling
      let errorMessage = "Failed to sign in with Google";
      switch(error.code || error.message) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Sign-in window was closed. Please try again.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Pop-up was blocked. Please enable pop-ups for this site and try again.";
          break;
        case 'popup-timeout':
          errorMessage = "Sign-in timed out. Please check your internet connection and try again.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many sign-in attempts. Please wait a moment and try again.";
          break;
        default:
          errorMessage = `Sign-in failed: ${error.message || 'Unknown error'}`;
      }
      
      setAuthError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setAuthError(null);
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handleAuthResult(result);
      return result;
    } catch (error) {
      console.error("❌ Signup error:", error);
      setAuthError((error as Error).message);
      setLoading(false);
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
    setAuthError
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
