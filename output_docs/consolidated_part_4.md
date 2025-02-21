# Consolidated Files (Part 4)

## src/store/index.ts

```
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
```

## src/store/slices/profileSlice.ts

```

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parent, Student } from '../../types/profiles';

interface ProfileState {
  parent: Parent | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  parent: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setParentProfile: (state, action: PayloadAction<Parent>) => {
      state.parent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        state.parent.students.push(action.payload);
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        const index = state.parent.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.parent.students[index] = action.payload;
        }
      }
    },
  },
});

export const { setParentProfile, addStudent, updateStudent } = profileSlice.actions;
export default profileSlice.reducer;
```

## src/server/routes/studentRoutes.js

```
const express = require('express');
const router = express.Router();

// ...existing code...

router.post('/students', async (req, res) => {
  try {
    const { name } = req.body;
    // Here you would typically create a new student in your database
    // This is a mock response
    const newStudent = {
      id: Date.now(),
      name,
      createdAt: new Date()
    };
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student profile: ${error.message}` });
  }
});

router.get('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically fetch the student from your database
    // This is a mock response
    const student = {
      id: student_id,
      name: 'John Doe',
      createdAt: new Date()
    };
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to get student profile: ${error.message}` });
  }
});

router.put('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { name } = req.body;
    // Here you would typically update the student in your database
    // This is a mock response
    const updatedStudent = {
      id: student_id,
      name,
      createdAt: new Date()
    };
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to update student profile: ${error.message}` });
  }
});

router.delete('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically delete the student from your database
    // This is a mock response
    res.status(200).json({ detail: `Student ${student_id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student profile: ${error.message}` });
  }
});

// ...existing code...

module.exports = router;

```

## src/services/websocket.ts

```
// File: /src/services/websocket.ts
// Description: Provides WebSocket connection management for Geaux Academy in development mode.
// Author: GitHub Copilot
// Created: 2023-10-24

const socket = new WebSocket("wss://localhost:3000");

