import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  onAuthStateChanged,
  getIdToken,
  UserCredential,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getParentProfile } from '../services/profileService';
import { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔄 Setting Firebase auth persistence...");
        await setPersistence(auth, browserLocalPersistence); // ✅ Ensures login is remembered across reloads

        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log("✅ Redirect result received");
          const token = await getIdToken(result.user);
          localStorage.setItem('token', token);

          try {
            const parentProfile = await getParentProfile(result.user.uid);
            setCurrentUser({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              ...parentProfile
            });
            navigate('/dashboard', { replace: true });
          } catch (profileError) {
            console.error("Error fetching parent profile:", profileError);
            setCurrentUser({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            });
            navigate('/dashboard', { replace: true });
          }
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log("🔄 Auth state changed:", user ? "User logged in" : "No user");
          
          if (user) {
            const token = await getIdToken(user);
            localStorage.setItem('token', token);

            const parentProfile = await getParentProfile(user.uid);
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              ...parentProfile
            });
          } else {
            setCurrentUser(null);
            localStorage.removeItem('token');
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("🔥 Auth persistence error:", error);
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user as User);
      navigate('/dashboard', { replace: true });
      return result;
    } catch (error) {
      console.error("❌ Login error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setAuthError(null);
      setLoading(true);
      console.log("🔄 Starting Google sign-in...");
      // Configure OAuth prompt behavior
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("❌ Google login error:", error);
      setAuthError("Failed to start Google sign-in.");
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setAuthError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user as User);
      return result;
    } catch (error) {
      console.error("❌ Signup error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      setCurrentUser(null);
    } catch (error) {
      console.error("❌ Logout error:", error);
      setAuthError((error as Error).message);
      throw error;
    }
  };

  const value: AuthContextType = {
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

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
