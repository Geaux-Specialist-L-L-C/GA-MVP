import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Parent, Student, LearningStyle } from "../types/profiles";
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Cache for storing profiles
const profileCache = new Map();

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});

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
    
    const parentRef = doc(db, 'parents', parentData.uid);
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

    const docRef = doc(db, 'parents', userId);
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

    const studentRef = doc(db, "students", studentId);
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
    const studentRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update the parent's students array
    const parentRef = doc(db, 'parents', parentId);
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

  const studentRef = doc(db, "students", studentId);
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
    const studentRef = doc(db, 'students', studentId);
    
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

export default {
  getParentProfile,
  getStudentProfile,
  addStudentProfile,
  updateStudentAssessmentStatus,
};
