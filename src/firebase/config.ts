import { initializeApp, FirebaseOptions } from 'firebase/app';
import { 
  initializeAuth, 
  browserPopupRedirectResolver, 
  GoogleAuthProvider, 
  indexedDBLocalPersistence 
} from 'firebase/auth';
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

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Export Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
export const googleProvider = provider;

// Optionally initialize Analytics only in production
export const analytics = process.env.NODE_ENV === 'production' ? getAnalytics(app) : null;

// Initialize Auth service worker with retry logic
const initializeFirebaseWithRetry = async (retries = 3): Promise<void> => {
  try {
    await initializeAuthServiceWorker();
    console.log('✅ Firebase auth persistence configured');
  } catch (error) {
    if (retries > 0) {
      console.log(`Service worker initialization failed, retrying... (${retries})`);
      return initializeFirebaseWithRetry(retries - 1);
    }
    console.warn('Service worker initialization failed after retries.');
  }
};

initializeFirebaseWithRetry();

export { app };
