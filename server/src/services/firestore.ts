import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const resolveProjectId = () =>
  process.env.FIREBASE_PROJECT_ID ??
  process.env.GOOGLE_CLOUD_PROJECT ??
  process.env.GCLOUD_PROJECT ??
  undefined;

const projectId = resolveProjectId();
const app =
  getApps().length > 0
    ? getApps()[0]
    : projectId
      ? initializeApp({ projectId })
      : initializeApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
