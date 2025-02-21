import React, { useCallback, useEffect, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { useDeployment } from '@/contexts/DeploymentContext';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { diffJson } from 'diff';

// Type-safe interfaces for configuration changes
interface ConfigDiff {
  path: string;
  oldValue: unknown;
  newValue: unknown;
  diffType: 'added' | 'removed' | 'modified';
}

interface AgentStatus {
  agentId: string;
  status: 'online' | 'offline' | 'updating';
  lastHeartbeat: Date;
  currentLoad: number;
  pendingUpdates: boolean;
}

interface ConfigurationChange {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  changes: ConfigDiff[];
  status: 'pending' | 'applied' | 'failed' | 'rolled_back';
  environment: 'development' | 'staging' | 'production';
  agentStatuses: Record<string, AgentStatus>;
  error?: string;
  rollbackReason?: string;
}

const ConfigurationMonitor: React.FC = () => {
  const { config } = useDeployment();
  const [changes, setChanges] = useState<ConfigurationChange[]>([]);
  const [selectedChange, setSelectedChange] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized query for configuration changes
  const changesQuery = useMemo(() => 
    query(
      collection(db, 'configChanges'),
      where('environment', '==', config?.environment || 'development'),
      orderBy('timestamp', 'desc'),
      limit(20)
    ),
    [config?.environment]
  );

  // Subscribe to configuration changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      changesQuery,
      {
        next: (snapshot) => {
          const newChanges = snapshot.docs.map(doc => transformChangeDoc(doc));
          setChanges(newChanges);
          setLoading(false);
        },
        error: (err) => {
          setError(`Error fetching configuration changes: ${err.message}`);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [changesQuery]);

  // Transform Firestore document to strongly-typed change object
  const transformChangeDoc = useCallback((
    doc: QueryDocumentSnapshot<DocumentData>
  ): ConfigurationChange => {
    const data = doc.data();
    return {
      id: doc.id,
      timestamp: data.timestamp.toDate(),
      userId: data.userId,
      userName: data.userName,
      changes: data.changes.map((change: any) => ({
        path: change.path,
        oldValue: change.oldValue,
        newValue: change.newValue,
        diffType: calculateDiffType(change.oldValue, change.newValue)
      })),
      status: data.status,
      environment: data.environment,
      agentStatuses: transformAgentStatuses(data.agentStatuses),
      error: data.error,
      rollbackReason: data.rollbackReason
    };
  }, []);

  // Calculate diff type for configuration changes
  const calculateDiffType = (oldValue: unknown, newValue: unknown): ConfigDiff['diffType'] => {
    if (oldValue === undefined) return 'added';
    if (newValue === undefined) return 'removed';
    return 'modified';
  };

  // Transform agent statuses to strongly-typed format
  const transformAgentStatuses = (
    statuses: Record<string, any>
  ): Record<string, AgentStatus> => {
    return Object.entries(statuses).reduce((acc, [agentId, status]) => ({
      ...acc,
      [agentId]: {
        agentId,
        status: status.status,
        lastHeartbeat: new Date(status.lastHeartbeat),
        currentLoad: status.currentLoad,
        pendingUpdates: status.pendingUpdates
      }
    }), {});
  };

  const DiffView: React.FC<{ change: ConfigDiff }> = ({ change }) => {
    const diff = useMemo(() => 
      diffJson(
        JSON.stringify(change.oldValue, null, 2),
        JSON.stringify(change.newValue, null, 2)
      ),
      [change]
    );

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium font-mono">{change.path}</p>
        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          {diff.map((part, index) => (
            <pre
              key={index}
              className={`${
                part.added
                  ? 'text-green-600 bg-green-50'
                  : part.removed
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-700'
              } font-mono text-sm`}
            >
              {part.value}
            </pre>
          ))}
        </div>
      </div>
    );
  };

  const AgentStatusBadge: React.FC<{ status: AgentStatus }> = ({ status }) => {
    const getStatusColor = () => {
      switch (status.status) {
        case 'online':
          return 'bg-green-100 text-green-800';
        case 'offline':
          return 'bg-red-100 text-red-800';
        case 'updating':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status.status === 'updating' && (
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        )}
        {status.status}
        {status.currentLoad > 0 && (
          <span className="ml-1">({Math.round(status.currentLoad * 100)}%)</span>
        )}
      </div>
    );
  };

  const ChangeDetails: React.FC<{ change: ConfigurationChange }> = ({ change }) => (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Change Details</CardTitle>
          <div className="flex items-center space-x-2">
            {Object.values(change.agentStatuses).map(status => (
              <AgentStatusBadge key={status.agentId} status={status} />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {change.changes.map((diff, index) => (
            <DiffView key={index} change={diff} />
          ))}
          
          {change.error && (
            <Alert variant="destructive">
              <AlertDescription>
                Error: {change.error}
                {change.rollbackReason && (
                  <div className="mt-2">
                    Rollback reason: {change.rollbackReason}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {changes.map(change => (
          <Card
            key={change.id}
            className={`cursor-pointer transition-shadow hover:shadow-md ${
              selectedChange === change.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedChange(
              selectedChange === change.id ? null : change.id
            )}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon status={change.status} />
                    <span className="font-medium">
                      Configuration Change
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    By {change.userName} at {format(change.timestamp, 'MMM d, HH:mm:ss')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getEnvironmentVariant(change.environment)}>
                    {change.environment}
                  </Badge>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      selectedChange === change.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
              
              {selectedChange === change.id && (
                <ChangeDetails change={change} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationMonitor;