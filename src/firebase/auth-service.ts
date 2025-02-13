import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getAuth, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

interface AuthResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
    retry?: boolean;
  };
}

export class AuthService {
  async getAuth() {
    return auth;
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message || "Authentication failed. Please try again.",
          retry: true,
        },
      };
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
}
