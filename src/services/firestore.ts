import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";

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
