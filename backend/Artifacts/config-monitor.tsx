import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { useDeployment } from '@/contexts/DeploymentContext';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

interface ConfigChange {
  id: string;
  timestamp: Date;
  user: string;
  changes: {
    path: string;
    oldValue: any;
    newValue: any;
  }[];
  status: 'pending' | 'applied' | 'failed';
  error?: string;
}

const ConfigurationMonitor: React.FC = () => {
  const { config } = useDeployment();
  const [changes, setChanges] = useState<ConfigChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to configuration changes
    const changesRef = collection(db, 'configChanges');
    const changesQuery = query(
      changesRef,
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(
      changesQuery,
      (snapshot) => {
        const newChanges = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as ConfigChange[];
        
        setChanges(newChanges);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const ConfigChangeCard: React.FC<{ change: ConfigChange }> = ({ change }) => {
    const getStatusIcon = () => {
      switch (change.status) {
        case 'applied':
          return <Check className="w-5 h-5 text-green-500" />;
        case 'failed':
          return <AlertTriangle className="w-5 h-5 text-red-500" />;
        case 'pending':
          return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
        default:
          return <Activity className="w-5 h-5 text-gray-500" />;
      }
    };

    const formatValue = (value: any): string => {
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    };

    return (
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="ml-2 font-medium capitalize">
                {change.status} Change
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              By {change.user} at {format(change.timestamp, 'MMM d, HH:mm:ss')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {change.changes.map((change, index) => (
            <div key={index} className="space-y-2">
              <p className="text-sm font-medium">{change.path}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-2 bg-red-50 rounded">
                  <p className="text-red-700 font-medium">Previous</p>
                  <pre className="mt-1 whitespace-pre-wrap">
                    {formatValue(change.oldValue)}
                  </pre>
                </div>