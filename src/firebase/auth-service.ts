import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  async getAuth() {
    await this.ensureInitialized();
    return auth;
  }

  async signInWithGoogle() {
    try {
      await this.ensureInitialized();
      return await signInWithPopup(auth, this.provider);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      // Rethrow with a more specific error message
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      return await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }
}
