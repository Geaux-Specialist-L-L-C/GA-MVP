import { db } from '../config/firebase';
import { collection, doc, setDoc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';
import { ParentProfile, StudentProfile } from '../types/userTypes';
import { Parent, Student } from '../types/profiles';

// Fetch Parent Profile
export const getParentProfile = async (parentId: string): Promise<Parent> => { // <-- Added return type
  const parentRef = doc(db, 'parents', parentId);
  const parentDoc = await getDoc(parentRef);
  if (!parentDoc.exists()) {
    throw new Error('Parent profile not found');
  }
  return parentDoc.data() as Parent;
};

// Add Student to Parent Profile
export const addStudentToParent = async (parentId: string, studentData: Partial<StudentProfile>) => {
  const studentRef = doc(db, 'students', studentData.uid!);
  const parentRef = doc(db, 'parents', parentId);

  await setDoc(studentRef, {
    ...studentData,
    role: 'student',
    parentId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await runTransaction(db, async (transaction) => {
    const parentDoc = await transaction.get(parentRef);
    if (!parentDoc.exists()) throw new Error('Parent not found');

    const parentData = parentDoc.data() as Parent;
    const updatedStudents = [...(parentData.students || []), studentData.uid];

    transaction.update(parentRef, { students: updatedStudents });
  });
};

// Update Student Progress (with Transactions)
export const updateStudentProgress = async (parentId: string, studentId: string, progress: any) => {
  const parentRef = doc(db, 'parents', parentId);

  await runTransaction(db, async (transaction) => {
    const parentDoc = await transaction.get(parentRef);
    if (!parentDoc.exists()) throw new Error('Parent not found');

    const parentData = parentDoc.data() as Parent;
    const studentIndex = parentData.students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) throw new Error('Student not found');

    parentData.students[studentIndex].progress = progress;
    transaction.update(parentRef, { students: parentData.students });
  });
};

// Updated getStudentProfile function to throw an error if not found
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  const studentRef = doc(db, 'students', studentId);
  const studentDoc = await getDoc(studentRef);

  if (!studentDoc.exists()) {
    throw new Error('Student profile not found');
  }

  return studentDoc.data() as Student;
};

// ✅ Add updateStudentAssessmentStatus function (Fixes your error)
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  const studentRef = doc(db, 'students', studentId);
  try {
    await updateDoc(studentRef, {
      assessmentStatus: status,
      updatedAt: new Date(),
    });
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error('Error updating assessment status:', error);
    throw new Error('Failed to update assessment status');
  }
};

export const profileService = {
  getParentProfile,
  addStudentToParent,
  updateStudentProgress,
  getStudentProfile,
  updateStudentAssessmentStatus,
};

export default profileService;
