// File: /src/test/setup.ts
// Description: Jest setup file for testing environment configuration.
// Author: [Your Name]
// Created: [Date]

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';
import type { Auth, GoogleAuthProvider } from 'firebase/auth';

// Mock react-icons
jest.mock('react-icons/fc', () => ({
  FcGoogle: function MockGoogleIcon() {
    return React.createElement('span', { 'data-testid': 'google-icon' }, 'Google Icon');
  }
}));

// Run cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock Firebase Configuration
jest.mock('../firebase/config', () => ({
  app: jest.fn(),
  analytics: jest.fn(),
  auth: jest.fn() as unknown as Auth,
  db: jest.fn(),
  storage: jest.fn(),
  googleProvider: {
    setCustomParameters: jest.fn()
  } as unknown as GoogleAuthProvider,
  signInWithGoogle: jest.fn(),
  browserPopupRedirectResolver: jest.fn()
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn()
  })),
  signInWithPopup: jest.fn(),
  signInWithRedirect: jest.fn(),
  getRedirectResult: jest.fn(),
  onAuthStateChanged: jest.fn(),
  browserPopupRedirectResolver: jest.fn()
}));