socket.onopen = () => {
  console.log("WebSocket connection established");
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

export default socket;

```

## src/services/openai.js

```

import axios from 'axios';

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default openaiClient;
```

## src/services/firestore.ts

```
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/config";

export async function getData(collectionName: string, docId: string) {
  const docRef = doc(firestore, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setData(collectionName: string, docId: string, data: any) {
  const docRef = doc(firestore, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  return true;
}

// ...other helper functions as needed...

```

## src/services/auth-service.ts

```
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';

const auth = getAuth();

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error('Failed to sign in with Google');
  }
};
```

## src/services/cheshireService.ts

```
import axios, { AxiosInstance } from 'axios';
import { auth } from '../firebase/config';

// Use environment variable if set, otherwise fall back to the production URL
const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Add authentication interceptor
cheshireAxios.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
cheshireAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (CHESHIRE_DEBUG) {
      console.error('Cheshire API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to Cheshire API:', error);
      console.error('Please ensure the TIPI container is running and accessible at:', CHESHIRE_API_URL);
    }
    return Promise.reject(error);
  }
);

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireUser {
  username: string;
  permissions: {
    CONVERSATION: string[];
    MEMORY: string[];
    STATIC: string[];
    STATUS: string[];
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface CheshireError {
  message: string;
  code?: string;
  response?: {
    status: number;
    data: unknown;
  };
  config?: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}

export class CheshireService {
  private static async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static async getFirebaseToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  static async checkTipiHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await cheshireAxios.get('/');
      return {
        status: 'healthy',
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      const err = error as CheshireError;
      console.error('TIPI health check failed:', err);
      if (err.code === 'ERR_NETWORK') {
        throw new Error('TIPI container is not accessible. Please ensure it is running.');
      }
      throw err;
    }
  }

  static async initialize(): Promise<void> {
    try {
      // Check TIPI container health
      await this.checkTipiHealth();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      await cheshireAxios.get('/', { headers });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await cheshireAxios.post<CheshireResponse>(
        '/message',
        { text: message },
        { headers }
      );
      
      return {
        data: response.data.response,
        memories: response.data.memories
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.getErrorMessage(error);
    }
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const payload: CheshireUser = {
        username: email,
        permissions: {
          CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
          MEMORY: ["READ", "LIST"],
          STATIC: ["READ"],
          STATUS: ["READ"]
        }
      };

      await cheshireAxios.post('/users/', payload, { headers });
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw this.getErrorMessage(error);
    }
  }

  static getErrorMessage(error: CheshireError): string {
    if (error.message === 'Authentication required') {
      return "Please log in to continue.";
    }
    if (error.message === 'Failed to obtain Cheshire auth token') {
      return "Unable to connect to the chat service. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.code === 'ERR_NETWORK') {
      if (error.message.includes('CORS')) {
        return "Unable to connect to the chat service due to CORS restrictions. Please contact support.";
      }
      return "Network error - Unable to connect to the chat service. Please check your connection and try again.";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please try again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}

```

## src/services/profileService.ts

```
import { firestore } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Parent, Student, LearningStyle } from "../types/profiles";

// Cache for storing profiles
const profileCache = new Map();

// Helper to check online status
const isOnline = () => navigator.onLine;

// Helper to handle offline errors
const handleOfflineError = (operation: string) => {
  const error = new Error(`Cannot ${operation} while offline`);
  error.name = 'OfflineError';
  return error;
};

// ✅ Create Parent Profile
export const createParentProfile = async (parentData: Partial<Parent>): Promise<string> => {
  try {
    if (!parentData.uid) throw new Error('User ID is required');
    
    const parentRef = doc(firestore, 'parents', parentData.uid);
    await setDoc(parentRef, {
      ...parentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      students: []
    });
    
    console.log('✅ Parent profile created successfully:', parentData.uid);
    return parentData.uid;
  } catch (error) {
    console.error('❌ Error creating parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Parent Profile
export const getParentProfile = async (userId: string): Promise<Parent | null> => {
  try {
    console.log('🔍 Fetching parent profile for:', userId);

    // Check cache first
    if (profileCache.has(`parent_${userId}`)) {
      return profileCache.get(`parent_${userId}`);
    }

    const docRef = doc(firestore, 'parents', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const parentProfile: Parent = {
        uid: data.uid || userId,
        email: data.email || '',
        displayName: data.displayName || '',
        students: data.students || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      console.log('✅ Parent profile found:', parentProfile);
      // Cache the result
      profileCache.set(`parent_${userId}`, parentProfile);
      return parentProfile;
    }
    
    console.log('ℹ️ No parent profile found, creating one...');
    // If no profile exists, create one
    await createParentProfile({ uid: userId });
    return getParentProfile(userId); // Retry fetch after creation
    
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`parent_${userId}`) || null;
    }
    console.error('❌ Error fetching parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Student Profile
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  try {
    // Check cache first
    if (profileCache.has(`student_${studentId}`)) {
      return profileCache.get(`student_${studentId}`);
    }

    const studentRef = doc(firestore, "students", studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error("Student profile not found");
    }

    const studentData = studentDoc.data() as Student;
    // Cache the result
    profileCache.set(`student_${studentId}`, studentData);
    return studentData;
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`student_${studentId}`) || null;
    }
    throw error;
  }
};

// ✅ Add Student Profile
export const addStudentProfile = async (parentId: string, studentData: {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}) => {
  try {
    console.log('📝 Adding student profile for parent:', parentId);
    
    // Add the student to the students collection
    const studentRef = await addDoc(collection(firestore, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update the parent's students array
    const parentRef = doc(firestore, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);

    if (parentDoc.exists()) {
      const currentStudents = parentDoc.data().students || [];
      await updateDoc(parentRef, {
        students: [...currentStudents, studentRef.id],
        updatedAt: new Date().toISOString()
      });
    }

    console.log('✅ Student profile added successfully:', studentRef.id);
    return studentRef.id;
  } catch (error) {
    console.error('❌ Error adding student profile:', error);
    throw error;
  }
};

// ✅ Update Student's Assessment Status
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  if (!isOnline()) {
    throw handleOfflineError('update assessment status');
  }

  const studentRef = doc(firestore, "students", studentId);
  try {
    await updateDoc(studentRef, {
      hasTakenAssessment: status === 'completed',
      assessmentStatus: status,
      updatedAt: new Date().toISOString(),
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        hasTakenAssessment: status === 'completed',
        assessmentStatus: status,
        updatedAt: new Date().toISOString()
      });
    }
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating assessment status:", error);
    throw new Error("Failed to update assessment status");
  }
};

// ✅ Save Learning Style
export const saveLearningStyle = async (studentId: string, learningStyle: LearningStyle): Promise<void> => {
  if (!isOnline()) {
    throw handleOfflineError('save learning style');
  }

  try {
    console.log('📝 Saving learning style for student:', studentId);
    const studentRef = doc(firestore, 'students', studentId);
    
    await updateDoc(studentRef, {
      learningStyle,
      updatedAt: new Date().toISOString()
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        learningStyle,
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Learning style saved successfully');
  } catch (error) {
    console.error('❌ Error saving learning style:', error);
    throw error;
  }
};

// Listen for online/offline events to manage cache
window.addEventListener('online', () => {
  console.info('Back online. Syncing data...');
  // Could add sync logic here if needed
});

window.addEventListener('offline', () => {
  console.warn('Gone offline. Using cached data...');
});

export class ProfileService {
  async getUserProfile(userId: string): Promise<any> {
    // ...existing API call logic...
    // Example:
    const response = await fetch(`/api/profiles/${userId}`);
    return response.json();
  }
}

```

## src/services/api.js

```
import axios from 'axios';

import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://learn.geaux.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add request interceptor for auth headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Get a fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors and try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    // Handle other error cases
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message
    });

    // Enhanced error handling
    let errorMessage = "An error occurred. Please try again.";
    switch (error.response?.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;

```

## src/utils/animations.js

```
export const pageTransitions = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.2 }
  },
};

export const containerVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20 
  }
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};

