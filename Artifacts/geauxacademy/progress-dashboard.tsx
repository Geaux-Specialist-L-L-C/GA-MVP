import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Award, BookOpen, Clock, ChevronRight, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProgressDashboard = () => {
  // Sample data - In production, this would come from an API
  const progressData = [
    { week: 'Week 1', score: 75 },
    { week: 'Week 2', score: 82 },
    { week: 'Week 3', score: 78 },
    { week: 'Week 4', score: 85 },
    { week: 'Week 5', score: 88 },
    { week: 'Week 6', score: 92 }
  ];

  const milestones = [
    { id: 1, title: 'Complete Math Module 3', due: '2 days', progress: 80 },
    { id: 2, title: 'Science Project Submission', due: '5 days', progress: 60 },
    { id: 3, title: 'History Essay Draft', due: '1 week', progress: 30 }
  ];

  const achievements = [
    { id: 1, title: 'Math Master', description: 'Completed Algebra with 95% accuracy', date: '2 days ago' },
    { id: 2, title: 'Science Explorer', description: 'Finished all lab experiments', date: '1 week ago' },
    { id: 3, title: 'Reading Champion', description: 'Read 10 books this month', date: '2 weeks ago' }
  ];

  const subjects = [
    { name: 'Mathematics', progress: 85, hours: 24 },
    { name: 'Science', progress: 72, hours: 18 },
    { name: 'English', progress: 90, hours: 20 },
    { name: 'History', progress: 65, hours: 15 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Progress Dashboard</h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Download Report
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(subject => (
          <Card key={subject.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">{subject.progress}%</div>
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{subject.hours}h</span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Chart */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Milestones and Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map(milestone => (
                <div key={milestone.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">Due in {milestone.due}</p>
                  </div>
                  <div className="w-24">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;
