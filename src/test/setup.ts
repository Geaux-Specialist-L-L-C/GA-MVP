import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

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

// Mock Firebase
jest.mock('../firebase/firebaseInit', () => ({
  app: jest.fn(),
  analytics: jest.fn(),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    setCustomParameters: jest.fn()
  })),
  signInWithPopup: jest.fn(),
  onAuthStateChanged: jest.fn()
}));