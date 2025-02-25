import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  BookOpen, 
  TrendingUp, 
  Clock,
  Brain 
} from 'lucide-react';
import { cheshireService } from '@/services/cheshireService';
import { useAuth } from '@/contexts/AuthContext';

interface LearningPattern {
  metadata: {
    engagement?: number;
    learningStyle?: string;
    topic?: string;
    timestamp?: string;
    duration?: number;
  };
}

export const LearningInsights: React.FC = () => {
  const { user } = useAuth();
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningPatterns = async () => {
      if (!user) return;
      
      try {
        const response = await cheshireService.post('/memory/recall', {
          metadata: {
            userId: user.uid,
            timestamp: {
              after: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          },
          k: 100
        });
        
        setLearningPatterns(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch learning patterns');
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPatterns();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const calculateEngagement = (patterns: LearningPattern[]) => {
    if (!patterns.length) return 0;
    return patterns.reduce((sum, p) => sum + (p.metadata?.engagement || 0), 0) / patterns.length;
  };

  const findPreferredStyle = (patterns: LearningPattern[]) => {
    const styles = patterns.reduce((acc, p) => {
      const style = p.metadata?.learningStyle;
      if (style) acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(styles).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data';
  };

  const engagement = calculateEngagement(learningPatterns);
  const preferredStyle = findPreferredStyle(learningPatterns);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Engagement Level</span>
              </div>
              <div className="text-2xl">
                {(engagement * 100).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="font-medium">Preferred Learning Style</span>
              </div>
              <div className="text-2xl capitalize">
                {preferredStyle}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Learning Sessions</span>
              </div>
              <div className="text-2xl">
                {learningPatterns.length}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Average Session Duration</span>
              </div>
              <div className="text-2xl">
                {learningPatterns.length ? 
                  `${Math.round(learningPatterns.reduce((sum, p) => 
                    sum + (p.metadata?.duration || 0), 0) / learningPatterns.length)} mins` :
                  'N/A'
                }
              </div>
            </div>
          </div>

          {learningPatterns.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Recent Topics</h3>
              <div className="space-y-1">
                {learningPatterns.slice(0, 5).map((pattern, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>{pattern.metadata?.topic || 'Unnamed Topic'}</span>
                    <span className="text-sm text-gray-500">
                      {pattern.metadata?.timestamp ? 
                        new Date(pattern.metadata.timestamp).toLocaleDateString() :
                        'N/A'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningInsights;