import { db } from '../services/firestore.js';
import type { BeeAIMemory } from './types.js';

const memoryDefaults = (): BeeAIMemory => ({
  question_history: [],
  response_scores: [],
  session_status: 'active',
  focus_modality: null,
  final_report: null
});

const inMemoryStore = new Map<string, BeeAIMemory>();
const useInMemory = process.env.NODE_ENV === 'test';

const buildKey = (parentId: string, studentId: string) => `${parentId}_${studentId}`;

export const createDefaultMemory = memoryDefaults;

export const loadSessionMemory = async (
  parentId: string,
  studentId: string
): Promise<BeeAIMemory | null> => {
  const key = buildKey(parentId, studentId);

  if (useInMemory) {
    return inMemoryStore.get(key) ?? null;
  }

  try {
    const ref = db.collection('assessmentSessions').doc(key);
    const snap = await ref.get();
    if (!snap.exists) return null;
    const data = snap.data() as BeeAIMemory | undefined;
    if (!data) return null;
    return data;
  } catch (error) {
    return null;
  }
};

export const saveSessionMemory = async (
  parentId: string,
  studentId: string,
  memory: BeeAIMemory
): Promise<void> => {
  const key = buildKey(parentId, studentId);

  if (useInMemory) {
    inMemoryStore.set(key, memory);
    return;
  }

  try {
    const ref = db.collection('assessmentSessions').doc(key);
    await ref.set(
      {
        ...memory,
        updatedAt: new Date().toISOString(),
        parentId,
        studentId
      },
      { merge: true }
    );
  } catch (error) {
    // non-fatal; continue without blocking assessment
  }
};
