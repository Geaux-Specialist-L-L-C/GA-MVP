import { initializeApp, FirebaseOptions } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { initializeAnalytics, getAnalytics } from 'firebase/analytics';
import { initializeAuthServiceWorker } from './auth-service-worker';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || ''
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Auth with indexed DB persistence
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Initialize Analytics in production only
export const analytics = process.env.NODE_ENV === 'production' ? getAnalytics(app) : null;

// Initialize service worker with retry logic
const initializeFirebaseWithRetry = async (retries = MAX_RETRIES): Promise<void> => {
  try {
    await initializeAuthServiceWorker();
    console.log('✅ Firebase auth persistence configured');
  } catch (error) {
    if (retries > 0) {
      console.log(`Service worker initialization failed, retrying in ${RETRY_DELAY}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return initializeFirebaseWithRetry(retries - 1);
    } else {
      console.warn('Service worker initialization failed. Some features may be limited.');
      // Still allow the app to function without service worker
      return;
    }
  }
};

// Start initialization
initializeFirebaseWithRetry();
