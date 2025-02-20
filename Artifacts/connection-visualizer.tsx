import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import _ from 'lodash';

const ConnectionVisualizer = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [connections, setConnections] = useState([]);

  // Sample cross-subject connection data
  const sampleConnections = [
    {
      source: {
        id: "MATH.7.SP.1",
        subject: "MATH",
        grade: 7,
        description: "Statistical sampling and inference"
      },
      target: {
        id: "SCI.7.PS.1",
        subject: "SCIENCE",
        grade: 7,
        description: "Data analysis in physical science"
      },
      type: "APPLICATION",
      strength: 0.85
    },
    {
      source: {
        id: "ELA.7.RI.1",
        subject: "ELA",
        grade: 7,
        description: "Technical text analysis"
      },
      target: {
        id: "SCI.7.LS.2",
        subject: "SCIENCE",
        grade: 7,
        description: "Scientific documentation"
      },
      type: "REINFORCEMENT",
      strength: 0.75
    }
  ];

  const subjects = ['MATH', 'SCIENCE', 'ELA', 'SOCIAL_STUDIES'];
  const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8'];
  const connectionTypes = ['PREREQUISITE', 'REINFORCEMENT', 'APPLICATION', 'SYNTHESIS'];

  // Color mapping for connection types
  const typeColors = {
    PREREQUISITE: 'bg-blue-100 border-blue-500',
    REINFORCEMENT: 'bg-green-100 border-green-500',
    APPLICATION: 'bg-purple-100 border-purple-500',
    SYNTHESIS: 'bg-orange-100 border-orange-500'
  };

  useEffect(() => {
    // Filter connections based on selected subject and grade
    const filtered = sampleConnections.filter(conn => {
      const subjectMatch = selectedSubject === 'all' || 
        conn.source.subject === selectedSubject || 
        conn.target.subject === selectedSubject;
        
      const gradeMatch = selectedGrade === 'all' || 
        conn.source.grade === parseInt(selectedGrade === 'K' ? '0' : selectedGrade) || 
        conn.target.grade === parseInt(selectedGrade === 'K' ? '0' : selectedGrade);
        
      return subjectMatch && gradeMatch;
    });
    
    setConnections(filtered);
  }, [selectedSubject, selectedGrade]);

  const ConnectionCard = ({ connection }) => (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-semibold">{connection.source.subject} → {connection.target.subject}</h4>
          <p className="text-sm text-gray-600">Grade {connection.source.grade}</p>
        </div>
        <div className={`px-2 py-1 rounded border ${typeColors[connection.type]} text-sm`}>
          {connection.type}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">Source:</span> {connection.source.description}
        </div>
        <div className="text-sm">
          <span className="font-medium">Target:</span> {connection.target.description}
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-sm font-medium mb-1">Connection Strength</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 rounded-full h-2" 
            style={{ width: `${connection.strength * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  const ConnectionStats = ({ connections }) => {
    const stats = {
      totalConnections: connections.length,
      byType: _.countBy(connections, 'type'),
      avgStrength: _.meanBy(connections, 'strength'),
      subjectPairs: _.uniqBy(connections.map(c => 
        [c.source.subject, c.target.subject].sort().join('-')
      )).length
    };

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="font-medium">Connection Summary</h4>
          <p className="text-sm text-gray-600">
            {stats.totalConnections} connections across {stats.subjectPairs} subject pairs
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="font-medium">Average Strength</h4>
          <p className="text-sm text-gray-600">
            {(stats.avgStrength * 100).toFixed(1)}% alignment
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Cross-Subject Connections</CardTitle>
        <div className="flex gap-4 mt-4">
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
        </div>
      </CardHeader>

      <CardContent>
        <ConnectionStats connections={connections} />
        
        <div className="mb-4">
          <div className="flex gap-2">
            {connectionTypes.map(type => (
              <div 
                key={type}
                className={`px-2 py-1 rounded text-xs ${typeColors[type]}`}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {connections.length > 0 ? (
          <div className="space-y-4">
            {connections.map((connection, index) => (
              <ConnectionCard key={index} connection={connection} />
            ))}
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              No connections found for the selected criteria.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionVisualizer;