import { initializeApp, type FirebaseOptions } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserSessionPersistence,
  inMemoryPersistence,
  connectAuthEmulator,
  useDeviceLanguage,
  type Auth,
  type GoogleAuthProvider as GoogleAuthProviderType
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, type Analytics } from "firebase/analytics";

// Get Firebase config based on environment
const getFirebaseConfig = (): FirebaseOptions => {
  // For production deployment (using GitHub Actions secrets)
  if (process.env.NODE_ENV === 'production') {
    return {
      apiKey: process.env.FIREBASE_API_KEY || '',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.FIREBASE_APP_ID || '',
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      databaseURL: process.env.FIREBASE_DATABASE_URL || '' // Added databaseURL for production
    };
  }
  
  // For local development (using Vite's import.meta.env)
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '' // Added databaseURL for local development
  };
};

// Initialize Firebase with error handling
let app;
try {
  const firebaseConfig = getFirebaseConfig();
  app = initializeApp(firebaseConfig);
  console.info("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firebase:", error);
  throw error;
}

// Initialize Firebase services with error handling
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const analytics: Analytics = getAnalytics(app);

// Enable device language support
useDeviceLanguage(auth);

// Configure Google Auth Provider with improved popup handling
const googleProvider: GoogleAuthProviderType = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add additional OAuth 2.0 scopes
  scope: 'email profile',
  // Display on top frame in mobile browsers
  display: 'popup'
});

// Configure emulators for local development
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.info("✅ Firebase emulators connected");
  } catch (error) {
    console.error("❌ Error connecting to Firebase emulators:", error);
  }
}

// Set auth persistence based on environment
const initializeAuth = async () => {
  try {
    // Use in-memory persistence for development, session persistence for production
    const persistenceType = import.meta.env.DEV 
      ? inMemoryPersistence 
      : browserSessionPersistence; // Changed to session persistence for better security
    await setPersistence(auth, persistenceType);
    console.info(`✅ Firebase Auth persistence set to ${import.meta.env.DEV ? 'IN_MEMORY' : 'SESSION'}`);
  } catch (error) {
    console.error("❌ Error setting auth persistence:", error);
  }
};

// Initialize auth settings
initializeAuth();

export { app, auth, db, storage, analytics, googleProvider };
