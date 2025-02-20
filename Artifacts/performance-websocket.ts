// File: /src/hooks/usePerformanceWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PerformanceUpdate {
  type: 'metrics' | 'bottleneck' | 'response';
  data: any;
  timestamp: string;
}

export const usePerformanceWebSocket = () => {
  const { user } = useAuth();
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [updates, setUpdates] = useState<PerformanceUpdate[]>([]);

  const connect = useCallback(async () => {
    if (!user) return;

    const token = await user.getIdToken();
    const ws = new WebSocket(`ws://localhost:8000/ws/performance?token=${token}`);

    ws.onopen = () => {
      console.log('Performance WebSocket connected');
      setConnected(true);
    };

    ws.onclose = () => {
      console.log('Performance WebSocket disconnected');
      setConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    ws.onerror = (error) => {
      console.error('Performance WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const update: PerformanceUpdate = JSON.parse(event.data);
        setUpdates(prev => [...prev, update].slice(-100)); // Keep last 100 updates
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, [user]);

  useEffect(() => {
    connect();
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (websocket && connected) {
      websocket.send(JSON.stringify(message));
    }
  }, [websocket, connected]);

  return {
    connected,
    updates,
    sendMessage
  };
};

// File: /src/components/RealTimePerformance.tsx
import React from 'react';
import { usePerformanceWebSocket } from '@/hooks/usePerformanceWebSocket';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Wifi, WifiOff } from 'lucide-react';

interface RealTimeUpdateProps {
  update: PerformanceUpdate;
}

const RealTimeUpdate: React.FC<RealTimeUpdateProps> = ({ update }) => {
  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'metrics':
        return 'bg-blue-50 border-blue-200';
      case 'bottleneck':
        return 'bg-yellow-50 border-yellow-200';
      case 'response':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getUpdateColor(update.type)}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-sm font-medium capitalize">
            {update.type} Update
          </span>
          <p className="text-sm text-gray-600 mt-1">
            {JSON.stringify(update.data, null, 2)}
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {format(new Date(update.timestamp), 'HH:mm:ss')}
        </span>
      </div>
    </div>
  );
};

const RealTimePerformance: React.FC = () => {
  const { connected, updates } = usePerformanceWebSocket();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Real-Time Updates</CardTitle>
          <div className="flex items-center">
            {connected ? (
              <>
                <Wifi className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-green-500">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-red-500">Disconnected</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {updates.map((update, index) => (
            <RealTimeUpdate key={index} update={update} />
          ))}
          {updates.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              No updates yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePerformance;
