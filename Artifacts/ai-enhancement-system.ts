import { Agent, Task, CrewAIClient } from 'crewai';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  writeBatch 
} from 'firebase/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { LearningProfile, ContentAdaptation, PathwayNode } from '../types/learning';

interface AIEnhancementConfig {
  adaptationInterval: number;
  confidenceThreshold: number;
  maxPathLength: number;
  optimizationRules: OptimizationRule[];
}

class AIEnhancementSystem {
  private readonly firestore: FirebaseFirestore.Firestore;
  private readonly learningAgent: Agent;
  private readonly adaptationAgent: Agent;
  private readonly pathwayAgent: Agent;
  private readonly optimizationSubject: BehaviorSubject<ContentAdaptation[]>;

  constructor(
    firestore: FirebaseFirestore.Firestore,
    crewAI: CrewAIClient,
    config: AIEnhancementConfig
  ) {
    this.firestore = firestore;
    this.optimizationSubject = new BehaviorSubject<ContentAdaptation[]>([]);

    // Initialize specialized agents
    this.learningAgent = this.initializeLearningAgent(crewAI);
    this.adaptationAgent = this.initializeAdaptationAgent(crewAI);
    this.pathwayAgent = this.initializePathwayAgent(crewAI);
  }

  private initializeLearningAgent(crewAI: CrewAIClient): Agent {
    return new Agent({
      name: 'LearningProfiler',
      goal: 'Analyze learning patterns and create personalized profiles',
      backstory: 'Expert in educational psychology and learning analytics',
      allowDelegation: true,
      verbose: true,
      tools: [
        'learningStyleAnalysis',
        'performanceTracking',
        'patternRecognition'
      ]
    });
  }

  private initializeAdaptationAgent(crewAI: CrewAIClient): Agent {
    return new Agent({
      name: 'ContentAdapter',
      goal: 'Adapt educational content for optimal learning',
      backstory: 'Specialist in content adaptation and differentiation',
      allowDelegation: true,
      verbose: true,
      tools: [
        'contentTransformation',
        'difficultyAdjustment',
        'formatOptimization'
      ]
    });
  }

  private initializePathwayAgent(crewAI: CrewAIClient): Agent {
    return new Agent({
      name: 'PathwayNavigator',
      goal: 'Create and optimize learning pathways',
      backstory: 'Expert in educational sequencing and pathway design',
      allowDelegation: true,
      verbose: true,
      tools: [
        'pathwayGeneration',
        'sequenceOptimization',
        'prerequisiteAnalysis'
      ]
    });
  }

  /**
   * Generate personalized learning pathway
   * @param studentId Student identifier
   * @param objectives Learning objectives
   */
  public async generatePersonalizedPathway(
    studentId: string,
    objectives: string[]
  ): Promise<PathwayNode[]> {
    try {
      // Fetch learning profile
      const profile = await this.getLearningProfile(studentId);

      // Generate initial pathway
      const pathwayTask = new Task({
        description: 'Generate personalized learning pathway',
        parameters: {
          profile,
          objectives,
          maxLength: this.config.maxPathLength
        }
      });

      const initialPathway = await this.pathwayAgent.execute(pathwayTask);

      // Optimize pathway
      const optimizedPathway = await this.optimizePathway(
        initialPathway,
        profile
      );

      // Store pathway in Firebase
      await this.storePathway(studentId, optimizedPathway);

      return optimizedPathway;
    } catch (error) {
      console.error('Failed to generate pathway:', error);
      throw error;
    }
  }

  /**
   * Adapt content dynamically based on performance
   * @param contentId Content identifier
   * @param studentId Student identifier
   */
  public async adaptContent(
    contentId: string,
    studentId: string
  ): Promise<ContentAdaptation> {
    try {
      // Get current content and learning profile
      const [content, profile] = await Promise.all([
        this.getContent(contentId),
        this.getLearningProfile(studentId)
      ]);

      // Generate adaptation
      const adaptationTask = new Task({
        description: 'Adapt content for learner',
        parameters: {
          content,
          profile,
          previousAdaptations: await this.getPreviousAdaptations(contentId)
        }
      });

      const adaptation = await this.adaptationAgent.execute(adaptationTask);

      // Validate adaptation
      if (adaptation.confidence < this.config.confidenceThreshold) {
        throw new Error('Adaptation confidence below threshold');
      }

      // Store adaptation
      await this.storeAdaptation(contentId, adaptation);

      // Notify subscribers
      this.optimizationSubject.next([adaptation]);

      return adaptation;
    } catch (error) {
      console.error('Content adaptation failed:', error);
      throw error;
    }
  }

