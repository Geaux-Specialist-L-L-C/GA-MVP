import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

async function accessSecretVersion(name) {
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString();
}

const firebaseConfig = {
  apiKey: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_API_KEY/versions/latest'),
  authDomain: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_AUTH_DOMAIN/versions/latest'),
  databaseURL: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_DATABASE_URL/versions/latest'),
  projectId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_PROJECT_ID/versions/latest'),
  storageBucket: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_STORAGE_BUCKET/versions/latest'),
  messagingSenderId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_MESSAGING_SENDER_ID/versions/latest'),
  appId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_APP_ID/versions/latest'),
  measurementId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/FIREBASE_MEASUREMENT_ID/versions/latest')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, storage, googleProvider };
