import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;

  constructor() {
    this.provider = new GoogleAuthProvider();
  }

  async getAuth() {
    return auth;
  }

  async signInWithGoogle() {
    return signInWithPopup(auth, this.provider);
  }

  async signOut() {
    return firebaseSignOut(auth);
  }
}
