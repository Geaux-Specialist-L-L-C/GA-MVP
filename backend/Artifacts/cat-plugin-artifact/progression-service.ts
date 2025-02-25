// File: src/services/competencyProgression.ts
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { cheshireService } from './cheshireService';

interface CompetencyLevel {
  subject: string;
  topic: string;
  level: number;  // 0-100
  timestamp: Date;
  assessmentCount: number;
  lastReview: Date;
  nextReview: Date;
}

interface PrerequisiteMap {
  [key: string]: string[];  // topic -> prerequisites
}

export class CompetencyProgressionService {
  private readonly MASTERY_THRESHOLD = 85;
  private readonly REVIEW_INTERVALS = [
    1,    // 1 day for initial review
    3,    // 3 days for second review
    7,    // 1 week
    14,   // 2 weeks
    30,   // 1 month
    90    // 3 months for mastered topics
  ];

  /**
   * Records a new competency assessment result
   */
  async recordAssessment(
    userId: string,
    subject: string,
    topic: string,
    score: number
  ): Promise<void> {
    try {
      // Get current competency level
      const currentLevel = await this.getCompetencyLevel(userId, subject, topic);
      
      // Calculate new level using weighted average
      const newLevel = currentLevel ? 
        (currentLevel.level * 0.7 + score * 0.3) : 
        score;

      const competency: CompetencyLevel = {
        subject,
        topic,
        level: newLevel,
        timestamp: new Date(),
        assessmentCount: (currentLevel?.assessmentCount || 0) + 1,
        lastReview: new Date(),
        nextReview: this.calculateNextReview(newLevel, currentLevel?.assessmentCount || 0)
      };

      // Store in Firebase
      await setDoc(
        doc(db, 'competency_levels', `${userId}_${subject}_${topic}`),
        competency
      );

      // Check for mastery and unlock prerequisites
      if (newLevel >= this.MASTERY_THRESHOLD) {
        await this.handleMasteryAchieved(userId, subject, topic);
      }

      // Schedule next review
      await this.scheduleReview(userId, subject, topic, competency.nextReview);
    } catch (error) {
      console.error('Failed to record assessment:', error);
      throw error;
    }
  }

  /**
   * Retrieves current competency level for a topic
   */
  private async getCompetencyLevel(
    userId: string,
    subject: string,
    topic: string
  ): Promise<CompetencyLevel | null> {
    const docRef = doc(db, 'competency_levels', `${userId}_${subject}_${topic}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as CompetencyLevel : null;
  }

  /**
   * Calculates next review date based on spaced repetition
   */
  private calculateNextReview(
    level: number,
    assessmentCount: number
  ): Date {
    const intervalIndex = Math.min(
      assessmentCount,
      this.REVIEW_INTERVALS.length - 1
    );
    
    // Higher competency = longer intervals
    const intervalMultiplier = level >= this.MASTERY_THRESHOLD ? 1.5 : 1;
    const daysToAdd = this.REVIEW_INTERVALS[intervalIndex] * intervalMultiplier;
    
    return new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
  }

  /**
   * Handles mastery achievement and unlocks prerequisites
   */
  private async handleMasteryAchieved(
    userId: string,
    subject: string,
    topic: string
  ): Promise<void> {
    // Get prerequisites map
    const prerequisitesRef = doc(db, 'prerequisites', subject);
    const prerequisitesSnap = await getDoc(prerequisitesRef);
    const prerequisites = prerequisitesSnap.data() as PrerequisiteMap;

    // Find topics that this mastery unlocks
    const unlockedTopics = Object.entries(prerequisites)
      .filter(([_, prereqs]) => prereqs.includes(topic))
      .map(([topic]) => topic);

    // Update unlocked topics in user's profile
    const userProgressRef = doc(db, 'user_progress', userId);
    await setDoc(userProgressRef, {
      unlockedTopics: unlockedTopics,
      updatedAt: Timestamp.now()
    }, { merge: true });

    // Store mastery achievement in Cheshire Cat memory
    await cheshireService.post('/memory/collections/achievements/points', {
      content: `Mastered ${topic} in ${subject}`,
      metadata: {
        userId,
        subject,
        topic,
        type: 'mastery',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Schedules a review using White Rabbit
   */
  private async scheduleReview(
    userId: string,
    subject: string,
    topic: string,
    reviewDate: Date
  ): Promise<void> {
    await cheshireService.post('/white_rabbit/schedule', {
      timestamp: reviewDate.toISOString(),
      task: {
        type: 'review',
        data: {
          userId,
          subject,
          topic
        }
      }
    });
  }

  /**
   * Gets topics ready for review
   */
  async getReviewDueTopics(userId: string): Promise<CompetencyLevel[]> {
    const now = new Date();
    
    const competencyQuery = query(
      collection(db, 'competency_levels'),
      where('userId', '==', userId),
      where('nextReview', '<=', now),
      orderBy('nextReview'),
      limit(5)
    );

    const querySnapshot = await getDocs(competencyQuery);
    return querySnapshot.docs.map(doc => doc.data() as CompetencyLevel);
  }

  /**
   * Gets learning path recommendations
   */
  async getRecommendedPath(
    userId: string,
    subject: string
  ): Promise<string[]> {
    // Get current competency levels
    const competencyQuery = query(
      collection(db, 'competency_levels'),
      where('userId', '==', userId),
      where('subject', '==', subject)
    );

    const competencies = (await getDocs(competencyQuery))
      .docs.map(doc => doc.data() as CompetencyLevel);

    // Get prerequisites map
    const prerequisitesRef = doc(db, 'prerequisites', subject);
    const prerequisites = (await getDoc(prerequisitesRef))
      .data() as PrerequisiteMap;

    // Find available topics based on prerequisites
    const availableTopics = this.calculateAvailableTopics(
      competencies,
      prerequisites
    );

    return this.prioritizeTopics(availableTopics, competencies);
  }

  /**
   * Calculates which topics are available based on prerequisites
   */
  private calculateAvailableTopics(
    competencies: CompetencyLevel[],
    prerequisites: PrerequisiteMap
  ): string[] {
    const masteredTopics = new Set(
      competencies
        .filter(c => c.level >= this.MASTERY_THRESHOLD)
        .map(c => c.topic)
    );

    return Object.entries(prerequisites)
      .filter(([topic, prereqs]) => 
        !masteredTopics.has(topic) && // Not already mastered
        prereqs.every(p => masteredTopics.has(p)) // All prerequisites met
      )
      .map(([topic]) => topic);
  }

  /**
   * Prioritizes topics based on competency levels and dependencies
   */
  private prioritizeTopics(
    availableTopics: string[],
    competencies: CompetencyLevel[]
  ): string[] {
    return availableTopics.sort((a, b) => {
      const aLevel = competencies.find(c => c.topic === a)?.level || 0;
      const bLevel = competencies.find(c => c.topic === b)?.level || 0;
      return bLevel - aLevel; // Prioritize topics with higher current competency
    });
  }
}

export const competencyProgression = new CompetencyProgressionService();