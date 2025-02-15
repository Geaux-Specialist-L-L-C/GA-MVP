// File: /src/firebase/config.ts
// Description: Firebase configuration with Firestore persistence setup

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth
} from 'firebase/auth';
import { 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentSingleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB0V4iL1aQ_xtWeO_iWL1fuhu4_SLfqZeo",
  authDomain: "geaux-academy.firebaseapp.com",
  databaseURL: "https://geaux-academy-default-rtdb.firebaseio.com",
  projectId: "geaux-academy",
  storageBucket: "geaux-academy.firebasestorage.app",
  messagingSenderId: "145629211979",
  appId: "1:145629211979:web:1f9c854ecb392916adccce",
  measurementId: "G-6MBLBQ3NWS"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache settings
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({ forceOwnership: true }),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Initialize Auth with persistence and popup support (preferred method)
export const auth: Auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Initialize Analytics
export const analytics: Analytics = getAnalytics(app);

// Export app instance for other Firebase services
export { app as firebase };