```

## src/contexts/ProfileContext.tsx

```
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  learningStyle?: string;
  grade?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
```

## src/contexts/AuthContext.tsx

```
// File: /src/contexts/AuthContext.tsx
// Description: Context for authentication using Firebase
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../firebase/auth-service';

export interface AuthContextProps {
  currentUser: User | null;
  isAuthReady: boolean;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((firebaseUser: User | null) => {
      setCurrentUser(firebaseUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextProps = {
    currentUser,
    isAuthReady,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

```

## src/theme/theme.js

```
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // This will multiply the spacing by 4px (MUI's default spacing unit)
});

// Create styled-components theme with the same values
export const styledTheme = {
  palette: {
    ...muiTheme.palette,
  },
  breakpoints: {
    ...muiTheme.breakpoints.values,
  },
  spacing: (factor) => `${0.25 * factor}rem`, // Keep rem units for styled-components
};

```

## src/theme/index.tsx

```
// File: /src/theme/index.ts
// Description: Custom theme including breakpoint helpers

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  large: string;
  keys: (number | Breakpoint)[];
  up: (key: number | Breakpoint) => string;
  down: (key: number | Breakpoint) => string;
  between: (start: number | Breakpoint, end: number | Breakpoint) => string;
  only: (key: number | Breakpoint) => string;
}

export const breakpoints: CustomBreakpoints = {
  mobile: "0px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (key: number | Breakpoint) => {
    // implement using a strategy that works for both numbers and defined breakpoints
    // For simplicity, if key is number then convert to string with px otherwise use a mapping.
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  down: (key: number | Breakpoint) => {
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  between: (start: number | Breakpoint, end: number | Breakpoint) => {
    const getValue = (v: number | Breakpoint): number =>
      typeof v === "number" ? v : ({ xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[v]);
    return `${getValue(start)}px and ${getValue(end)}px`;
  },
  only: (key: number | Breakpoint) => {
    if (typeof key === "number") return `${key}px`;
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  }
};
```

## src/theme/theme.ts

```
// File: /src/theme/theme.ts
// Description: Unified theme configuration for MUI and styled-components
// Author: GitHub Copilot
// Created: 2024-02-12

import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

// Create the base MUI theme
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
      light: '#F9EBEA',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
      light: '#FEF9E7',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
      light: '#EBF5FB',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
      light: '#E8F8F5',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // Base spacing unit (4px)
});

// Create spacing utility that returns rem values
const createSpacing = () => {
  const spacingFn = (value: number): string => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  });
};

