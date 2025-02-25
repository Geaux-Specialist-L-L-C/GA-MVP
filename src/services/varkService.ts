import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface AssessmentResponse {
  assessmentId: string;
  initialMessage: string;
}

interface VARKResults {
  visual: number;
  auditory: number;
  readWrite: number;
  kinesthetic: number;
  primaryStyle: string;
}

interface UserResponse {
  message: string;
  nextQuestionIndex: number;
  currentQuestion: string;
  isComplete: boolean;
  results?: VARKResults;
}

export const startAssessment = async (userId: string): Promise<AssessmentResponse> => {
  const response = await fetch('/api/vark/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to start assessment');
  }
  
  return response.json();
};

export const sendUserResponse = async ({
  userId,
  assessmentId,
  message,
  questionIndex,
}: {
  userId: string;
  assessmentId: string;
  message: string;
  questionIndex: number;
}): Promise<UserResponse> => {
  const response = await fetch('/api/vark/respond', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      assessmentId,
      message,
      questionIndex,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to process response');
  }
  
  return response.json();
};

export const saveAssessmentResults = async (
  userId: string, 
  results: VARKResults
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const resultsRef = doc(db, 'varkResults', userId);
    
    // Update user document with primary learning style
    await updateDoc(userRef, {
      primaryLearningStyle: results.primaryStyle,
      updatedAt: serverTimestamp()
    });
    
    // Save detailed results
    await setDoc(resultsRef, {
      ...results,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving results:', error);
    throw error;
  }
};