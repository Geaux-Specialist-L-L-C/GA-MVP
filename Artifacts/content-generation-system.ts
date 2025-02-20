import { Agent, Task } from 'crewai';
import { FirebaseApp } from 'firebase/app';
import { 
  collection, 
  doc, 
  setDoc, 
  getFirestore 
} from 'firebase/firestore';
import { ContentValidationSchema } from './schemas';

interface ContentGenerationConfig {
  gradeLevel: string;
  subject: string;
  standards: string[];
  contentType: 'lesson' | 'assessment' | 'activity';
  differentiationLevels: string[];
}

interface GeneratedContent {
  id: string;
  content: ContentStructure;
  metadata: ContentMetadata;
  validation: ValidationResult;
}

interface ContentStructure {
  objectives: LearningObjective[];
  mainContent: ContentBlock[];
  assessments: Assessment[];
  differentiatedContent: Record<string, ContentBlock[]>;
}

interface ContentMetadata {
  gradeLevel: string;
  subject: string;
  standards: string[];
  generatedAt: Date;
  version: string;
}

class ContentGenerationSystem {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly agents: AgentSystem;

  constructor(app: FirebaseApp) {
    this.db = getFirestore(app);
    this.agents = this.initializeAgents();
  }

  private initializeAgents(): AgentSystem {
    const contentPlanner = new Agent({
      name: 'ContentPlanner',
      goal: 'Plan and structure educational content',
      backstory: 'Expert in curriculum design and educational standards',
      allowDelegation: true,
    });

    const contentGenerator = new Agent({
      name: 'ContentGenerator',
      goal: 'Generate engaging educational content',
      backstory: 'Specialized in creating grade-appropriate learning materials',
      allowDelegation: true,
    });

    const contentValidator = new Agent({
      name: 'ContentValidator',
      goal: 'Validate content against standards and requirements',
      backstory: 'Expert in educational standards and content quality',
      allowDelegation: true,
    });

    return {
      planner: contentPlanner,
      generator: contentGenerator,
      validator: contentValidator
    };
  }

  public async generateContent(
    config: ContentGenerationConfig
  ): Promise<GeneratedContent> {
    try {
      // Step 1: Plan content structure
      const contentPlan = await this.agents.planner.execute(
        new Task({
          description: 'Create detailed content plan',
          parameters: {
            gradeLevel: config.gradeLevel,
            subject: config.subject,
            standards: config.standards,
            contentType: config.contentType
          }
        })
      );

      // Step 2: Generate content
      const generatedContent = await this.agents.generator.execute(
        new Task({
          description: 'Generate content based on plan',
          parameters: {
            plan: contentPlan,
            differentiationLevels: config.differentiationLevels
          }
        })
      );

      // Step 3: Validate content
      const validationResult = await this.agents.validator.execute(
        new Task({
          description: 'Validate generated content',
          parameters: {
            content: generatedContent,
            standards: config.standards,
            schema: ContentValidationSchema
          }
        })
      );

      // Step 4: Store in Firebase
      const contentId = this.generateContentId(config);
      const contentDoc = {
        id: contentId,
        content: generatedContent,
        metadata: {
          gradeLevel: config.gradeLevel,
          subject: config.subject,
          standards: config.standards,
          generatedAt: new Date(),
          version: '1.0'
        },
        validation: validationResult
      };

      await setDoc(
        doc(this.db, 'content', contentId),
        contentDoc
      );

      return contentDoc;
    } catch (error) {
      console.error('Content generation failed:', error);
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  private generateContentId(config: ContentGenerationConfig): string {
    return `${config.subject}_${config.gradeLevel}_${Date.now()}`;
  }

  public async generateDifferentiatedContent(
    baseContent: GeneratedContent,
    levels: string[]
  ): Promise<Record<string, ContentBlock[]>> {
    const differentiatedContent: Record<string, ContentBlock[]> = {};

    for (const level of levels) {
      const adaptedContent = await this.agents.generator.execute(
        new Task({
          description: 'Generate differentiated content',
          parameters: {
            baseContent: baseContent.content,
            targetLevel: level
          }
        })
      );

      differentiatedContent[level] = adaptedContent;
    }

    return differentiatedContent;
  }

  public async validateContentAlignment(
    content: GeneratedContent,
    standards: string[]
  ): Promise<ValidationResult> {
    return await this.agents.validator.execute(
      new Task({
        description: 'Validate standards alignment',
        parameters: {
          content: content.content,
          standards: standards
        }
      })
    );
  }
}

// Hook for React components
export const useContentGeneration = (
  firebaseApp: FirebaseApp
) => {
  const contentSystem = new ContentGenerationSystem(firebaseApp);

  const generateContent = async (
    config: ContentGenerationConfig
  ): Promise<GeneratedContent> => {
    try {
      return await contentSystem.generateContent(config);
    } catch (error) {
      console.error('Error in content generation:', error);
      throw error;
    }
  };

  const generateDifferentiated = async (
    baseContent: GeneratedContent,
    levels: string[]
  ): Promise<Record<string, ContentBlock[]>> => {
    try {
      return await contentSystem.generateDifferentiatedContent(
        baseContent,
        levels
      );
    } catch (error) {
      console.error('Error in differentiation:', error);
      throw error;
    }
  };

  return {
    generateContent,
    generateDifferentiated,
    validateAlignment: contentSystem.validateContentAlignment
  };
};