// Create the styled-components theme that extends MUI theme
export const styledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  spacing: createSpacing(),
  colors: {
    border: '#e0e0e0',
    text: muiTheme.palette.text.primary,
    background: {
      hover: '#f5f5f5',
    },
    error: {
      main: muiTheme.palette.error.main,
      light: muiTheme.palette.error.light,
    },
  },
  borderRadius: {
    default: '4px',
  },
};
```

## src/firebase/config.ts

```
// File: /src/firebase/config.ts
// Description: Firebase configuration and initialization for Geaux Academy
// Author: GitHub Copilot
// Created: 2023-10-24

import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  Auth,
  initializeAuth,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  PopupRedirectResolver,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { Analytics, getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getMessaging, Messaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Interface for initialization errors
interface InitializationError extends Error {
  service: string;
  code?: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Firebase configuration with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Service instances
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;
let storage: FirebaseStorage;
const provider = new GoogleAuthProvider();

// Check for secure context
const isSecureContext = window.isSecureContext;
if (!isSecureContext) {
  console.warn('Application is not running in a secure context. Some features will be disabled.');
}

// Maximum retries for initialization
const MAX_INIT_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

// Initialize Firebase services with retry mechanism
async function initializeFirebaseServices(retryCount = 0): Promise<void> {
  try {
    // Only initialize once
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);

      // Initialize Auth with persistence and popup (preferred method)
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver as PopupRedirectResolver
      });

      // Initialize Firestore with persistence and single tab manager
      firestore = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentSingleTabManager({
            forceOwnership: true
          }),
          cacheSizeBytes: CACHE_SIZE_UNLIMITED
        })
      });

      // Initialize Storage
      storage = getStorage(app);

      // Initialize Analytics if supported and in secure context
      if (isSecureContext) {
        const analyticsSupported = await isAnalyticsSupported();
        if (analyticsSupported) {
          analytics = getAnalytics(app);
        }
      }

      // Initialize Cloud Messaging if supported and in secure context
      if (isSecureContext) {
        const messagingSupported = await isMessagingSupported();
        if (messagingSupported) {
          messaging = getMessaging(app);
        }
      }
    } else {
      // Get existing instances if already initialized
      app = getApps()[0];
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
    }
  } catch (error) {
    const err = error as InitializationError;
    console.error('Firebase initialization error:', err);

    // Retry initialization if under max attempts
    if (retryCount < MAX_INIT_RETRIES) {
      console.log(`Retrying Firebase initialization (${retryCount + 1}/${MAX_INIT_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      return initializeFirebaseServices(retryCount + 1);
    }

    throw new Error(`Failed to initialize Firebase services after ${MAX_INIT_RETRIES} attempts: ${err.message}`);
  }
}

// Initialize services immediately
initializeFirebaseServices().catch(error => {
  console.error('Critical: Failed to initialize Firebase:', error);
});

export {
  app,
  auth,
  firestore,
  analytics,
  messaging,
  storage,
  firebaseConfig,
  initializeFirebaseServices,
  provider,
  type FirebaseApp,
  type Auth,
  type Firestore,
  type Analytics,
  type Messaging,
  type FirebaseStorage,
  type InitializationError
};

```

## src/firebase/auth-service-worker.ts

```
// File: /src/firebase/auth-service-worker.ts
// Description: Service worker initialization with enhanced security
// Author: GitHub Copilot
// Created: 2024-02-12

import { enableIndexedDbPersistence, type FirestoreSettings } from 'firebase/firestore';
import { firestore } from './config';

interface ServiceWorkerError extends Error {
  name: string;
  code?: string;
}

interface AuthServiceWorkerMessage {
  type: string;
  status?: number;
  ok?: boolean;
  fallbackToRedirect?: boolean;
  error?: string;
  secure?: boolean;
}

interface ServiceWorkerRegistrationResult {
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}

const SW_TIMEOUT = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || 10000;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

const isSecureContext = (): boolean => {
  return window.isSecureContext && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let retryCount = 0;

const registerWithRetry = async (): Promise<ServiceWorkerRegistration> => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth',
      type: 'module',
      updateViaCache: 'none'
    });
    return registration;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return registerWithRetry();
    }
    throw error;
  }
};

export const registerAuthServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: false,
      error: 'Service workers are not supported in this browser'
    };
  }

  if (!isSecureContext()) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: true,
      error: 'Secure context required for authentication'
    };
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));

    serviceWorkerRegistration = await registerWithRetry();

    const activationPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout'));
      }, SW_TIMEOUT);

      if (serviceWorkerRegistration?.active) {
        clearTimeout(timeout);
        resolve();
        return;
      }

      serviceWorkerRegistration?.addEventListener('activate', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    await activationPromise;

    return {
      success: true,
      isSecure: isSecureContext(),
      supportsServiceWorker: true
    };

  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: true,
      error: error instanceof Error ? error.message : 'Service worker registration failed'
    };
  }
};

export const initAuthServiceWorker = async (): Promise<boolean> => {
  const result = await registerAuthServiceWorker();
  
  window.dispatchEvent(new CustomEvent('firebase-auth-worker-status', { 
    detail: result 
  }));

  if (!result.success) {
    console.warn('Auth service worker initialization failed:', result.error);
    return false;
  }

  // Initialize Firestore persistence after successful service worker registration
  try {
    const settings: FirestoreSettings = {
      cacheSizeBytes: 50000000, // 50 MB
    };
    
    await enableIndexedDbPersistence(db);
    
    return true;
  } catch (error) {
    console.error('Failed to enable persistence:', error);
    return false;
  }
};

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error, secure } = event.data;

  const dispatch = (eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      dispatch('firebase-auth-worker-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      dispatch('firebase-auth-popup-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect && import.meta.env.VITE_AUTH_POPUP_FALLBACK === 'true') {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      dispatch('firebase-auth-error', { error, fallbackToRedirect });
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        dispatch('firebase-auth-error', { status, error });
      } else {
        dispatch('firebase-auth-success', { status });
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
        dispatch('firebase-auth-security', { secure: false });
      }
      break;
  }
}

navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

export default initAuthServiceWorker;
```

## src/firebase/messaging-utils.ts

```
// File: /src/firebase/messaging-utils.ts
// Description: Firebase messaging utilities with proper TypeScript support and error handling
// Author: GitHub Copilot
// Created: 2024-02-17

import { getToken, getMessaging } from 'firebase/messaging';
import { app } from './config';

const VAPID_KEY = 'YOUR_VAPID_KEY_HERE'; // TODO: Replace with actual VAPID key

export interface ServiceWorkerRegistrationResult {
  success: boolean;
  token?: string;
  error?: string;
}

export async function registerMessagingWorker(): Promise<ServiceWorkerRegistrationResult> {
  if (!window.isSecureContext) {
    return {
      success: false,
      error: 'Service Worker registration requires a secure context (HTTPS or localhost)'
    };
  }

  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      error: 'Service Worker is not supported in this browser'
    };
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
      type: 'module'
    });

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      return {
        success: false,
        error: 'Failed to get messaging token'
      };
    }

    return {
      success: true,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register service worker'
    };
  }
}

export async function unregisterMessagingWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
}
```

## src/firebase/firebase-messaging-sw.ts

```
// File: /src/firebase/firebase-messaging-sw.ts
// Description: Firebase service worker configuration for handling background messages and notifications
// Author: GitHub Copilot
// Created: 2024-02-17

/// <reference lib="webworker" />

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage, MessagePayload } from 'firebase/messaging/sw';
import { firebaseConfig } from './config';

declare const self: ServiceWorkerGlobalScope;

// Initialize Firebase in the service worker
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload: MessagePayload) => {
  console.log('[Firebase Messaging SW] Received background message:', payload);

  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions: NotificationOptions = {
    body: payload.notification?.body,
    icon: '/images/logo.svg',
    badge: '/images/logo.svg',
    tag: payload.collapseKey || 'default',
    data: payload.data,
    requireInteraction: true,
    silent: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Add custom click handling here
  const clickAction = event.notification.data?.clickAction || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // If a window client is already open, focus it
        for (const client of windowClients) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(clickAction);
        }
      })
  );
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all pages immediately
      self.clients.claim(),
      // Optional: Clean up old caches here if needed
    ])
  );
});
```

## src/firebase/auth-service.ts

```
// File: /src/firebase/auth-service.ts
// Description: Provides Google authentication functionality for Geaux Academy
// Author: GitHub Copilot
// Created: 2023-10-24

import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, Auth, User } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;
  private popupOpen: boolean = false;
  private _auth: Auth;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
      scope: 'email profile'
    });
    this._auth = auth;
  }

  get auth(): Auth {
    return this._auth;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = this._auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  private async refreshUserToken(user: User): Promise<string> {
    try {
      const token = await user.getIdToken(true);
      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.message || 'Failed to refresh authentication token');
    }
  }

  async signInWithGoogle() {
    try {
      if (this.popupOpen) {
        throw new Error('Authentication popup is already open');
      }

      await this.ensureInitialized();
      this.popupOpen = true;

      const result = await signInWithPopup(this._auth, this.provider);
      const token = await this.refreshUserToken(result.user);
      
      // Store token in a secure way
      if (window.isSecureContext) {
        sessionStorage.setItem('authToken', token);
      }
      
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site');
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      this.popupOpen = false;
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      if (window.isSecureContext) {
        sessionStorage.removeItem('authToken');
      }
      await firebaseSignOut(this._auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      await this.ensureInitialized();
      const currentUser = this._auth.currentUser;
      
      if (!currentUser) {
        return null;
      }

      const token = await this.refreshUserToken(currentUser);
      
      if (window.isSecureContext) {
        sessionStorage.setItem('authToken', token);
      }
      
      return token;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.message || 'Failed to refresh authentication token');
    }
  }

  getCurrentToken(): string | null {
    if (!window.isSecureContext) {
      return null;
    }
    return sessionStorage.getItem('authToken');
  }
}

```

## src/types/student.ts

```
export interface Student {
  id: string;
  name: string;
  grade?: string;
  age?: number;
  learningStyle?: string;
  hasTakenAssessment: boolean;
  progress?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
  }>;
  recommendedActivities?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentId: string;
}
```

## src/types/userTypes.ts

```

export interface BaseProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile extends BaseProfile {
  role: 'parent';
  phone?: string;
  students: StudentProfile[];
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  parentId: string;
  grade: string;
  dateOfBirth: Date;
}
```

## src/types/css.d.ts

```
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
```

## src/types/firebase.d.ts

```
// File: /src/types/firebase.d.ts
// Description: Type declarations for Firebase modules
// Author: GitHub Copilot
// Created: 2024-02-12

declare module 'firebase/app' {
  export * from '@firebase/app';
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
}

declare module 'firebase/analytics' {
  export * from '@firebase/analytics';
}

declare module 'firebase/messaging' {
  export * from '@firebase/messaging';
}
```

