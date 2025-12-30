// File: /src/config/firebase.ts
// Description: Centralized Firebase initialization & singleton exports (app, auth, firestore)
// Author: GitHub Copilot
// Created: 2025-09-07

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate required Firebase config (warn only in dev so UI still mounts)
function validateFirebaseConfig() {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  const missing = requiredVars.filter(v => !import.meta.env[v as keyof ImportMetaEnv]);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn('[firebase] Missing env vars (continuing for dev):', missing.join(', '));
  }
}

validateFirebaseConfig();

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
};

// Ensure single app instance
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timeout`)), ms);
    })
  ]);

export const authInit = (async () => {
  if (!import.meta.env.DEV) {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch {
      // ignore in production
    }
    return;
  }

  console.debug('[firebase] setPersistence start');
  try {
    await withTimeout(setPersistence(auth, browserLocalPersistence), 1000, 'local persistence');
    console.debug('[firebase] persistence=local');
    return;
  } catch (error) {
    console.warn('[firebase] local persistence failed:', error);
  }

  try {
    await withTimeout(setPersistence(auth, browserSessionPersistence), 1000, 'session persistence');
    console.debug('[firebase] persistence=session');
    return;
  } catch (error) {
    console.warn('[firebase] session persistence failed:', error);
  }

  console.warn('[firebase] persistence disabled (continuing)');
})();
export const firestore = getFirestore(app);

if (import.meta.env.DEV) {
  console.debug('[firebase] app name', app.name);
  console.debug('[firebase] auth instance', auth.app.name);
}

// Default export kept for backward compatibility (legacy imports)
export default app;
