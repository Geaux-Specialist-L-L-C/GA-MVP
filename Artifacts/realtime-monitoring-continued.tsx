import React, { useState, useEffect, useCallback } from 'react';
import { Bell, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

// Active Tasks Component
const ActiveTasks = ({ tasks }) => {
  if (!tasks?.length) return null;

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Active Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <h4 className="font-semibold">
                  {task.task_type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h4>
                <p className="text-sm text-gray-600">
                  Agent: {task.agent_type}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Started: {format(new Date(task.start_time), 'HH:mm:ss')}
                </p>
                <div className="animate-pulse h-2 w-20 bg-blue-200 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Alert Notifications Component
const AlertNotifications = ({ alerts }) => {
  const [showAll, setShowAll] = useState(false);
  const displayAlerts = showAll ? alerts : alerts.slice(0, 3);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  if (!alerts?.length) return null;

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Alerts</CardTitle>
          <Bell className="w-5 h-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`flex items-start p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex-shrink-0 mr-3">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">
                  {alert.type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(alert.created_at), 'MMM d, yyyy HH:mm:ss')}
                </p>
              </div>
            </div>
          ))}
          {alerts.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showAll ? 'Show Less' : `Show ${alerts.length - 3} More Alerts`}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Performance Metrics Component
const PerformanceMetrics = ({ metrics }) => {
  if (!metrics) return null;

  const formatValue = (value, type) => {
    switch (type) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'time':
        return `${value.toFixed(2)}s`;
      default:
        return value.toString();
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>System Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.response_times.map(metric => (
            <div 
              key={metric.agent_type}
              className="p-4 bg-white rounded-lg shadow"
            >
              <h4 className="text-sm font-medium text-gray-600">
                {metric.agent_type.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h4>
              <p className="mt-1 text-2xl font-semibold">
                {formatValue(metric.average_duration, 'time')}
              </p>
              <p className="text-xs text-gray-500">Average Response Time</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component (Updated)
const MonitoringDashboard = () => {
  const { lastMessage, metrics, alerts, error } = useMonitoringData();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Monitoring</h1>
        <p className="text-gray-600">
          Last Updated: {metrics?.timestamp ? 
            format(new Date(metrics.timestamp), 'MMM d, yyyy HH:mm:ss') : 
            'Connecting...'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AlertNotifications alerts={alerts} />
        <PerformanceMetrics metrics={metrics} />
        <ActiveTasks tasks={metrics?.active_tasks} />
      </div>
    </div>
  );
};

// Custom hook for monitoring data
const useMonitoringData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  const { lastMessage, readyState } = useWebSocket(`ws://localhost:8000/ws/metrics`, {
    onOpen: () => console.log('WebSocket connected'),
    onError: () => setError('WebSocket connection error'),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          ...data.metrics,
          timestamp: data.timestamp
        }));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    }
  }, [lastMessage]);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/monitoring/alerts', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch alerts');
        }
        
        const data = await response.json();
        setAlerts(data.alerts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return { lastMessage, metrics, alerts, error };
};

export default MonitoringDashboard;
