import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getAuth, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

export class AuthService {
  async getAuth() {
    return auth;
  }

  async signInWithGoogle(): Promise<void> {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
}
