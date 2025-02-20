import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import useWebSocket from 'react-use-websocket';

const RealtimeMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  // WebSocket connection
  const { lastMessage, readyState } = useWebSocket('ws://localhost:8000/ws/metrics', {
    onOpen: () => console.log('WebSocket connected'),
    onError: () => setError('WebSocket connection error'),
    shouldReconnect: (closeEvent) => true,
  });

  // Update metrics when new WebSocket message arrives
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

  // Fetch alerts periodically
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
    const interval = setInterval(fetchAlerts, 30000); // Fetch every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const renderAgentLoad = () => {
    if (!metrics?.current_load) return null;

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Current Agent Load</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(metrics.current_load).map(([agent, load]) => (
              <div key={agent} className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">
                  {agent.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </h3>
                <div className="relative h-2 bg-gray-200 rounded">
                  <div 
                    className="absolute h-full bg-blue-500 rounded"
                    style={{ width: `${load * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {(load * 100).toFixed(1)}% Load
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      