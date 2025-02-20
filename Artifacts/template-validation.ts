import { z } from 'zod';
import { Agent, Task } from 'crewai';
import type { Template, ValidationResult, ValidationRule } from '../types/templates';

// Enhanced validation schemas
const ContentBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['text', 'media', 'interactive', 'assessment']),
  content: z.any(),
  metadata: z.record(z.unknown()),
  validationRules: z.array(z.record(z.unknown())).optional()
});

const StandardsSchema = z.object({
  id: z.string(),
  code: z.string(),
  description: z.string(),
  grade: z.string(),
  subject: z.string()
});

const TemplateValidationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(['lesson', 'activity', 'assessment']),
  gradeLevel: z.string(),
  subject: z.string(),
  standards: z.array(StandardsSchema),
  structure: z.record(z.array(ContentBlockSchema)),
  metadata: z.record(z.unknown()),
  version: z.string().regex(/^\d+\.\d+\.\d+$/)
});

export class TemplateValidationService {
  private readonly agent: Agent;
  private readonly validationRules: Map<string, ValidationRule>;

  constructor(agent: Agent) {
    this.agent = agent;
    this.validationRules = this.initializeValidationRules();
  }

  private initializeValidationRules(): Map<string, ValidationRule> {
    return new Map([
      ['schema', {
        name: 'Schema Validation',
        validate: async (template: Template) => {
          try {
            TemplateValidationSchema.parse(template);
            return { valid: true };
          } catch (error) {
            if (error instanceof z.ZodError) {
              return {
                valid: false,
                errors: error.errors.map(e => ({
                  path: e.path.join('.'),
                  message: e.message
                }))
              };
            }
            throw error;
          }
        }
      }],
      ['standards', {
        name: 'Standards Alignment',
        validate: async (template: Template) => {
          const task = new Task({
            description: 'Validate standards alignment',
            parameters: {
              template,
              standards: template.standards
            }
          });

          const result = await this.agent.execute(task);
          return {
            valid: result.isValid,
            errors: result.errors || [],
            warnings: result.warnings || []
          };
        }
      }],
      ['content', {
        name: 'Content Appropriateness',
        validate: async (template: Template) => {
          const task = new Task({
            description: 'Validate content appropriateness',
            parameters: {
              template,
              gradeLevel: template.gradeLevel
            }
          });

          const result = await this.agent.execute(task);
          return {
            valid: result.isValid,
            errors: result.errors || [],
            warnings: result.warnings || []
          };
        }
      }],
      ['accessibility', {
        name: 'Accessibility Compliance',
        validate: async (template: Template) => {
          const task = new Task({
            description: 'Validate accessibility compliance',
            parameters: {
              template,
              requirements: ['WCAG2.1', 'Section508']
            }
          });

          const result = await this.agent.execute(task);
          return {
            valid: result.isValid,
            errors: result.errors || [],
            warnings: result.warnings || []
          };
        }
      }]
    ]);
  }

  /**
   * Validate a template against all or specific rules
   * @param template Template to validate
   * @param rules Optional specific rules to validate against
   */
  public async validateTemplate(
    template: Template,
    rules?: string[]
  ): Promise<ValidationResult> {
    const validationPromises: Promise<ValidationResult>[] = [];
    const rulesToValidate = rules || Array.from(this.validationRules.keys());

    for (const rule of rulesToValidate) {
      const validationRule = this.validationRules.get(rule);
      if (validationRule) {
        validationPromises.push(validationRule.validate(template));
      }
    }

    const results = await Promise.all(validationPromises);
    
    return this.aggregateResults(results);
  }

  /**
   * Validate multiple templates in batch
   * @param templates Templates to validate
   */
  public async validateTemplateBatch(
    templates: Template[]
  ): Promise<Map<string, ValidationResult>> {
    const results = new Map<string, ValidationResult>();

    await Promise.all(
      templates.map(async (template) => {
        const result = await this.validateTemplate(template);
        results.set(template.id, result);
      })
    );

    return results;
  }

  /**
   * Validate template export format
   * @param template Template to validate
   * @param format Export format
   */
  public async validateExportFormat(
    template: Template,
    format: string
  ): Promise<ValidationResult> {
    const task = new Task({
      description: 'Validate template export format',
      parameters: {
        template,
        format,
        requirements: {
          json: ['valid_json', 'complete_metadata'],
          yaml: ['valid_yaml', 'complete_metadata'],
          pdf: ['valid_pdf', 'accessible_format']
        }
      }
    });

    const result = await this.agent.execute(task);
    return {
      valid: result.isValid,
      errors: result.errors || [],
      warnings: result.warnings || []
    };
  }

  private aggregateResults(
    results: ValidationResult[]
  ): ValidationResult {
    const aggregated: ValidationResult = {
      valid: true,
      errors: [],
      warnings: []
    };

    for (const result of results) {
      if (!result.valid) {
        aggregated.valid = false;
      }
      if (result.errors) {
        aggregated.errors.push(...result.errors);
      }
      if (result.warnings) {
        aggregated.warnings.push(...result.warnings);
      }
    }

    return aggregated;
  }
}

// React hook for template validation
export const useTemplateValidation = (agent: Agent) => {
  const validationService = useMemo(
    () => new TemplateValidationService(agent),
    [agent]
  );

  const validateTemplate = useCallback(async (
    template: Template,
    rules?: string[]
  ): Promise<ValidationResult> => {
    return await validationService.validateTemplate(template, rules);
  }, [validationService]);

  const validateBatch = useCallback(async (
    templates: Template[]
  ): Promise<Map<string, ValidationResult>> => {
    return await validationService.validateTemplateBatch(templates);
  }, [validationService]);

  const validateExport = useCallback(async (
    template: Template,
    format: string
  ): Promise<ValidationResult> => {
    return await validationService.validateExportFormat(template, format);
  }, [validationService]);

  return {
    validateTemplate,
    validateBatch,
    validateExport
  };
};
