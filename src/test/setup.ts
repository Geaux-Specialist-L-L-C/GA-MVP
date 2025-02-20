// File: /src/test/setup.ts
// Description: Jest setup file for testing environment configuration.

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Mock environment variables
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';

// Run cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock react-icons
jest.mock('react-icons/fc', () => ({
  FcGoogle: function MockGoogleIcon() {
    return React.createElement('span', { 'data-testid': 'google-icon' }, 'Google Icon');
  }
}));

// Mock Firebase Auth
jest.mock('firebase/auth');

// Mock Firebase Config
jest.mock('../firebase/config', () => ({
  auth: jest.fn(),
  googleProvider: {
    setCustomParameters: jest.fn()
  }
}));

// Mock window.crypto for tests
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: () => new Uint32Array(10),
    subtle: {
      digest: () => Promise.resolve(new ArrayBuffer(32))
    }
  }
});