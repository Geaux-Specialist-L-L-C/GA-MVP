import { db } from "../config/firebase";
import { collection, doc, setDoc, updateDoc, getDoc, runTransaction } from "firebase/firestore";
import { Parent, Student } from "../types/profiles";

// ✅ Fetch Parent Profile
export const getParentProfile = async (parentId: string): Promise<Parent> => {
  const parentRef = doc(db, "parents", parentId);
  const parentDoc = await getDoc(parentRef);
  if (!parentDoc.exists()) {
    throw new Error("Parent profile not found");
  }
  return parentDoc.data() as Parent;
};

// ✅ Fetch Student Profile
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  const studentRef = doc(db, "students", studentId);
  const studentDoc = await getDoc(studentRef);

  if (!studentDoc.exists()) {
    throw new Error("Student profile not found");
  }

  return studentDoc.data() as Student;
};

// ✅ Update Student's Assessment Status
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  const studentRef = doc(db, "students", studentId);
  try {
    await updateDoc(studentRef, {
      assessmentStatus: status,
      updatedAt: new Date(),
    });
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating assessment status:", error);
    throw new Error("Failed to update assessment status");
  }
};

export default {
  getParentProfile,
  getStudentProfile,
  updateStudentAssessmentStatus,
};
