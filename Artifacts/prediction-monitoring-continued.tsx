import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, CPU, Database, Clock, TrendingUp, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PredictionSystemMonitor = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // ... (previous code)

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
            <p className="text-xs text-gray-500 mt-1">
              Root Mean Square Error
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium">R²</h4>
            <p className="text-2xl font-bold mt-1">
              {metrics?.model_performance.r2.toFixed(3)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Coefficient of Determination
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium">MAPE</h4>
            <p className="text-2xl font-bold mt-1">
              {metrics?.model_performance.mape.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Mean Absolute Percentage Error
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium">Theil's U</h4>
            <p className="text-2xl font-bold mt-1">
              {metrics?.model_performance.theil_u.toFixed(3)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Forecast Accuracy Index
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-4">Performance Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics?.performance_history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rmse"
                name="RMSE"
                stroke="#3B82F6"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mape"
                name="MAPE"
                stroke="#10B981"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const FeatureImportance = () => (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Feature Importance</CardTitle>
          <BarChart2 className="w-5 h-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={metrics?.feature_importance}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="feature"
              tickFormatter={(feature) => feature.replace('_', ' ')}
            />
            <Tooltip />
            <Bar
              dataKey="importance"
              fill="#3B82F6"
              name="Importance Score"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const SystemResources = () => (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>System Resources</CardTitle>
          <CPU className="w-5 h-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium">Prediction Latency</h4>
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Average</span>
                <span className="text-sm font-medium">
                  {metrics?.system_resources.prediction_latency.avg.toFixed(2)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">95th Percentile</span>
                <span className="text-sm font-medium">
                  {metrics?.system_resources.prediction_latency.p95.toFixed(2)}ms
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium">Memory Usage</h4>
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Current</span>
                <span className="text-sm font-medium">
                  {formatBytes(metrics?.system_resources.memory_usage.current)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Peak</span>
                <span className="text-sm font-medium">
                  {formatBytes(metrics?.system_resources.memory_usage.peak)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium">Cache Statistics</h4>
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Hit Rate</span>
                <span className="text-sm font-medium">
                  {(metrics?.system_resources.cache_stats.hit_rate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Size</span>
                <span className="text-sm font-medium">
                  {formatBytes(metrics?.system_resources.cache_stats.size)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-4">Resource Usage Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics?.resource_history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                labelFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="latency"
                name="Latency (ms)"
                stroke="#3B82F6"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="memory"
                name="Memory Usage (MB)"
                stroke="#10B981"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const PredictionQuality = () => (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Prediction Quality</CardTitle>
          <TrendingUp className="w-5 h-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Accuracy Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics?.prediction_quality.accuracy_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  name="Predictions"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Error Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics?.prediction_quality.error_distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#EF4444"
                  name="Errors"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium">Accuracy</h4>
            <p className="text-2xl font-bold mt-1">
              {(metrics?.prediction_quality.overall_accuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium">Confidence</h4>
            <p className="text-2xl font-bold mt-1">
              {(metrics?.prediction_quality.average_confidence * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium">Outliers</h4>
            <p className="text-2xl font-bold mt-1">
              {metrics?.prediction_quality.outlier_rate.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium">Data Quality</h4>
            <p className="text-2xl font-bold mt-1">
              {(metrics?.prediction_quality.data_quality_score * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Prediction System Monitor</h1>
          <p className="text-gray-600">
            Real-time monitoring of prediction system performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Last updated: {format(new Date(), 'HH:mm:ss')}
          </span>
          <Clock className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      <ModelPerformance />
      <FeatureImportance />
      <SystemResources />
      <PredictionQuality />
    </div>
  );
};

export default PredictionSystemMonitor;