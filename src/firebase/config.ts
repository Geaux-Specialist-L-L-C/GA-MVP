// File: /src/firebase/config.ts
// Description: Firebase configuration and service initialization with TypeScript types
// Author: GitHub Copilot
// Created: 2024-02-17

import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  initializeAuth,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  PopupRedirectResolver 
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { Analytics, getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Type for initialization errors
interface InitializationError extends Error {
  service: string;
}

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBfhBZbRRVsARX5u0biqVHQA6vudYw2F8U",
  authDomain: "gacentral-53615.firebaseapp.com",
  projectId: "gacentral-53615",
  storageBucket: "gacentral-53615.firebasestorage.app",
  messagingSenderId: "467988177048",
  appId: "1:467988177048:web:5dd07a8fe519ec030a30ed",
  measurementId: "G-H9285DBXK7"
};

// Service instances
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;
let storage: FirebaseStorage;

// Check for secure context
const isSecureContext = window.isSecureContext;
if (!isSecureContext) {
  console.warn('Application is not running in a secure context. Some features may be disabled.');
}

// Initialize Firebase services
async function initializeFirebaseServices(): Promise<void> {
  try {
    // Only initialize once
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);

      // Initialize Auth with persistence
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver as PopupRedirectResolver,
      });

      // Initialize Firestore with persistence
      firestore = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentSingleTabManager({
            forceOwnership: true
          }),
          cacheSizeBytes: CACHE_SIZE_UNLIMITED
        })
      });

      // Initialize Storage
      storage = getStorage(app);

      // Initialize Analytics if supported
      if (isSecureContext) {
        const analyticsSupported = await isAnalyticsSupported();
        if (analyticsSupported) {
          analytics = getAnalytics(app);
        }
      }

      // Initialize Cloud Messaging if supported and in secure context
      if (isSecureContext) {
        const messagingSupported = await isMessagingSupported();
        if (messagingSupported) {
          messaging = getMessaging(app);
        }
      }
    } else {
      // Get existing instances if already initialized
      app = getApps()[0];
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
    }
  } catch (error) {
    const err = error as InitializationError;
    console.error('Firebase initialization error:', err);
    throw new Error(`Failed to initialize Firebase services: ${err.message}`);
  }
}

// Initialize services immediately
initializeFirebaseServices().catch(error => {
  console.error('Failed to initialize Firebase:', error);
});

export {
  app,
  auth,
  firestore,
  analytics,
  messaging,
  storage,
  initializeFirebaseServices,
  type FirebaseApp,
  type Auth,
  type Firestore,
  type Analytics,
  type Messaging,
  type FirebaseStorage,
  type InitializationError
};
