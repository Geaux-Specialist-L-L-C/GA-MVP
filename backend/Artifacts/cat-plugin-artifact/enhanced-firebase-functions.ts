// File: functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { cheshireService } from "./services/cheshire";
import { CrewOrchestrator } from "./services/crewOrchestrator";
import { db } from "./services/firebase";
import * as admin from 'firebase-admin';

// Initialize CrewAI orchestrator
const crewOrchestrator = new CrewOrchestrator();

// Interfaces for type safety
interface LearningInteraction {
  type: 'query' | 'response' | 'feedback';
  content: string;
  timestamp: string;
  duration: number;
  metadata: {
    complexity?: number;
    accuracy?: number;
    confidence?: number;
  };
}

interface LearningProfile {
  userId: string;
  primaryStyle: string;
  secondaryStyle?: string;
  confidence: number;
  lastUpdated: string;
  interactionHistory: LearningInteraction[];
  styleEvolution: {
    timestamp: string;
    style: string;
    confidence: number;
  }[];
}

interface CurriculumMetadata {
  grade: number;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  standards?: string[];
  adaptations?: {
    style: string;
    modifications: string[];
  };
}

/**
 * Analyzes learning style using CrewAI agents and pattern recognition
 */
export const analyzeLearningStyle = onCall({ maxInstances: 10 }, async (request) => {
  // Validate authentication
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'Authentication required for learning style analysis'
    );
  }

  try {
    const userId = request.auth.uid;
    
    // Get user's learning profile
    const profileRef = db.collection('learning_profiles').doc(userId);
    const profileDoc = await profileRef.get();
    const profile = profileDoc.data() as LearningProfile;

    // Fetch recent interactions
    const interactions = await fetchRecentInteractions(userId);

    // Initialize CrewAI agents for analysis
    await crewOrchestrator.initializeAnalysisAgents({
      historicalProfile: profile,
      recentInteractions: interactions
    });

    // Perform multi-agent analysis
    const analysisResult = await crewOrchestrator.runAnalysisWorkflow({
      taskType: 'style_detection',
      userId,
      confidence_threshold: 0.75
    });

    // Update learning profile with new insights
    await updateLearningProfile(userId, analysisResult);

    // Store analysis in Cheshire Cat memory
    await storeAnalysisResults(userId, analysisResult);

    return {
      success: true,
      style: analysisResult.primaryStyle,
      confidence: analysisResult.confidence,
      recommendations: analysisResult.recommendations
    };

  } catch (error) {
    logger.error('Learning style analysis failed:', error);
    throw new HttpsError(
      'internal',
      'Failed to analyze learning style',
      error
    );
  }
});

/**
 * Generates personalized curriculum using learning style insights
 */
export const generateCurriculum = onCall({ maxInstances: 5 }, async (request) => {
  // Validate authentication
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'Authentication required for curriculum generation'
    );
  }

  try {
    const userId = request.auth.uid;
    const metadata: CurriculumMetadata = request.data;

    // Validate metadata
    validateCurriculumMetadata(metadata);

    // Get user's learning profile
    const profile = await getLearningProfile(userId);

    // Initialize curriculum generation agents
    await crewOrchestrator.initializeCurriculumAgents({
      learningProfile: profile,
      curriculumMetadata: metadata
    });

    // Generate base curriculum
    const baseCurriculum = await crewOrchestrator.generateBaseCurriculum(metadata);

    // Adapt curriculum for learning style
    const adaptedCurriculum = await crewOrchestrator.adaptCurriculum({
      curriculum: baseCurriculum,
      learningStyle: profile.primaryStyle,
      confidence: profile.confidence
    });

    // Store in Cheshire Cat memory
    await storeCurriculumInMemory(userId, adaptedCurriculum);

    // Store in Firestore
    await storeCurriculumInFirestore(userId, adaptedCurriculum);

    return {
      success: true,
      curriculum: adaptedCurriculum
    };

  } catch (error) {
    logger.error('Curriculum generation failed:', error);
    throw new HttpsError(
      'internal',
      'Failed to generate curriculum',
      error
    );
  }
});

/**
 * Monitors and processes learning interactions
 */
export const processLearningInteraction = onDocumentWritten(
  'users/{userId}/interactions/{interactionId}',
  async (event) => {
    const userId = event.params.userId;
    const interaction = event.data?.after.data() as LearningInteraction;

    try {
      // Initialize processing agents
      await crewOrchestrator.initializeProcessingAgents({
        userId,
        interactionType: interaction.type
      });

      // Process interaction
      const processingResult = await crewOrchestrator.processInteraction({
        interaction,
        historicalContext: await fetchInteractionContext(userId)
      });

      // Update learning metrics
      await updateLearningMetrics(userId, processingResult);

      // Check for style reassessment trigger
      if (processingResult.requiresReassessment) {
        await triggerStyleReassessment(userId, processingResult.evidence);
      }

      // Store processed interaction
      await storeProcessedInteraction(userId, {
        ...interaction,
        analysis: processingResult
      });

    } catch (error) {
      logger.error('Failed to process learning interaction:', error);
    }
  }
);

// Helper functions
async function fetchRecentInteractions(
  userId: string,
  limit: number = 50
): Promise<LearningInteraction[]> {
  const interactionsRef = db.collection(`users/${userId}/interactions`);
  const snapshot = await interactionsRef
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => doc.data() as LearningInteraction);
}

async function updateLearningProfile(
  userId: string,
  analysisResult: any
): Promise<void> {
  const profileRef = db.collection('learning_profiles').doc(userId);
  
  await profileRef.set({
    primaryStyle: analysisResult.primaryStyle,
    confidence: analysisResult.confidence,
    lastUpdated: admin.firestore.Timestamp.now(),
    styleEvolution: admin.firestore.FieldValue.arrayUnion({
      timestamp: new Date().toISOString(),
      style: analysisResult.primaryStyle,
      confidence: analysisResult.confidence
    })
  }, { merge: true });
}

async function storeAnalysisResults(
  userId: string,
  results: any
): Promise<void> {
  await cheshireService.storeDeclarativeMemory(
    JSON.stringify(results),
    {
      userId,
      type: 'learning_style_analysis',
      timestamp: new Date().toISOString()
    }
  );
}

function validateCurriculumMetadata(
  metadata: CurriculumMetadata
): void {
  const errors: string[] = [];

  if (metadata.grade < 1 || metadata.grade > 12) {
    errors.push('Invalid grade level');
  }

  if (!metadata.subject?.trim()) {
    errors.push('Subject is required');
  }

  if (!['beginner', 'intermediate', 'advanced'].includes(metadata.level)) {
    errors.push('Invalid difficulty level');
  }

  if (errors.length > 0) {
    throw new HttpsError('invalid-argument', errors.join(', '));
  }
}