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
  browserLocalPersistence 
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getStorage, FirebaseStorage } from 'firebase/storage';

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

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;
let storage: FirebaseStorage;

// Initialize Firebase only if it hasn't been initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);

  // Initialize Auth with persistence
  auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });

  // Initialize Firestore with persistence
  firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager({
        forceOwnership: true
      })
    })
  });

  // Initialize Storage
  storage = getStorage(app);

  // Initialize Analytics if supported
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => {
    console.warn('Firebase Analytics initialization failed:', err);
  });

  // Initialize Cloud Messaging if supported and in secure context
  if (window.isSecureContext) {
    isMessagingSupported().then(supported => {
      if (supported) {
        messaging = getMessaging(app);
      }
    }).catch(err => {
      console.warn('Firebase Cloud Messaging initialization failed:', err);
    });
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
}

export {
  app,
  auth,
  firestore,
  analytics,
  messaging,
  storage,
  type FirebaseApp,
  type Auth,
  type Firestore,
  type Analytics,
  type Messaging,
  type FirebaseStorage
};
