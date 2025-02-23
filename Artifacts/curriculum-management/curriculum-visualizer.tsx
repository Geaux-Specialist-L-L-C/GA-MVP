import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import _ from 'lodash';

const CurriculumVisualizer = () => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);

  // Sample curriculum data structure
  const sampleData = {
    nodes: [
      {
        id: "MATH.K.CC.1",
        grade: 0,
        subject: "MATH",
        description: "Count to 100 by ones and tens",
        dokLevel: 2
      },
      {
        id: "MATH.1.OA.1",
        grade: 1,
        subject: "MATH",
        description: "Addition and subtraction within 20",
        dokLevel: 3
      },
      {
        id: "SCI.K.PS.1",
        grade: 0,
        subject: "SCIENCE",
        description: "Basic forces and motion",
        dokLevel: 2
      }
    ],
    edges: [
      {
        source: "MATH.K.CC.1",
        target: "MATH.1.OA.1",
        type: "prerequisite"
      }
    ]
  };

  const subjects = ['MATH', 'SCIENCE', 'ELA', 'SOCIAL_STUDIES'];
  const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8'];

  // Transform graph data for visualization
  const processGraphData = (rawData, gradeFilter, subjectFilter) => {
    try {
      let filteredNodes = rawData.nodes;
      
      if (gradeFilter !== 'all') {
        filteredNodes = filteredNodes.filter(node => 
          node.grade === parseInt(gradeFilter === 'K' ? '0' : gradeFilter)
        );
      }
      
      if (subjectFilter !== 'all') {
        filteredNodes = filteredNodes.filter(node => 
          node.subject === subjectFilter
        );
      }

      // Group standards by grade level
      const standardsByGrade = _.groupBy(filteredNodes, 'grade');
      
      // Calculate stats for each grade
      const gradeStats = Object.entries(standardsByGrade).map(([grade, standards]) => ({
        grade: grade === '0' ? 'K' : grade,
        standardCount: standards.length,
        avgDOK: _.meanBy(standards, 'dokLevel'),
        prerequisites: standards.filter(s => 
          rawData.edges.some(e => e.target === s.id)
        ).length
      }));

      return _.sortBy(gradeStats, [g => g.grade === 'K' ? -1 : parseInt(g.grade)]);
    } catch (err) {
      setError("Error processing curriculum data");
      return [];
    }
  };

  useEffect(() => {
    const processed = processGraphData(sampleData, selectedGrade, selectedSubject);
    setGraphData(processed);
  }, [selectedGrade, selectedSubject]);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Curriculum Standards Analysis</CardTitle>
        <div className="flex gap-4 mt-4">
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="grade" 
                label={{ value: 'Grade Level', position: 'bottom' }} 
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              
              <Tooltip 
                formatter={(value, name) => {
                  switch(name) {
                    case 'Standards':
                      return [value, 'Number of Standards'];
                    case 'DOK Level':
                      return [value.toFixed(1), 'Average DOK Level'];
                    case 'Prerequisites':
                      return [value, 'Standards with Prerequisites'];
                    default:
                      return [value, name];
                  }
                }}
              />
              <Legend />
              
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="standardCount"
                name="Standards"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgDOK"
                name="DOK Level"
                stroke="#82ca9d"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="prerequisites"
                name="Prerequisites"
                stroke="#ffc658"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Analysis Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">Curriculum Coverage</h4>
              <p className="text-sm text-gray-600">
                Displaying {graphData?.length || 0} grade levels with 
                {' '}{_.sumBy(graphData, 'standardCount') || 0} total standards
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">Complexity Analysis</h4>
              <p className="text-sm text-gray-600">
                Average DOK Level: {
                  (_.meanBy(graphData, 'avgDOK') || 0).toFixed(1)
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumVisualizer;
