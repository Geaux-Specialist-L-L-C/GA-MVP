import { beforeEach, describe, expect, it, vi } from 'vitest';

const initializeApp = vi.fn(() => ({ name: 'test-app' }));
const getApps = vi.fn(() => []);
const getAuth = vi.fn(() => ({ auth: true }));
const getFirestore = vi.fn(() => ({ db: true }));

vi.mock('firebase-admin/app', () => ({
  getApps,
  initializeApp
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore
}));

beforeEach(() => {
  vi.resetModules();
  initializeApp.mockClear();
  getApps.mockClear();
  getAuth.mockClear();
  getFirestore.mockClear();
  delete process.env.FIREBASE_PROJECT_ID;
  delete process.env.GOOGLE_CLOUD_PROJECT;
  delete process.env.GCLOUD_PROJECT;
});

describe('firestore service config', () => {
  it('uses FIREBASE_PROJECT_ID when provided', async () => {
    process.env.FIREBASE_PROJECT_ID = 'geaux-academy';
    const { auth, db } = await import('../services/firestore.js');

    expect(initializeApp).toHaveBeenCalledWith({ projectId: 'geaux-academy' });
    expect(getAuth).toHaveBeenCalledWith({ name: 'test-app' });
    expect(getFirestore).toHaveBeenCalledWith({ name: 'test-app' });
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });
});
