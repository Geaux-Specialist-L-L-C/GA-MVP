// File: /src/firebase/config.ts
// Description: Firebase configuration with Firestore persistence setup

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver // Corrected import path
} from 'firebase/auth';
import { 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';

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

// Initialize Firestore with persistent cache settings
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED // Specify cache size within the cache object
  })
});

// Initialize Auth with persistence and popup support
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Export other Firebase services as needed
export { app as firebase };
