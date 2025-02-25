import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Learning Style Assessment Component
const LearningStyleAssessment = () => {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/learning-style/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          visual: 0,
          auditory: 0,
          kinesthetic: 0,
          reading_writing: 0
        })
      });
      
      const data = await response.json();
      setAssessment(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Learning Style Assessment</h2>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={startAssessment}
              className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90"
            >
              Start Assessment
            </button>
            {assessment && (
              <div className="mt-4">
                <h3 className="font-semibold">Your Learning Style Profile</h3>
                <div className="mt-2 space-y-2">
                  {Object.entries(assessment).map(([style, score]) => (
                    <div key={style} className="flex justify-between">
                      <span className="capitalize">{style.replace('_', ' ')}</span>
                      <span>{Math.round(score * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Curriculum Generation Component
const CurriculumGenerator = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [generating, setGenerating] = useState(false);
  const [curriculum, setCurriculum] = useState(null);
  const [error, setError] = useState(null);

  const generateCurriculum = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          subject,
          grade_level: parseInt(gradeLevel),
          learning_style: 'visual' // This should come from the assessment
        })
      });
      
      const data = await response.json();
      setCurriculum(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Curriculum Generator</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Grade Level</label>
            <input
              type="number"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={generateCurriculum}
            disabled={generating}
            className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Curriculum'}
          </button>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {curriculum && (
            <div className="mt-4">
              <h3 className="font-semibold">Generated Curriculum</h3>
              <pre className="mt-2 p-4 bg-gray-100 rounded overflow-x-auto">
                {JSON.stringify(curriculum, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { LearningStyleAssessment, CurriculumGenerator };
