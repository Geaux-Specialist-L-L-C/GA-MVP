import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cheshireService } from '@/services/cheshireService';

interface CurriculumRequest {
  grade_level: number;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  standards?: string[];
}

interface CurriculumResponse {
  lesson_plan: Record<string, any>;
  resources: string[];
  estimated_duration: string;
  learning_objectives: string[];
  assessment_criteria: string[];
}

export const CurriculumDesigner: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<CurriculumResponse | null>(null);
  const [request, setRequest] = useState<CurriculumRequest>({
    grade_level: 1,
    subject: '',
    difficulty: 'beginner'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await cheshireService.post('/plugins/MyCurriculumDesigner/design-curriculum', {
        ...request,
        user_id: user?.uid
      });

      setCurriculum(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate curriculum');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Designer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              label="Grade Level"
              min={1}
              max={12}
              value={request.grade_level}
              onChange={(e) => setRequest(prev => ({
                ...prev,
                grade_level: parseInt(e.target.value)
              }))}
              required
            />

            <Input
              type="text"
              label="Subject"
              value={request.subject}
              onChange={(e) => setRequest(prev => ({
                ...prev,
                subject: e.target.value
              }))}
              required
            />

            <select
              className="w-full p-2 border rounded"
              value={request.difficulty}
              onChange={(e) => setRequest(prev => ({
                ...prev,
                difficulty: e.target.value as CurriculumRequest['difficulty']
              }))}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? <LoadingSpinner /> : 'Generate Curriculum'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-500 rounded">
              {error}
            </div>
          )}

          {curriculum && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Generated Curriculum</h3>
              
              <div className="space-y-2">
                <h4 className="font-medium">Duration</h4>
                <p>{curriculum.estimated_duration}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Learning Objectives</h4>
                <ul className="list-disc pl-5">
                  {curriculum.learning_objectives.map((objective, i) => (
                    <li key={i}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Resources</h4>
                <ul className="list-disc pl-5">
                  {curriculum.resources.map((resource, i) => (
                    <li key={i}>{resource}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Assessment Criteria</h4>
                <ul className="list-disc pl-5">
                  {curriculum.assessment_criteria.map((criteria, i) => (
                    <li key={i}>{criteria}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumDesigner;