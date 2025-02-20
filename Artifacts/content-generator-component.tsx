import React, { useState, useCallback } from 'react';
import { useFirebaseApp } from 'reactfire';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContentGeneration } from '../hooks/useContentGeneration';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ContentGeneratorProps {
  gradeLevel: string;
  subject: string;
  standards: string[];
  onContentGenerated: (content: GeneratedContent) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  gradeLevel,
  subject,
  standards,
  onContentGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<{
    stage: string;
    progress: number;
  }>({ stage: '', progress: 0 });

  const firebaseApp = useFirebaseApp();
  const { generateContent, generateDifferentiated } = useContentGeneration(firebaseApp);

  const handleGeneration = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setGenerationProgress({ stage: 'Planning', progress: 0 });

    try {
      // Generate base content
      const baseContent = await generateContent({
        gradeLevel,
        subject,
        standards,
        contentType: 'lesson',
        differentiationLevels: ['basic', 'intermediate', 'advanced']
      });

      setGenerationProgress({ stage: 'Differentiating', progress: 50 });

      // Generate differentiated versions
      const differentiated = await generateDifferentiated(
        baseContent,
        ['basic', 'intermediate', 'advanced']
      );

      setGenerationProgress({ stage: 'Finalizing', progress: 90 });

      const finalContent = {
        ...baseContent,
        content: {
          ...baseContent.content,
          differentiatedContent: differentiated
        }
      };

      onContentGenerated(finalContent);
      setGenerationProgress({ stage: 'Complete', progress: 100 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Content generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [gradeLevel, subject, standards, generateContent, generateDifferentiated, onContentGenerated]);

  const GenerationProgress = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{generationProgress.stage}</span>
        <span>{generationProgress.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${generationProgress.progress}%` }}
        />
      </div>
    </div>
  );

  const GenerationStatus = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating content...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      );
    }

    if (generationProgress.progress === 100) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Content generated successfully</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Content Generator</span>
          <button
            onClick={handleGeneration}
            disabled={isGenerating}
            className={`px-4 py-2 rounded ${
              isGenerating
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Generate Content
          </button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Generation Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Grade Level</span>
                <p className="font-medium">{gradeLevel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Subject</span>
                <p className="font-medium">{subject}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">Standards</span>
              <div className="mt-1 space-y-1">
                {standards.map((standard, index) => (
                  <div
                    key={index}
                    className="text-sm px-2 py-1 bg-white rounded border"
                  >
                    {standard}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(isGenerating || generationProgress.progress > 0) && (
            <div className="space-y-4">
              <GenerationProgress />
              <GenerationStatus />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentGenerator;