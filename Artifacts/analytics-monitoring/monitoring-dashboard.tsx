import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const AgentMonitoringDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('1h'); // 1h, 24h, 7d

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/monitoring/metrics?range=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [timeRange, user]);

  const renderResponseTimeChart = () => {
    if (!metrics?.response_times) return null;

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Agent Response Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <LineChart 
              data={metrics.response_times}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="teacher_agent" 
                stroke="#8884d8" 
                name="Teacher Agent"
              />
              <Line 
                type="monotone" 
                dataKey="research_agent" 
                stroke="#82ca9d"
                name="Research Agent"
              />
              <Line 
                type="monotone" 
                dataKey="supervisor_agent" 
                stroke="#ffc658"
                name="Supervisor Agent"
              />
            </LineChart>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderQualityMetrics = () => {
    if (!metrics?.quality_scores) return null;

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Curriculum Quality Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Average Quality Score</h3>
              <p className="text-3xl font-bold">
                {(metrics.quality_scores.average * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Evaluations</h3>
              <p className="text-3xl font-bold">
                {metrics.quality_scores.total_evaluations}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderErrorMetrics = () => {
    if (!metrics?.errors) return null;

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Error Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(metrics.errors).map(([agent, data]) => (
              <div key={agent} className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">{agent}</h3>
                <p className="text-3xl font-bold text-red-500">
                  {(data.error_rate * 100).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500">
                  {data.total_errors} errors in {data.total_tasks} tasks
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Agent Performance Monitoring</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>
      
      {renderResponseTimeChart()}
      {renderQualityMetrics()}
      {renderErrorMetrics()}
    </div>
  );
};

export default AgentMon