import React, { useState, useEffect } from 'react';
import { ChevronRight, Book, BarChart2, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    learningStyle: '',
    progress: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulated API call
        const data = {
          learningStyle: 'Visual',
          progress: [
            { month: 'Jan', completion: 65 },
            { month: 'Feb', completion: 78 },
            { month: 'Mar', completion: 82 },
            { month: 'Apr', completion: 90 }
          ],
          recommendations: [
            { id: 1, title: 'Visual Learning Techniques', progress: 0 },
            { id: 2, title: 'Mind Mapping Mastery', progress: 30 },
            { id: 3, title: 'Spatial Memory Training', progress: 60 }
          ]
        };
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Learning Style Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <Book className="text-blue-500" />
            <h2 className="text-xl font-semibold">Learning Style</h2>
          </div>
          <p className="text-gray-600">Your identified style:</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{userData.learningStyle}</p>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-blue-500" />
            <h2 className="text-xl font-semibold">Progress Overview</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData.progress}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recommended Courses</h2>
        <div className="space-y-4">
          {userData.recommendations.map(course => (
            <div 
              key={course.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <h3 className="font-medium">{course.title}</h3>
                <div className="w-48 h-2 bg-gray-200 rounded mt-2">
                  <div 
                    className="h-full bg-blue-500 rounded" 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
