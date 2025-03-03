// File: /src/services/learningStyleService.ts
// Description: Service for storing and retrieving learning style assessment results
// Author: evopimp
// Created: 2025-03-03 06:08:46

import { db } from "@/firebase/config";
import { collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { LearningStyleResult } from "@/types/chat";

/**
 * Save a learning style assessment result to Firestore
 */
export const saveAssessmentResult = async (userId: string, result: LearningStyleResult): Promise<void> => {
  try {
    const userRef = doc(collection(db, "users"), userId);
    const assessmentRef = doc(collection(userRef, "assessments"));
    
    await setDoc(assessmentRef, {
      ...result,
      createdAt: serverTimestamp(),
      isActive: true
    });
    
    // Also update the user's document with their latest learning style
    await setDoc(userRef, {
      learningStyle: result.primaryStyle,
      learningStyleScores: result.scores,
      lastAssessmentDate: serverTimestamp()
    }, { merge: true });
    
    return;
  } catch (error) {
    console.error("Error saving assessment result:", error);
    throw new Error("Failed to save assessment result");
  }
};

/**
 * Retrieve the latest learning style assessment result for a user
 */
export const getLatestAssessmentResult = async (userId: string): Promise<LearningStyleResult | null> => {
  try {
    const userRef = doc(collection(db, "users"), userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    
    // If the user doesn't have a learning style yet, return null
    if (!userData.learningStyle) {
      return null;
    }
    
    return {
      primaryStyle: userData.learningStyle,
      scores: userData.learningStyleScores || {
        visual: 0,
        auditory: 0,
        reading: 0,
        kinesthetic: 0
      },
      recommendations: userData.learningStyleRecommendations || []
    };
  } catch (error) {
    console.error("Error retrieving assessment result:", error);
    throw new Error("Failed to retrieve assessment result");
  }
};