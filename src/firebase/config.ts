import { initializeApp, type FirebaseOptions } from "firebase/app";
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
import { getFirestore, type Firestore } from "firebase/firestore";
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

// Initialize Firebase with improved error handling
let app;
try {
  const firebaseConfig = getFirebaseConfig();
  app = initializeApp(firebaseConfig);
  console.info("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firebase:", error);
  throw error;
}

// Initialize Firebase services with enhanced popup handling
const auth: Auth = getAuth(app);
auth.useDeviceLanguage(); // Enable device language support
setPersistence(auth, browserLocalPersistence) // Use local persistence for better UX
  .catch(error => console.error("Auth persistence error:", error));

// Configure Google Auth Provider with improved popup settings
const googleProvider: GoogleAuthProviderType = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline',
  include_granted_scopes: 'true',
  // Ensure popups work in iframe contexts
  display: 'popup'
});

// Initialize other Firebase services
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const analytics: Analytics = getAnalytics(app);

// Enhanced sign-in function with popup handling and redirect fallback
const signInWithGoogle = async () => {
  if ('serviceWorker' in navigator) {
    // Register service worker if not already registered
    const registration = await navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .catch(err => {
        console.error('❌ Firebase Service Worker registration failed:', err);
        return null;
      });

    if (registration) {
      console.info('✅ Firebase Service Worker registered successfully');
      
      // Set up message listener for service worker responses
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'FIREBASE_AUTH_ERROR') {
          console.error('Auth error from service worker:', event.data.error);
        } else if (event.data?.type === 'FIREBASE_AUTH_POPUP_READY') {
          console.info('Auth popup ready:', event.data.message);
        }
      });

      // Notify service worker about upcoming popup
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'FIREBASE_AUTH_POPUP'
        });
      }
    }
  }

  try {
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn('Popup closed. Attempting redirect login...');
      await signInWithRedirect(auth, googleProvider);
    } else if (error.code === 'auth/popup-blocked' || 
               error.code === 'auth/operation-not-supported-in-this-environment') {
      console.warn('Popup not available. Using redirect...');
      await signInWithRedirect(auth, googleProvider);
    } else {
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
  browserPopupRedirectResolver
};
