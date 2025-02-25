// File: src/services/interactionAnalysis.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { cheshireService } from './cheshireService';

interface InteractionMetrics {
  responseLatency: number;
  queryComplexity: number;
  feedbackIterations: number;
  timestamp: Date;
}

interface LearningStylePrediction {
  style: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  confidence: number;
  evidence: InteractionMetrics[];
}

export class InteractionAnalyzer {
  private static readonly COMPLEXITY_PATTERNS = {
    basicQuery: /^[^,.!?]+[.!?]$/,
    multipartQuery: /^[^,.!?]+(,[^,.!?]+)*[.!?]$/,
    complexQuery: /\b(why|how|explain|compare|analyze|evaluate)\b/i
  };

  /**
   * Captures and analyzes a single interaction
   */
  async captureInteraction(
    userId: string,
    query: string,
    startTime: number,
    metrics: Partial<InteractionMetrics>
  ): Promise<void> {
    const endTime = Date.now();
    const latency = endTime - startTime;

    const interactionData = {
      userId,
      query,
      metrics: {
        responseLatency: latency,
        queryComplexity: this.calculateQueryComplexity(query),
        feedbackIterations: metrics.feedbackIterations || 0,
        timestamp: new Date()
      }
    };

    // Store in Firebase
    await addDoc(collection(db, 'interaction_metrics'), interactionData);

    // Store vector embedding in Cheshire Cat memory
    await cheshireService.post('/memory/collections/interactions/points', {
      content: query,
      metadata: {
        ...interactionData.metrics,
        userId
      }
    });
  }

  /**
   * Predicts learning style based on recent interactions
   */
  async predictLearningStyle(userId: string): Promise<LearningStylePrediction> {
    // Get recent interactions from Firebase
    const metricsRef = collection(db, 'interaction_metrics');
    const recentMetrics = query(
      metricsRef,
      where('userId', '==', userId),
      where('metrics.timestamp', '>=', 
        Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      )
    );

    const metricsSnapshot = await getDocs(recentMetrics);
    const metrics = metricsSnapshot.docs.map(doc => ({
      ...doc.data().metrics
    }));

    // Get vector analysis from Cheshire Cat
    const vectorAnalysis = await cheshireService.post('/memory/recall', {
      metadata: { userId },
      k: 50
    });

    return this.analyzeLearningPatterns(metrics, vectorAnalysis.data);
  }

  /**
   * Calculates query complexity using linguistic patterns
   */
  private calculateQueryComplexity(query: string): number {
    if (this.COMPLEXITY_PATTERNS.complexQuery.test(query)) {
      return 3; // Complex analytical query
    } else if (this.COMPLEXITY_PATTERNS.multipartQuery.test(query)) {
      return 2; // Multi-part query
    }
    return 1; // Basic query
  }

  /**
   * Analyzes patterns to determine learning style
   */
  private analyzeLearningPatterns(
    metrics: InteractionMetrics[],
    vectorAnalysis: any[]
  ): LearningStylePrediction {
    const patterns = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0
    };

    // Analyze response latency patterns
    const avgLatency = metrics.reduce((sum, m) => sum + m.responseLatency, 0) / metrics.length;
    if (avgLatency < 1000) {
      patterns.visual += 1; // Quick visual processing
    } else {
      patterns.reading += 1; // Reflective reading
    }

    // Analyze query complexity
    const complexQueries = metrics.filter(m => m.queryComplexity === 3).length;
    if (complexQueries > metrics.length * 0.6) {
      patterns.reading += 1; // Analytical reading preference
    }

    // Analyze feedback patterns
    const highFeedback = metrics.filter(m => m.feedbackIterations > 2).length;
    if (highFeedback > metrics.length * 0.4) {
      patterns.kinesthetic += 1; // Hands-on learning preference
    }

    // Find dominant style
    const dominantStyle = Object.entries(patterns)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as LearningStylePrediction['style'];

    // Calculate confidence
    const totalPoints = Object.values(patterns).reduce((a, b) => a + b, 0);
    const confidence = patterns[dominantStyle] / totalPoints;

    return {
      style: dominantStyle,
      confidence,
      evidence: metrics
    };
  }

  /**
   * Updates content presentation based on learning style
   */
  async adaptContent(
    content: string,
    learningStyle: LearningStylePrediction['style']
  ): Promise<string> {
    const adaptationStrategies = {
      visual: this.addVisualElements,
      auditory: this.addAuditoryElements,
      reading: this.addTextualElements,
      kinesthetic: this.addInteractiveElements
    };

    return adaptationStrategies[learningStyle](content);
  }

  private addVisualElements(content: string): string {
    // Add diagrams, charts, mind maps
    return content;
  }

  private addAuditoryElements(content: string): string {
    // Add verbal explanations, discussions
    return content;
  }

  private addTextualElements(content: string): string {
    // Add detailed text explanations
    return content;
  }

  private addInteractiveElements(content: string): string {
    // Add exercises, practice problems
    return content;
  }
}

export const interactionAnalyzer = new InteractionAnalyzer();