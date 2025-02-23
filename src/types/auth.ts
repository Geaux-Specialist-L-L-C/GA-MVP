import { UserCredential } from 'firebase/auth';

// Common types for auth context and components
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

export interface AuthError {
  code?: string;
  message: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  setAuthError: (error: string | null) => void;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
  createdAt: string;
  updatedAt: string;
  learningStyle?: string;
  assessmentResults?: object;
}

export interface Parent {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthRouteProps {
  children: React.ReactNode;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

declare global {
  interface WindowEventMap {
    'firebase-auth-worker-status': CustomEvent<{
      success: boolean;
      isSecure: boolean;
      supportsServiceWorker: boolean;
      error?: string;
    }>;
    'firebase-auth-error': CustomEvent<{
      error: string;
      fallbackToRedirect?: boolean;
      status?: number;
    }>;
    'firebase-auth-popup-ready': CustomEvent<{
      secure: boolean;
    }>;
    'firebase-auth-success': CustomEvent<{
      status: number;
    }>;
    'firebase-auth-security': CustomEvent<{
      secure: boolean;
    }>;
  }
}

export {};