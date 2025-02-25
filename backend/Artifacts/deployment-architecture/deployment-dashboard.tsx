import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Server, GitBranch, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const ModelDeploymentDashboard = () => {
  const { user } = useAuth();
  const [deployments, setDeployments] = useState([]);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deploymentsRes, metricsRes] = await Promise.all([
          fetch('/api/monitoring/deployments', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          }),
          fetch('/api/monitoring/health-metrics', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          })
        ]);

        if (!deploymentsRes.ok || !metricsRes.ok) {
          throw new Error('Failed to fetch deployment data');
        }

        const [deploymentData, metricsData] = await Promise.all([
          deploymentsRes.json(),
          metricsRes.json()
        ]);

        setDeployments(deploymentData.deployments);
        setHealthMetrics(metricsData);

        if (!selectedDeployment && deploymentData.deployments.length > 0) {
          setSelectedDeployment(deploymentData.deployments[0].deployment_id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [user, selectedDeployment]);

  const DeploymentStatus = ({ deployment }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed':
          return 'text-green-500';
        case 'in_progress':
          return 'text-blue-500';
        case 'failed':
          return 'text-red-500';
        default:
          return 'text-gray-500';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'completed':
          return <Server className="w-5 h-5" />;
        case 'in_progress':
          return <Play className="w-5 h-5" />;
        case 'failed':
          return <AlertTriangle className="w-5 h-5" />;
        default:
          return <Activity className="w-5 h-5" />;
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <span className={getStatusColor(deployment.status)}>
          {getStatusIcon(deployment.status)}
        </span>
        <span className="capitalize">{deployment.status.replace('_', ' ')}</span>
      </div>
    );
  };

  const DeploymentControls = ({ deployment }) => {
    const handleRollback = async () => {
      if (!confirm('Are you sure you want to rollback this deployment?')) return;
      
      try {
        const response = await fetch(`/api/monitoring/deployments/${deployment.deployment_id}/rollback`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to initiate rollback');
        }

        // Refresh data
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    };

    const handlePause = async () => {
      try {
        const response = await fetch(`/api/monitoring/deployments/${deployment.deployment_id}/pause`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to pause deployment');
        }

        // Refresh data
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <div className="flex space-x-2">
        {deployment.status === 'in_progress' && (
          <button
            onClick={handlePause}
            className="p-2 text-yellow-500 hover:text-yellow-700"
            title="Pause Deployment"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}
        {deployment.status !== 'failed' && (
          <button
            onClick={handleRollback}
            className="p-2 text-red-500 hover:text-red-700"
            title="Rollback Deployment"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  const HealthMetricsChart = ({ metrics }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
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
                dataKey="response_time"
                name="Response Time (ms)"
                stroke="#3B82F6"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="error_rate"
                name="Error Rate (%)"
                stroke="#EF4444"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="health_score"
                name="Health Score"
                stroke="#10B981"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const DeploymentStages = ({ deployment }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Deployment Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deployment.stages.map((stage, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                stage.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : stage.status === 'in_progress'
                  ? 'bg-blue-50 border-blue-200'
                  : stage.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{stage.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {stage.description}
                  </p>
                  {stage.error && (
                    <p className="text-sm text-red-600 mt-1">
                      Error: {stage.error}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <DeploymentStatus deployment={{ status: stage.status }} />
                  <span className="text-sm text-gray-500 block mt-1">
                    {format(new Date(stage.timestamp), 'HH:mm:ss')}
                  </span>
                </div>
              </div>
              {stage.metrics && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {Object.entries(stage.metrics).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-600 capitalize">
                        {key.replace('_', ' ')}:
                      </span>{' '}
                      <span className="font-medium">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const PerformanceComparison = ({ deployment }) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Response Time</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deployment.performance_comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="version" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="response_time"
                  fill="#3B82F6"
                  name="Response Time (ms)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">Error Rate</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deployment.performance_comparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="version" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="error_rate"
                  fill="#EF4444"
                  name="Error Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
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

  const selectedDeploymentData = deployments.find(
    d => d.deployment_id === selectedDeployment
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Model Deployment Monitor</h1>
          <p className="text-gray-600">
            Monitor and manage model deployments
          </p>
        </div>
        <GitBranch className="w-6 h-6 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {deployments.map((deployment) => (
          <Card
            key={deployment.deployment_id}
            className={`cursor-pointer ${
              selectedDeployment === deployment.deployment_id
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
            onClick={() => setSelectedDeployment(deployment.deployment_id)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    Version {deployment.version_id}
                  </h3>
                  <DeploymentStatus deployment={deployment} />
                </div>
                <DeploymentControls deployment={deployment} />
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Started</p>
                    <p className="font-medium">
                      {format(new Date(deployment.started_at), 'MMM d, HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Health Score</p>
                    <p className="font-medium">
                      {(deployment.health_score * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDeploymentData && (
        <>
          <HealthMetricsChart metrics={healthMetrics} />
          <DeploymentStages deployment={selectedDeploymentData} />
          <PerformanceComparison deployment={selectedDeploymentData} />
        </>
      )}
    </div>
  );
};

export default ModelDeploymentDashboard;