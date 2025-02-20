import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Send, BookOpen } from 'lucide-react';
import { cheshireService } from '@/services/cheshireService';

interface CurriculumRequest {
  grade_level: number;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learning_style?: string;
  standards?: string[];
  engagement_metrics?: {
    responseLatency: number;
    queryComplexity: number;
    feedbackIterations: number;
  };
}

interface ActivityRecommendation {
  activity: string;
  description: string;
  style_alignment: string;
  difficulty_rating: number;
}

interface CurriculumResponse {
  lesson_plan: Record<string, any>;
  resources: string[];
  estimated_duration: string;
  learning_objectives: string[];
  assessment_criteria: string[];
  adapted_for?: string;
  activities?: ActivityRecommendation[];
  style_adaptations?: {
    content_format: string;
    interaction_method: string;
    assessment_type: string;
  };
}

interface LearningStyleData {
  style: string;
  confidence: number;
  lastUpdated: Date;
  evidence: {
    interactions: number;
    accuracy: number;
    engagementScore: number;
  };
}

export const CurriculumDesigner: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumResponse | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyleData | null>(null);
  const [interactionStart, setInteractionStart] = useState<number>(0);

  const [request, setRequest] = useState<CurriculumRequest>({
    grade_level: 1,
    subject: '',
    difficulty: 'beginner'
  });

  // Enhanced learning style detection with CrewAI
  const detectLearningStyle = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      // Query Cheshire Cat's episodic memory for interaction patterns
      const patterns = await cheshireService.post('/memory/recall', {
        metadata: { 
          userId: user.uid,
          type: 'interaction_pattern'
        },
        k: 50 // Last 50 interactions
      });

      // Process interaction patterns through CrewAI agent
      const analysisResponse = await cheshireService.post('/plugins/learning-style-analyzer/analyze', {
        patterns: patterns.data,
        userId: user.uid
      });

      setLearningStyle(analysisResponse.data);
      
      // Store updated style in declarative memory
      await cheshireService.post('/memory/collections/declarative/points', {
        content: `Learning style analysis for user ${user.uid}`,
        metadata: {
          userId: user.uid,
          type: 'learning_style',
          ...analysisResponse.data,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error("Error detecting learning style:", err);
    }
  }, [user?.uid]);

  // Initialize interaction tracking
  useEffect(() => {
    setInteractionStart(Date.now());
    const interval = setInterval(detectLearningStyle, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [detectLearningStyle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Calculate engagement metrics
      const engagementMetrics = {
        responseLatency: Date.now() - interactionStart,
        queryComplexity: calculateQueryComplexity(request.subject),
        feedbackIterations: 0 // Updated through feedback loops
      };

      // Enhanced curriculum generation with CrewAI
      const response = await cheshireService.post('/plugins/MyCurriculumDesigner/design-curriculum', {
        ...request,
        learning_style: learningStyle?.style,
        engagement_metrics: engagementMetrics,
        user_id: user?.uid,
        adaptationConfidence: learningStyle?.confidence || 0.5
      });

      setCurriculum(response.data);

      // Store successful interaction in episodic memory
      await cheshireService.post('/memory/collections/episodic/points', {
        content: `Curriculum generation for ${request.subject}`,
        metadata: {
          userId: user?.uid,
          type: 'curriculum_generation',
          learningStyle: learningStyle?.style,
          engagement: engagementMetrics,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate curriculum');
    } finally {
      setLoading(false);
      setInteractionStart(Date.now()); // Reset interaction timer
    }
  };

  const calculateQueryComplexity = (subject: string): number => {
    // Implement query complexity analysis
    const complexity = subject.split(/\s+/).length;
    return Math.min(complexity / 5, 1); // Normalize to 0-1
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
        {/* Form implementation remains the same */}
        
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

            {/* Rest of the curriculum display remains the same */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurriculumDesigner;