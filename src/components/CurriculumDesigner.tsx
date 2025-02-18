// File: /src/components/CurriculumDesigner.tsx
// Description: Adaptive Curriculum Designer component with learning style detection and AddThis social sharing integration
// Author: [Your Name]
// Created: [Date]

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain } from 'lucide-react';
import { GradeLevelSelect, SubjectInput, DifficultySelect, StandardsInput } from './FormControls';
import { useCurriculumForm } from '@/hooks/useCurriculumForm';
import { detectLearningStyle } from '@/services/learningStyleService';
import { useAuth } from '@/contexts/AuthContext';
import { getAvailableStandards } from '@/services/standardsService';
import CurriculumContent from './CurriculumContent';

export const CurriculumDesigner: React.FC = () => {
  const { user } = useAuth();
  const [curriculum, setCurriculum] = useState<CurriculumResponse | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyleData | null>(null);
  const [interactionStart, setInteractionStart] = useState<number>(0);
  const { errors, loading, handleSubmit } = useCurriculumForm();

  const [request, setRequest] = useState<CurriculumRequest>({
    grade_level: 1,
    subject: '',
    difficulty: 'beginner'
  });

  // Enhanced learning style detection
  useEffect(() => {
    let mounted = true;

    const updateLearningStyle = async () => {
      if (!user?.uid) return;
      try {
        const style = await detectLearningStyle(user.uid);
        if (mounted) {
          setLearningStyle(style);
        }
      } catch (error) {
        console.error('Failed to detect learning style:', error);
      }
    };

    updateLearningStyle();
    const interval = setInterval(updateLearningStyle, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user?.uid]);

  // Load AddThis script for social sharing
  useEffect(() => {
    if (!document.getElementById('addthis-script')) {
      const script = document.createElement('script');
      script.src = 'https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-PLACEHOLDER';
      script.async = true;
      script.id = 'addthis-script';
      document.body.appendChild(script);
    }
  }, []);

  // Track interaction start time
  useEffect(() => {
    setInteractionStart(Date.now());
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const engagementMetrics = {
      responseLatency: Date.now() - interactionStart,
      queryComplexity: calculateQueryComplexity(request.subject),
      feedbackIterations: 0
    };

    try {
      const response = await handleSubmit(request, learningStyle, engagementMetrics);
      if (response) {
        setCurriculum(response);
        setInteractionStart(Date.now()); // Reset interaction timer
      }
    } catch (error) {
      // Error handling is managed by useCurriculumForm
      console.error('Submission error:', error);
    }
  };

  const calculateQueryComplexity = (subject: string): number => {
    const words = subject.trim().split(/\s+/);
    const complexity = words.length +
      words.filter(w => w.length > 6).length * 0.5 +
      (subject.includes(',') ? 0.5 : 0);
    return Math.min(complexity / 5, 1);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Adaptive Curriculum Designer
        </CardTitle>
        {learningStyle && (
          <div className="flex items-center gap-2 text-sm">
            <div className="px-3 py-1 rounded-full bg-blue-100">
              <span>🎯 Learning Style: <strong>{learningStyle.style}</strong></span>
              <span className="ml-2 text-gray-500">
                ({(learningStyle.confidence * 100).toFixed(0)}% confidence)
              </span>
            </div>
            <div className="text-gray-500">
              Updated {new Date(learningStyle.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <GradeLevelSelect
            value={request.grade_level}
            onChange={(value) => setRequest(prev => ({ ...prev, grade_level: value as number }))}
            error={errors.grade_level}
            label="Grade Level"
          />

          <SubjectInput
            value={request.subject}
            onChange={(value) => setRequest(prev => ({ ...prev, subject: value as string }))}
            error={errors.subject}
            label="Subject"
          />

          <DifficultySelect
            value={request.difficulty}
            onChange={(value) => setRequest(prev => ({ 
              ...prev, 
              difficulty: value as CurriculumRequest['difficulty'] 
            }))}
            error={errors.difficulty}
            label="Difficulty Level"
          />

          <StandardsInput
            value={request.standards?.[0] || ''}
            onChange={(value) => setRequest(prev => ({ 
              ...prev, 
              standards: [value as string] 
            }))}
            standards={getAvailableStandards(request.subject, request.grade_level)}
            error={errors.standards}
            label="Educational Standards"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Curriculum'}
          </button>
        </form>

        {curriculum && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Personalized Curriculum</h3>
            {curriculum.style_adaptations && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-1">
                    <div>Format: {curriculum.style_adaptations.content_format}</div>
                    <div>Interaction: {curriculum.style_adaptations.interaction_method}</div>
                    <div>Assessment: {curriculum.style_adaptations.assessment_type}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {/* Curriculum content sections */}
            <CurriculumContent curriculum={curriculum} />
            {/* AddThis Social Sharing Buttons */}
            <div className="mt-4">
              <div className="addthis_inline_share_toolbox"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurriculumDesigner;
