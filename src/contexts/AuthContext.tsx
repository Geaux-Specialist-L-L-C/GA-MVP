import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  onAuthStateChanged,
  getIdToken,
  UserCredential,
  getRedirectResult,
  GoogleAuthProvider
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

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        setLoading(true);
        console.log("🔄 Checking redirect result...");
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log("✅ Redirect result received");
          // Get ID token and store it
          const token = await getIdToken(result.user);
          localStorage.setItem('token', token);

          // Get parent profile
          try {
            const parentProfile = await getParentProfile(result.user.uid);
            setCurrentUser({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              ...parentProfile
            });
          } catch (profileError) {
            console.error("Error fetching parent profile:", profileError);
            setCurrentUser({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            });
          }
        }
      } catch (error) {
        console.error("❌ Error handling redirect result:", error);
        setAuthError("Sign-in failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Handle redirect result when component mounts
    handleRedirectResult();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Auth state changed:", user?.email);
      if (user) {
        try {
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
        } catch (error) {
          console.error("Error fetching parent profile:", error);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user as User);
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
