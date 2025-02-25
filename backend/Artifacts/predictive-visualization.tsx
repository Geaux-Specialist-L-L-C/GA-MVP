import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PredictionData {
  metric: string;
  predicted_value: number;
  confidence: number;
  trend: string;
  warning_threshold: number;
  critical_threshold: number;
  time_to_threshold: number | null;
}

const PredictiveAnalytics = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('/api/monitoring/predictions', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch predictions');
        }
        
        const data = await response.json();
        setPredictions(data.predictions);
        
        if (data.predictions.length > 0 && !selectedMetric) {
          setSelectedMetric(data.predictions[0].metric);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
    const interval = setInterval(fetchPredictions, 300000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, [user]);

  const MetricCard = ({ prediction }: { prediction: PredictionData }) => {
    const getTrendIcon = () => {
      switch (prediction.trend) {
        case 'increasing':
          return <TrendingUp className="w-5 h-5 text-red-500" />;
        case 'decreasing':
          return <TrendingDown className="w-5 h-5 text-green-500" />;
        default:
          return <Minus className="w-5 h-5 text-gray-500" />;
      }
    };

    const getStatusColor = () => {
      if (prediction.predicted_value >= prediction.critical_threshold) {
        return 'bg-red-100 border-red-500';
      } else if (prediction.predicted_value >= prediction.warning_threshold) {
        return 'bg-yellow-100 border-yellow-500';
      }
      return 'bg-green-100 border-green-500';
    };

    return (
      <div
        className={`p-4 rounded-lg border-l-4 ${getStatusColor()} cursor-pointer
          ${selectedMetric === prediction.metric ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => setSelectedMetric(prediction.metric)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium capitalize">
              {prediction.metric.replace('_', ' ')}
            </h4>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold">
                {prediction.predicted_value.toFixed(1)}%
              </span>
              {getTrendIcon()}
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-600">
                Confidence: {(prediction.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          {prediction.time_to_threshold !== null && (
            <div className="flex items-center text-yellow-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {prediction.time_to_threshold}h until critical
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DetailedPrediction = ({ prediction }: { prediction: PredictionData }) => {
    const [seasonality, setSeasonality] = useState(null);
    const [anomalies, setAnomal