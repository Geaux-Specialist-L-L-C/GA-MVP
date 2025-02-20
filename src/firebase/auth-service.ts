// File: /src/firebase/auth-service.ts
// Description: Provides Google authentication functionality for Geaux Academy
// Author: GitHub Copilot
// Created: 2023-10-24

import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, Auth, User } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;
  private popupOpen: boolean = false;
  private _auth: Auth;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
      scope: 'email profile'
    });
    this._auth = auth;
  }

  get auth(): Auth {
    return this._auth;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = this._auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  private async refreshUserToken(user: User): Promise<string> {
    try {
      const token = await user.getIdToken(true);
      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.message || 'Failed to refresh authentication token');
    }
  }

  async signInWithGoogle() {
    try {
      if (this.popupOpen) {
        throw new Error('Authentication popup is already open');
      }

      await this.ensureInitialized();
      this.popupOpen = true;

      const result = await signInWithPopup(this._auth, this.provider);
      const token = await this.refreshUserToken(result.user);
      
      // Store token in a secure way
      if (window.isSecureContext) {
        sessionStorage.setItem('authToken', token);
      }
      
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site');
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      this.popupOpen = false;
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      if (window.isSecureContext) {
        sessionStorage.removeItem('authToken');
      }
      await firebaseSignOut(this._auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      await this.ensureInitialized();
      const currentUser = this._auth.currentUser;
      
      if (!currentUser) {
        return null;
      }

      const token = await this.refreshUserToken(currentUser);
      
      if (window.isSecureContext) {
        sessionStorage.setItem('authToken', token);
      }
      
      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.message || 'Failed to refresh authentication token');
    }
  }

  getCurrentToken(): string | null {
    if (!window.isSecureContext) {
      return null;
    }
    return sessionStorage.getItem('authToken');
  }
}
