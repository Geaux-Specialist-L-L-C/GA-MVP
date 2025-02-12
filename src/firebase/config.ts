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
  type GoogleAuthProvider as GoogleAuthProviderType
} from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from "firebase/analytics";

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

// Initialize Firebase services with enhanced error handling
const auth: Auth = getAuth(app);
auth.useDeviceLanguage(); // Enable device language support

// Register service worker for auth popups
const registerAuthServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/__/auth/'
      });

      // Wait for the service worker to be ready
      await new Promise<void>((resolve) => {
        const messageHandler = (event: MessageEvent) => {
          if (event.data?.type === 'FIREBASE_SERVICE_WORKER_READY') {
            navigator.serviceWorker.removeEventListener('message', messageHandler);
            resolve();
          }
        };
        navigator.serviceWorker.addEventListener('message', messageHandler);
      });

      return registration;
    } catch (error) {
      console.warn('Service worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Configure offline persistence for Firestore
const enableOfflinePersistence = async (retries = 3): Promise<void> => {
  try {
    await enableIndexedDbPersistence(db);
    console.info("✅ Firestore offline persistence configured");
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (error.code === 'unimplemented') {
      console.warn('Browser does not support offline persistence.');
    } else if (retries > 0) {
      console.warn(`Retrying persistence setup... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return enableOfflinePersistence(retries - 1);
    }
  }
};

// Initialize persistence with retry mechanism
const initializePersistence = async (retries = 3): Promise<void> => {
  try {
    // First enable auth persistence
    await setPersistence(auth, browserLocalPersistence);
    console.info("✅ Firebase auth persistence configured");
    
    // Then enable Firestore offline persistence
    await enableOfflinePersistence();
  } catch (error: any) {
    if (retries > 0 && error.code === 'auth/internal-error') {
      console.warn(`Retrying persistence setup... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return initializePersistence(retries - 1);
    }
    console.error("❌ Auth persistence error:", error);
  }
};

// Configure Google Auth Provider with improved popup settings
const googleProvider: GoogleAuthProviderType = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Remove access_type and include_granted_scopes to reduce COEP issues
});

// Initialize other Firebase services
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const analytics: Analytics = getAnalytics(app);

// Initialize auth features with network detection
registerAuthServiceWorker().then(() => {
  if (navigator.onLine) {
    initializePersistence();
  } else {
    console.warn('Offline mode detected. Some features may be limited.');
    window.addEventListener('online', () => {
      console.info('Back online. Initializing persistence...');
      initializePersistence();
    });
  }
});

// Enhanced sign-in function with offline detection
const signInWithGoogle = async () => {
  // Check network connectivity
  if (!navigator.onLine) {
    throw new Error('You appear to be offline. Please check your internet connection and try again.');
  }

  // Check for service worker support first
  let hasServiceWorker = 'serviceWorker' in navigator && navigator.serviceWorker.controller;
  
  try {
    if (hasServiceWorker) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'FIREBASE_AUTH_POPUP'
      });
    }

    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn('Popup closed by user. Attempting redirect login...');
      await signInWithRedirect(auth, googleProvider);
    } else if (error.code === 'auth/popup-blocked' || 
               error.code === 'auth/operation-not-supported-in-this-environment') {
      console.warn('Popup blocked or not supported. Using redirect method...');
      await signInWithRedirect(auth, googleProvider);
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error during authentication. Please check your connection and try again.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in process was interrupted. Please try again.');
    } else {
      console.error('Authentication error:', error);
      throw error;
    }
  }
};

// Export configured instances
export { 
  app, 
  auth,
  db,
  storage,
  analytics,
  googleProvider,
  signInWithGoogle,
  browserPopupRedirectResolver,
  enableOfflinePersistence // Export for manual retry if needed
};
