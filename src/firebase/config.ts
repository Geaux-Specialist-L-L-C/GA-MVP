import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  connectAuthEmulator,
  useDeviceLanguage
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Environment variables are typed in src/env.d.ts

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.info("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firebase:", error);
  throw error;
}

// Initialize Firebase services with error handling
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Enable device language support
useDeviceLanguage(auth);

// Configure Google Auth Provider with improved popup handling
const googleProvider = new GoogleAuthProvider();
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