  /**
   * Get learning profile with real-time updates
   * @param studentId Student identifier
   */
  public observeLearningProfile(
    studentId: string
  ): Observable<LearningProfile> {
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(
        doc(this.firestore, 'learningProfiles', studentId),
        (snapshot) => {
          if (snapshot.exists()) {
            subscriber.next(snapshot.data() as LearningProfile);
          }
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * Optimize content based on aggregated performance data
   * @param contentId Content identifier
   */
  public async optimizeContent(
    contentId: string
  ): Promise<void> {
    try {
      // Fetch performance data
      const performanceData = await this.getAggregatedPerformance(contentId);

      // Generate optimization task
      const optimizationTask = new Task({
        description: 'Optimize content based on performance',
        parameters: {
          content: await this.getContent(contentId),
          performanceData,
          optimizationRules: this.config.optimizationRules
        }
      });

      // Execute optimization
      const optimization = await this.adaptationAgent.execute(optimizationTask);

      // Apply optimization
      await this.applyOptimization(contentId, optimization);
    } catch (error) {
      console.error('Content optimization failed:', error);
      throw error;
    }
  }

  private async optimizePathway(
    pathway: PathwayNode[],
    profile: LearningProfile
  ): Promise<PathwayNode[]> {
    const optimizationTask = new Task({
      description: 'Optimize learning pathway',
      parameters: {
        pathway,
        profile,
        constraints: {
          maxDifficulty: profile.maxDifficulty,
          preferredFormats: profile.preferredFormats
        }
      }
    });

    return await this.pathwayAgent.execute(optimizationTask);
  }

  private async storePathway(
    studentId: string,
    pathway: PathwayNode[]
  ): Promise<void> {
    const batch = writeBatch(this.firestore);
    const pathwayRef = doc(
      collection(this.firestore, 'learningPathways'),
      studentId
    );

    batch.set(pathwayRef, {
      pathway,
      updatedAt: new Date().toISOString(),
      status: 'active'
    });

    await batch.commit();
  }

  private async getAggregatedPerformance(
    contentId: string
  ): Promise<PerformanceData[]> {
    const performanceRef = collection(this.firestore, 'performance');
    const q = query(
      performanceRef,
      where('contentId', '==', contentId),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PerformanceData);
  }

  private async applyOptimization(
    contentId: string,
    optimization: ContentOptimization
  ): Promise<void> {
    const batch = writeBatch(this.firestore);
    const contentRef = doc(
      collection(this.firestore, 'content'),
      contentId
    );

    batch.update(contentRef, {
      content: optimization.content,
      metadata: {
        ...optimization.metadata,
        lastOptimized: new Date().toISOString()
      }
    });

    await batch.commit();
  }
}

// React hook for AI enhancements
export const useAIEnhancements = (
  firestore: FirebaseFirestore.Firestore,
  crewAI: CrewAIClient,
  config: AIEnhancementConfig
) => {
  const system = useMemo(
    () => new AIEnhancementSystem(firestore, crewAI, config),
    [firestore, crewAI, config]
  );

  const generatePathway = useCallback(async (
    studentId: string,
    objectives: string[]
  ) => {
    return await system.generatePersonalizedPathway(studentId, objectives);
  }, [system]);

  const adaptContent = useCallback(async (
    contentId: string,
    studentId: string
  ) => {
    return await system.adaptContent(contentId, studentId);
  }, [system]);

  const optimizeContent = useCallback(async (
    contentId: string
  ) => {
    await system.optimizeContent(contentId);
  }, [system]);

  return {
    generatePathway,
    adaptContent,
    optimizeContent,
    observeLearningProfile: system.observeLearningProfile.bind(system)
  };
};
