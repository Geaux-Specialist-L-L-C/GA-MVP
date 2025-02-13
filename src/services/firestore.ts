import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // ...your firebase config
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

enableIndexedDbPersistence(firestore).catch((err) => {
  console.error("Failed to enable persistence:", err);
});

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function getData(collectionName: string, docId: string) {
  const docRef = doc(firestore, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setData(collectionName: string, docId: string, data: any) {
  const docRef = doc(firestore, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  return true;
}

// ...other helper functions as needed...
