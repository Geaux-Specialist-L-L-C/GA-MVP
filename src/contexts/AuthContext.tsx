import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  getIdToken,
  UserCredential,
  getRedirectResult
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
    let isSubscribed = true;

    const checkRedirectAndAuthState = async () => {
      try {
        console.log("🔄 Checking for redirect result...");
        const result = await getRedirectResult(auth);
        if (result?.user && isSubscribed) {
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
          } catch (profileError) {
            console.error("Error fetching parent profile:", profileError);
            setCurrentUser({
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            });
          }
          console.log("✅ Redirect sign-in successful!");
        }
      } catch (error: any) {
        console.error("❌ Redirect sign-in error:", error);
        if (error?.code !== 'auth/credential-already-in-use' && isSubscribed) {
          setAuthError("Failed to complete sign-in. Please try again.");
        }
      }

      // Set up auth state listener after checking redirect result
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isSubscribed) return;

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

      return unsubscribe;
    };

    const unsubscribePromise = checkRedirectAndAuthState();
    
    return () => {
      isSubscribed = false;
      unsubscribePromise.then(unsubscribe => unsubscribe());
    };
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
      console.log("🔄 Starting Google sign-in process...");
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      setAuthError("Unable to sign in with Google. Please try again.");
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
