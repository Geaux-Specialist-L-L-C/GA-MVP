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

// Interface for initialization errors
interface InitializationError extends Error {
  service: string;
  code?: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_VAPID_KEY' // Added VAPID key to required environment variables
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY // Added VAPID key to firebaseConfig
};

// SSL configuration
const sslConfig = {
  key: import.meta.env.VITE_SSL_KEY,
  cert: import.meta.env.VITE_SSL_CERT
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
  console.warn('Application is not running in a secure context. Some features will be disabled.');
}

// Maximum retries for initialization
const MAX_INIT_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

// Initialize Firebase services with retry mechanism
async function initializeFirebaseServices(retryCount = 0): Promise<void> {
  try {
    // Only initialize once
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);

      // Initialize Auth with persistence and popup (preferred method)
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver as PopupRedirectResolver
      });

      // Initialize Firestore with persistence and single tab manager
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

      // Initialize Analytics if supported and in secure context
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

    // Retry initialization if under max attempts
    if (retryCount < MAX_INIT_RETRIES) {
      console.log(`Retrying Firebase initialization (${retryCount + 1}/${MAX_INIT_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      return initializeFirebaseServices(retryCount + 1);
    }

    throw new Error(`Failed to initialize Firebase services after ${MAX_INIT_RETRIES} attempts: ${err.message}`);
  }
}

// Initialize services immediately
initializeFirebaseServices().catch(error => {
  console.error('Critical: Failed to initialize Firebase:', error);
});

export {
  app,
  auth,
  firestore,
  analytics,
  messaging,
  storage,
  firebaseConfig,
  sslConfig,
  initializeFirebaseServices,
  type FirebaseApp,
  type Auth,
  type Firestore,
  type Analytics,
  type Messaging,
  type FirebaseStorage,
  type InitializationError
};
