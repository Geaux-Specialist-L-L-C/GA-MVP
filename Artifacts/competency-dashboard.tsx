import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target, Book, Activity, BarChart, ChevronRight } from 'lucide-react';

const CompetencyDashboard = ({ framework, analytics, studentId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  
  const CompetencyOverview = ({ competencies }) => (
    <div className="space-y-4">
      {Object.entries(competencies).map(([id, comp]) => (
        <div
          key={id}
          className={`
            p-4 border rounded-lg cursor-pointer
            ${selectedCompetency === id ? 'border-blue-500 bg-blue-50' : ''}
          `}
          onClick={() => setSelectedCompetency(id)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold mb-2">{competency.name}</h3>
          <p className="text-sm text-gray-600">{competency.description}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Success Indicators</h4>
              <ul className="text-sm space-y-1">
                {competency.indicators.map((indicator, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Standards Alignment</h4>
              <ul className="text-sm space-y-1">
                {competency.standards.map((standard, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-green-500" />
                    {standard}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Mastery Progress</h3>
          <ProgressChart analyticsData={analytics} />
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Current Level</h4>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(analytics.mastery_level * 100)}%
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Activities Completed</h4>
              <div className="text-2xl font-bold text-green-600">
                {analytics.activities.length}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Time Invested</h4>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(analytics.total_time / 60)} hrs
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
          <div className="space-y-2">
            {analytics.activities.slice(-5).map((activity, idx) => (
              <div key={idx} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Score: {Math.round(activity.score * 100)}%
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const LearningPathView = ({ framework, studentId }) => {
    const [path, setPath] = useState([]);
    
    useEffect(() => {
      // Simulate fetching learning path
      const samplePath = [
        {
          competencyId: 'MATH.ALG.1',
          status: 'completed',
          nextMilestone: 'Assessment'
        },
        {
          competencyId: 'MATH.ALG.2',
          status: 'in_progress',
          nextMilestone: 'Practice'
        }
      ];
      setPath(samplePath);
    }, [framework, studentId]);
    
    return (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium mb-2">Your Learning Journey</h3>
          <p className="text-sm text-gray-600">
            Follow this personalized path to achieve your learning goals.
          </p>
        </div>
        
        <div className="relative">
          {path.map((step, idx) => {
            const competency = framework.competencies[step.competencyId];
            return (
              <div key={idx} className="relative pl-8 pb-8 border-l-2 border-gray-200">
                <div className={`
                  absolute w-4 h-4 rounded-full -left-2 top-0
                  ${step.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}
                `} />
                <div className="p-4 border rounded-lg ml-4">
                  <h4 className="font-medium">{competency.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Next: {step.nextMilestone}
                  </p>
                  <div className="mt-2">
                    <span className={`
                      text-sm px-2 py-1 rounded
                      ${step.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    `}>
                      {step.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Competency Framework</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="path" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Learning Path
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-5">
                <CompetencyOverview competencies={framework.competencies} />
              </div>
              <div className="col-span-7">
                {selectedCompetency ? (
                  <CompetencyDetail 
                    competency={framework.competencies[selectedCompetency]}
                    analytics={analytics.competency_progress[selectedCompetency]}
                  />
                ) : (
                  <Alert>
                    <AlertDescription>
                      Select a competency from the list to view details.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm mb-1">Overall Progress</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(analytics.overall_progress * 100)}%
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm mb-1">Competencies Mastered</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.mastered_competencies} / {Object.keys(framework.competencies).length}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm mb-1">Time Investment</h3>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(analytics.total_time / 60)} hrs
                  </div>
                </div>
              </div>
              
              <ProgressChart analyticsData={analytics.timeline_data} />
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Competency Distribution</h3>
                <div className="flex gap-2">
                  {Object.values(CompetencyLevel).map((level) => (
                    <div key={level} className="flex-1 p-3 bg-gray-50 rounded text-center">
                      <div className="text-2xl font-bold">
                        {analytics.level_distribution[level] || 0}
                      </div>
                      <div className="text-sm text-gray-600">{level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="path">
            <LearningPathView 
              framework={framework}
              studentId={studentId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompetencyDashboard;font-medium">{comp.name}</h3>
            <span className={`
              px-2 py-1 rounded text-sm
              ${comp.level === 'INTRODUCING' ? 'bg-green-100 text-green-800' : ''}
              ${comp.level === 'DEVELOPING' ? 'bg-blue-100 text-blue-800' : ''}
              ${comp.level === 'PROFICIENT' ? 'bg-purple-100 text-purple-800' : ''}
              ${comp.level === 'MASTERING' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {comp.level}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{comp.description}</p>
          
          <div className="flex gap-2 text-sm">
            {comp.prerequisites.length > 0 && (
              <span className="px-2 py-1 bg-gray-100 rounded">
                {comp.prerequisites.length} Prerequisites
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 rounded">
              {comp.indicators.length} Indicators
            </span>
          </div>
        </div>
      ))}
    </div>
  );
  
  const ProgressChart = ({ analyticsData }) => {
    // Transform analytics data for visualization
    const chartData = Object.entries(analyticsData).map(([date, data]) => ({
      date,
      mastery: data.mastery_level * 100,
      activities: data.activities.length
    }));
    
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="mastery"
              name="Mastery %"
              stroke="#8884d8"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="activities"
              name="Activities"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  const CompetencyDetail = ({ competency, analytics }) => {
    if (!competency) return null;
    
    return (
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="