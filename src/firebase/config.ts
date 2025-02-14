// File: /src/firebase/config.ts
// Description: Firebase configuration with Firestore persistence setup

import { initializeApp } from 'firebase/app';
import { getAuth, browserPopupRedirectResolver, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Create Firestore instance and enable persistence immediately
export const db = getFirestore(app);

// Enable Firestore persistence with error handling
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported in this environment');
  } else {
    console.error('Firestore persistence initialization error:', err);
  }
});

// Initialize Auth with persistence and popup support
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Export other Firebase services as needed
export { app as firebase };
