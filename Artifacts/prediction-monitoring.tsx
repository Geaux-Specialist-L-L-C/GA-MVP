import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, CPU, Database, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PredictionSystemMonitor = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/monitoring/prediction-system', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch prediction system metrics');
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
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const ModelPerformance = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Model Performance</CardTitle>
          <Activity className="w-5 h-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium">RMSE</h4>
            <p className="text-2xl font-bold mt-1">
              {metrics?.model_performance.rmse.toFixed(3)}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium">R²</h4>
            <p className="text-2xl font-bold mt-1">
              {metrics?.model_performance.r2.toFixed(3)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font