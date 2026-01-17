import { Firestore } from "@google-cloud/firestore";
import type { VarkSession } from "../beeai/vark.js";

export interface SessionStore {
  getSession(sessionId: string): Promise<VarkSession | null>;
  saveSession(session: VarkSession): Promise<void>;
}

class MemorySessionStore implements SessionStore {
  private sessions = new Map<string, VarkSession>();

  async getSession(sessionId: string): Promise<VarkSession | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  async saveSession(session: VarkSession): Promise<void> {
    this.sessions.set(session.sessionId, session);
  }
}

class FirestoreSessionStore implements SessionStore {
  private collection: FirebaseFirestore.CollectionReference;

  constructor(projectId: string) {
    const firestore = new Firestore({ projectId });
    this.collection = firestore.collection("vark_sessions");
  }

  async getSession(sessionId: string): Promise<VarkSession | null> {
    const snapshot = await this.collection.doc(sessionId).get();
    return snapshot.exists ? (snapshot.data() as VarkSession) : null;
  }

  async saveSession(session: VarkSession): Promise<void> {
    await this.collection.doc(session.sessionId).set(session, { merge: true });
  }
}

let store: SessionStore | null = null;

export function getSessionStore(): SessionStore {
  if (store) {
    return store;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT;
  if (projectId) {
    console.info("session_store=firestore", { projectId });
    store = new FirestoreSessionStore(projectId);
  } else {
    console.info("session_store=memory");
    store = new MemorySessionStore();
  }

  return store;
}
