import { z } from 'zod';
import { Agent, Task } from 'crewai';
import { DocumentReference, collection, doc, setDoc } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';

// Template Schema Definitions
const BaseTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['lesson', 'activity', 'assessment']),
  gradeLevel: z.string(),
  subject: z.string(),
  standards: z.array(z.string()),
  structure: z.record(z.any()),
  metadata: z.record(z.any()),
  version: z.string()
});

const ContentBlockSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'media', 'interactive', 'assessment']),
  content: z.any(),
  metadata: z.record(z.any()),
  validationRules: z.array(z.record(z.any()))
});

type Template = z.infer<typeof BaseTemplateSchema>;
type ContentBlock = z.infer<typeof ContentBlockSchema>;

interface TemplateGenerationConfig {
  baseTemplate: Template;
  adaptations: string[];
  context: Record<string, any>;
}

class TemplateManager {
  private templates: Map<string, Template>;
  private templateUpdates: Subject<Template>;
  private readonly db: FirebaseFirestore.Firestore;
  private readonly agent: Agent;

  constructor(db: FirebaseFirestore.Firestore) {
    this.templates = new Map();
    this.templateUpdates = new Subject<Template>();
    this.db = db;
    this.agent = this.initializeTemplateAgent();
  }

  private initializeTemplateAgent(): Agent {
    return new Agent({
      name: 'TemplateSpecialist',
      goal: 'Create and adapt educational content templates',
      backstory: 'Expert in educational template design and adaptation',
      allowDelegation: true,
      tools: [
        'templateValidation',
        'contentAdaptation',
        'standardsAlignment'
      ]
    });
  }

  public async createTemplate(
    template: Omit<Template, 'id' | 'version'>
  ): Promise<Template> {
    const templateId = this.generateTemplateId(template);
    
    const newTemplate: Template = {
      ...template,
      id: templateId,
      version: '1.0.0'
    };

    // Validate template structure
    try {
      BaseTemplateSchema.parse(newTemplate);
    } catch (error) {
      throw new Error(`Template validation failed: ${error.message}`);
    }

    // Store in Firebase
    await this.persistTemplate(newTemplate);
    
    // Add to local cache
    this.templates.set(templateId, newTemplate);
    
    // Notify subscribers
    this.templateUpdates.next(newTemplate);

    return newTemplate;
  }

  public async adaptTemplate(
    config: TemplateGenerationConfig
  ): Promise<Template[]> {
    const adaptedTemplates: Template[] = [];

    // Delegate adaptation to agent
    for (const adaptation of config.adaptations) {
      const task = new Task({
        description: 'Adapt template for specific context',
        parameters: {
          template: config.baseTemplate,
          adaptation,
          context: config.context
        }
      });

      const adaptedTemplate = await this.agent.execute(task);
      
      // Validate adapted template
      try {
        BaseTemplateSchema.parse(adaptedTemplate);
        adaptedTemplates.push(adaptedTemplate);
      } catch (error) {
        console.error(`Template adaptation failed for ${adaptation}:`, error);
      }
    }

    return adaptedTemplates;
  }

  private async persistTemplate(template: Template): Promise<void> {
    const templateRef = doc(
      collection(this.db, 'templates'),
      template.id
    );

    await setDoc(templateRef, {
      ...template,
      updatedAt: new Date().toISOString()
    });
  }

  public getTemplateUpdates(): Observable<Template> {
    return this.templateUpdates.asObservable();
  }

  private generateTemplateId(template: Partial<Template>): string {
    return `${template.subject}_${template.type}_${Date.now()}`;
  }
}

// Template Factory for different content types
class TemplateFactory {
  private static readonly defaultStructure: Record<string, any> = {
    lesson: {
      introduction: [],
      mainContent: [],
      practice: [],
      assessment: [],
      closure: []
    },
    activity: {
      setup: [],
      instructions: [],
      materials: [],
      steps: [],
      reflection: []
    },
    assessment: {
      instructions: [],
      questions: [],
      rubric: [],
      feedback: []
    }
  };

  public static createLessonTemplate(
    params: Partial<Template>
  ): Omit<Template, 'id' | 'version'> {
    return {
      name: params.name || 'New Lesson Template',
      type: 'lesson',
      gradeLevel: params.gradeLevel || '',
      subject: params.subject || '',
      standards: params.standards || [],
      structure: {
        ...this.defaultStructure.lesson,
        ...params.structure
      },
      metadata: {
        estimatedDuration: '45 minutes',
        difficultyLevel: 'standard',
        ...params.metadata
      }
    };
  }

  public static createActivityTemplate(
    params: Partial<Template>
  ): Omit<Template, 'id' | 'version'> {
    return {
      name: params.name || 'New Activity Template',
      type: 'activity',
      gradeLevel: params.gradeLevel || '',
      subject: params.subject || '',
      standards: params.standards || [],
      structure: {
        ...this.defaultStructure.activity,
        ...params.structure
      },
      metadata: {
        activityType: 'hands-on',
        groupSize: 'individual',
        ...params.metadata
      }
    };
  }

  public static createAssessmentTemplate(
    params: Partial<Template>
  ): Omit<Template, 'id' | 'version'> {
    return {
      name: params.name || 'New Assessment Template',
      type: 'assessment',
      gradeLevel: params.gradeLevel || '',
      subject: params.subject || '',
      standards: params.standards || [],
      structure: {
        ...this.defaultStructure.assessment,
        ...params.structure
      },
      metadata: {
        assessmentType: 'formative',
        scoringMethod: 'rubric',
        ...params.metadata
      }
    };
  }
}

// React hook for template management
export const useTemplateManager = (
  db: FirebaseFirestore.Firestore
) => {
  const templateManager = new TemplateManager(db);

  const createTemplate = async (
    type: 'lesson' | 'activity' | 'assessment',
    params: Partial<Template>
  ): Promise<Template> => {
    let templateBase: Omit<Template, 'id' | 'version'>;

    switch (type) {
      case 'lesson':
        templateBase = TemplateFactory.createLessonTemplate(params);
        break;
      case 'activity':
        templateBase = TemplateFactory.createActivityTemplate(params);
        break;
      case 'assessment':
        templateBase = TemplateFactory.createAssessmentTemplate(params);
        break;
    }

    return await templateManager.createTemplate(templateBase);
  };

  const adaptTemplate = async (
    config: TemplateGenerationConfig
  ): Promise<Template[]> => {
    return await templateManager.adaptTemplate(config);
  };

  const templateUpdates = templateManager.getTemplateUpdates();

  return {
    createTemplate,
    adaptTemplate,
    templateUpdates
  };
};
