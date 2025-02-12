// File: /src/firebase/config.ts
// Description: Firebase configuration and initialization
// Author: GitHub Copilot
// Created: 2024-02-12

import { initializeApp } from 'firebase/app';
import { getAuth, browserPopupRedirectResolver, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initAuthServiceWorker } from './auth-service-worker';

declare global {
  interface ImportMetaEnv {
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
    VITE_FIREBASE_MEASUREMENT_ID: string;
    VITE_MAX_AUTH_RETRIES: string;
  }
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || ''
};

const app = initializeApp(firebaseConfig);

const initAuth = async () => {
  const maxRetries = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      });
      
      // Initialize service worker for auth popups
      await initAuthServiceWorker();
      
      return auth;
    } catch (error) {
      retryCount++;
      if (retryCount === maxRetries) {
        throw new Error('Failed to initialize Firebase Auth after multiple attempts');
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }
  }

  throw new Error('Failed to initialize Firebase Auth');
};

export const auth = await initAuth();
export const db = getFirestore(app);
export default app;
