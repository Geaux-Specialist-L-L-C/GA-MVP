import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app = getApps().length > 0 ? getApps()[0] : initializeApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
