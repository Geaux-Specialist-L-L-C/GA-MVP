import React, { useState, useEffect } from 'react';
import { useFirestore } from 'reactfire';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAIEnhancements } from '../hooks/useAIEnhancements';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Map, ChevronRight, Target, Book, RefreshCw, AlertTriangle } from 'lucide-react';
import type { PathwayNode, LearningProfile } from '../types/learning';

interface PathwayManagerProps {
  studentId: string;
  objectives: string[];
  onPathwayUpdate: (pathway: PathwayNode[]) => void;
}

export const PathwayManager: React.FC<PathwayManagerProps> = ({
  studentId,
  objectives,
  onPathwayUpdate
}) => {
  const [pathway, setPathway] = useState<PathwayNode[]>([]);
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const firestore = useFirestore();
  const crewAI = useCrewAI();  // Custom hook for CrewAI client

  const {
    generatePathway,
    adaptContent,
    optimizeContent,
    observeLearningProfile
  } = useAIEnhancements(firestore, crewAI, {
    adaptationInterval: 5000,
    confidenceThreshold: 0.8,
    maxPathLength: 10,
    optimizationRules: ['difficulty', 'engagement', 'completion']
  });

  useEffect(() => {
    const subscription = observeLearningProfile(studentId).subscribe({
      next: (updatedProfile) => {
        setProfile(updatedProfile);
      },
      error: (err) => {
        setError(`Failed to load learning profile: ${err.message}`);
      }
    });

    return () => subscription.unsubscribe();
  }, [studentId, observeLearningProfile]);

  const handleGeneratePathway = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const newPathway = await generatePathway(studentId, objectives);
      setPathway(newPathway);
      onPathwayUpdate(newPathway);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate pathway');
    } finally {
      setIsLoading(false);
    }
  };

  const PathwayVisualization = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pathway}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sequence" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="difficulty"
            stroke="#8884d8"
            name="Difficulty"
          />
          <Line
            type="monotone"
            dataKey="estimatedTime"
            stroke="#82ca9d"
            name="Time (min)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const PathwayNode: React.FC<{ node: PathwayNode; index: number }> = ({
    node,
    index
  }) => (
    <div className="relative pb-8 pl-8 border-l-2 border-gray-200">
      <div className="absolute w-4 h-4 rounded-full -left-2 top-0 bg-blue-500" />
      <div className="ml-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{node.title}</h4>
            <p className="text-sm text-gray-600">{node.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {node.estimatedTime} min
            </span>
            <span className={`
              px-2 py-1 rounded text-xs
              ${node.difficulty < 0.4 ? 'bg-green-100 text-green-800' : 
                node.difficulty < 0.7 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              Difficulty: {(node.difficulty * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="text-sm">
            <span className="font-medium">Prerequisites:</span>
            <ul className="mt-1 space-y-1">
              {node.prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <span className="font-medium">Learning Outcomes:</span>
            <ul className="mt-1 space-y-1">
              {node.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handleNodeAdaptation(node.id)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Adapt
          </button>
          <button
            onClick={() => handleNodeDetails(node.id)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <Book className="w-3 h-3" />
            Details
          </button>
        </div>
      </div>
    </div>
  );

  const handleNodeAdaptation = async (nodeId: string) => {
    try {
      setIsLoading(true);
      const adaptation = await adaptContent(nodeId, studentId);
      
      // Update pathway with adapted content
      setPathway(prev => prev.map(node => 
        node.id === nodeId ? { ...node, ...adaptation } : node
      ));
      
      onPathwayUpdate(pathway);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Adaptation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeDetails = async (nodeId: string) => {
    // Implement node details modal/drawer
    console.log('Show details for node:', nodeId);
  };

  const PathwayMetrics = () => {
    // Calculate pathway metrics
    const metrics = {
      totalTime: pathway.reduce((sum, node) => sum + node.estimatedTime, 0),
      avgDifficulty: pathway.reduce((sum, node) => sum + node.difficulty, 0) / pathway.length,
      completionRate: profile?.completionRate || 0
    };

    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Total Duration</h4>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.totalTime} min
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Average Difficulty</h4>
          <div className="text-2xl font-bold text-purple-600">
            {(metrics.avgDifficulty * 100).toFixed(0)}%
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Completion Rate</h4>
          <div className="text-2xl font-bold text-green-600">
            {(metrics.completionRate * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    );
  };

  const OptimizationAlert: React.FC<{ profile: LearningProfile }> = ({ profile }) => {
    if (profile.performanceFlags.length === 0) return null;

    return (
      <Alert className="mb-6">
        <AlertDescription className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Pathway optimization suggested based on:
          <ul className="list-disc list-inside">
            {profile.performanceFlags.map((flag, index) => (
              <li key={index} className="text-sm">{flag}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-6 h-6" />
            Learning Pathway
          </div>
          <button
            onClick={handleGeneratePathway}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded font-medium flex items-center gap-2
              ${isLoading ? 'bg-gray-300 cursor-not-allowed' :
                'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Generate Pathway
              </>
            )}
          </button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {profile && <OptimizationAlert profile={profile} />}

        {pathway.length > 0 && (
          <>
            <PathwayMetrics />
            <PathwayVisualization />
            
            <div className="mt-8">
              <h3 className="font-medium mb-6">Pathway Nodes</h3>
              <div className="space-y-2">
                {pathway.map((node, index) => (
                  <PathwayNode
                    key={node.id}
                    node={node}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PathwayManager;