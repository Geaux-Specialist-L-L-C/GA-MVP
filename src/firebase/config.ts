import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence,
  browserPopupRedirectResolver,
  signInWithPopup,
  signInWithRedirect,
  useDeviceLanguage,
  type Auth,
  type GoogleAuthProvider as GoogleAuthProviderType,
  type PopupRedirectResolver
} from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { initializeAuthServiceWorker } from './auth-service-worker';

// Get Firebase config based on environment
const getFirebaseConfig = (): FirebaseOptions => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || ''
});

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(getFirebaseConfig()) : getApps()[0];

// Initialize Firebase services
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const analytics: Analytics = getAnalytics(app);
const googleProvider: GoogleAuthProviderType = new GoogleAuthProvider();

// Configure auth settings
auth.useDeviceLanguage();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  auth_type: 'rerequest'
});

// Initialize persistence with retry mechanism
const initializePersistence = async (retries = 3): Promise<void> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.info("✅ Firebase auth persistence configured");
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`Retrying persistence setup... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return initializePersistence(retries - 1);
    }
    throw error;
  }
};

// Initialize auth features with enhanced error handling
const initializeAuth = async () => {
  try {
    const serviceWorkerReady = await initializeAuthServiceWorker();
    
    if (navigator.onLine) {
      await initializePersistence();
    } else {
      console.warn('Offline mode detected. Some features may be limited.');
      window.addEventListener('online', async () => {
        console.info('Back online. Initializing persistence...');
        await initializePersistence();
      });
    }

    // Listen for auth errors from service worker
    window.addEventListener('firebase-auth-error', ((event: CustomEvent) => {
      const { status, error } = event.detail;
      console.error('Authentication error:', { status, error });
      // You can handle the error here, e.g., show a notification
    }) as EventListener);

    return serviceWorkerReady;
  } catch (error: any) {
    console.error('Auth initialization error:', error);
    return false;
  }
};

// Enhanced sign-in function with error handling
const signInWithGoogle = async () => {
  if (!navigator.onLine) {
    throw new Error('You appear to be offline. Please check your internet connection and try again.');
  }

  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn('Sign-in window was closed. Would you like to try again?');
      await signInWithRedirect(auth, googleProvider);
    } else if (error.code === 'auth/popup-blocked' || 
               error.code === 'auth/operation-not-supported-in-this-environment') {
      console.warn('Popup was blocked. Using redirect method instead...');
      await signInWithRedirect(auth, googleProvider);
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network connection error. Please check your connection and try again.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in process was interrupted. Please try again.');
    } else if (error.code === 'auth/web-storage-unsupported') {
      throw new Error('This browser does not support web storage. Please enable cookies or try a different browser.');
    } else {
      console.error('Authentication error:', error);
      throw new Error('An unexpected error occurred during sign-in. Please try again.');
    }
  }
};

// Initialize features
initializeAuth().then(ready => {
  if (!ready) {
    console.warn('Service worker initialization failed. Some features may be limited.');
  }
});

// Export configured instances and utilities
export { 
  app, 
  auth,
  db,
  storage,
  analytics,
  googleProvider,
  signInWithGoogle,
  browserPopupRedirectResolver,
  type PopupRedirectResolver
};
