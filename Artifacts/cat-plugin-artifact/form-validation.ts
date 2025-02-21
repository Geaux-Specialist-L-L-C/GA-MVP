// File: src/hooks/useCurriculumForm.ts
import { useState, useCallback } from 'react';
import { cheshireService } from '@/services/cheshireService';
import { useAuth } from '@/contexts/AuthContext';

interface FormErrors {
  grade_level?: string;
  subject?: string;
  difficulty?: string;
  standards?: string;
}

interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

const validationRules: Record<string, ValidationRule> = {
  grade_level: {
    validate: (value: number) => value >= 1 && value <= 12,
    message: 'Grade level must be between 1 and 12'
  },
  subject: {
    validate: (value: string) => value.trim().length >= 2,
    message: 'Subject must be at least 2 characters long'
  },
  difficulty: {
    validate: (value: string) => ['beginner', 'intermediate', 'advanced'].includes(value),
    message: 'Invalid difficulty level'
  }
};

export function useCurriculumForm() {
  const { user } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback((formData: CurriculumRequest): boolean => {
    const newErrors: FormErrors = {};

    // Validate each field
    Object.entries(validationRules).forEach(([field, rule]) => {
      if (!rule.validate(formData[field])) {
        newErrors[field] = rule.message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = useCallback(async (
    formData: CurriculumRequest,
    learningStyle: LearningStyleData | null,
    engagementMetrics: Record<string, number>
  ): Promise<CurriculumResponse | null> => {
    if (!user) return null;

    // Validate form
    if (!validateForm(formData)) {
      return null;
    }

    setLoading(true);
    try {
      // Enhanced curriculum generation with CrewAI
      const response = await cheshireService.post('/plugins/MyCurriculumDesigner/design-curriculum', {
        ...formData,
        learning_style: learningStyle?.style,
        engagement_metrics: engagementMetrics,
        user_id: user.uid,
        adaptationConfidence: learningStyle?.confidence || 0.5
      });

      // Store interaction in episodic memory
      await cheshireService.post('/memory/collections/episodic/points', {
        content: `Curriculum generation for ${formData.subject}`,
        metadata: {
          userId: user.uid,
          type: 'curriculum_generation',
          learningStyle: learningStyle?.style,
          engagement: engagementMetrics,
          timestamp: new Date().toISOString()
        }
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to generate curriculum');
    } finally {
      setLoading(false);
    }
  }, [user, validateForm]);

  return {
    errors,
    loading,
    handleSubmit,
    validateForm
  };
}