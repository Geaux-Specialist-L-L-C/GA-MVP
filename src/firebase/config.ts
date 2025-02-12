import { initializeApp, type FirebaseOptions } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence,
  browserPopupRedirectResolver,
  useDeviceLanguage,
  type Auth,
  type GoogleAuthProvider as GoogleAuthProviderType
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Get Firebase config based on environment
const getFirebaseConfig = (): FirebaseOptions => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || ''
  };
};

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
  display: 'popup',
  // Add additional OAuth scopes if needed
  scope: 'email profile'
});

// Initialize other Firebase services
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const analytics: Analytics = getAnalytics(app);

// Export configured instances
export { 
  app, 
  auth,
  db,
  storage,
  analytics,
  googleProvider,
  browserPopupRedirectResolver // Export resolver for consistent popup handling
};
