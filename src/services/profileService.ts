import { db } from '../config/firebase';
import { collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { ParentProfile, StudentProfile } from '../types/userTypes';
import { Parent, Student } from '../types/profiles';

export const createParentProfile = async (parentData: Partial<ParentProfile>) => {
  const profileRef = doc(db, 'parents', parentData.uid!);
  await setDoc(profileRef, {
    ...parentData,
    role: 'parent',
    students: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const addStudentToParent = async (
  parentId: string, 
  studentData: Partial<StudentProfile>
) => {
  const studentRef = doc(db, 'students', studentData.uid!);
  const parentRef = doc(db, 'parents', parentId);

  await setDoc(studentRef, {
    ...studentData,
    role: 'student',
    parentId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const parentDoc = await getDoc(parentRef);
  const parentData = parentDoc.data();
  
  await updateDoc(parentRef, {
    students: [...(parentData?.students || []), studentData.uid]
  });
};

export const profileService = {
  async createStudent(parentId: string, student: Student) {
    const parentRef = doc(db, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);
    
    if (parentDoc.exists()) {
      const parent = parentDoc.data() as Parent;
      const updatedStudents = [...parent.students, student];
      await updateDoc(parentRef, { students: updatedStudents });
      return student;
    }
    throw new Error('Parent not found');
  },

  async updateStudentProgress(parentId: string, studentId: string, progress: any) {
    const parentRef = doc(db, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);
    
    if (parentDoc exists()) {
      const parent = parentDoc.data() as Parent;
      const studentIndex = parent.students.findIndex(s => s.id === studentId);
      if (studentIndex !== -1) {
        parent.students[studentIndex].progress = progress;
        await updateDoc(parentRef, { students: parent.students });
      }
    }
  }
};