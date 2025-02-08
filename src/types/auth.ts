// Common types for auth context and components
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<{ user: User } | void>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
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
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthRouteProps {
  children: React.ReactNode;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}