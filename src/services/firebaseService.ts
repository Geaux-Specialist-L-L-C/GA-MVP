// frontend/src/services/firebaseService.ts
// Using relative import until TS path mapping for @/config resolves in tooling
import { auth } from '../config/firebase';
import {
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const firebaseService = {
  // Firebase Authentication
  signInWithGoogle: async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
      return null;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  getCurrentUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  },
  
  getIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
};
