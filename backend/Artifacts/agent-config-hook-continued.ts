// File: /src/hooks/useAgentConfigStatus.ts (continued)

    return () => unsubscribe();
  }, [config]);

  // Utility function to check agent health
  const checkAgentHealth = useCallback((status: AgentConfigStatus): boolean => {
    if (!status.lastHeartbeat) return false;

    const heartbeatAge = Date.now() - status.lastHeartbeat.timestamp.getTime();
    const isHeartbeatRecent = heartbeatAge < 30000; // 30 seconds
    const isHealthy = status.lastHeartbeat.status === 'healthy';
    const hasAcceptableMetrics = 
      status.lastHeartbeat.metrics.errorRate < 0.1 && // Less than 10% errors
      status.lastHeartbeat.metrics.queueLength < 100; // Less than 100 queued requests

    return isHeartbeatRecent && isHealthy && hasAcceptableMetrics;
  }, []);

  // Update agent configuration
  const updateAgentConfig = useCallback(async (
    agentId: string,
    configUpdates: Partial<AgentConfig>
  ): Promise<void> => {
    if (!config) throw new Error('No active configuration');

    try {
      const agentRef = doc(db, 'agentConfigStatus', agentId);
      
      // Update pending configuration
      await updateDoc(agentRef, {
        pendingConfig: configUpdates,
        updateStatus: 'updating',
        lastUpdateAttempt: Timestamp.now()
      });

      // Notify agent through messaging system
      await notifyAgentUpdate(agentId, config.version);
      
    } catch (err) {
      throw new Error(`Failed to update agent config: ${err.message}`);
    }
  }, [config]);

  // Reset agent configuration to defaults
  const resetAgentConfig = useCallback(async (
    agentId: string
  ): Promise<void> => {
    if (!config) throw new Error('No active configuration');

    try {
      const defaultConfig = getDefaultAgentConfig(agentId);
      await updateAgentConfig(agentId, defaultConfig);
    } catch (err) {
      throw new Error(`Failed to reset agent config: ${err.message}`);
    }
  }, [config, updateAgentConfig]);

  // Verify agent configuration synchronization
  const verifyAgentSync = useCallback(async (
    agentId: string
  ): Promise<boolean> => {
    const status = agentStatuses[agentId];
    if (!status || !status.lastHeartbeat) return false;

    // Check configuration version match
    const versionMatch = status.lastHeartbeat.configVersion === config?.version;
    
    // Check configuration content match
    const configMatch = deepEqual(
      status.currentConfig,
      config?.agents[agentId as keyof typeof config.agents]
    );

    return versionMatch && configMatch;
  }, [agentStatuses, config]);

  // Monitor agent configuration updates
  const monitorAgentUpdates = useCallback(async (
    agentId: string,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(async () => {
        try {
          const isInSync = await verifyAgentSync(agentId);
          const status = agentStatuses[agentId];

          if (isInSync) {
            clearInterval(interval);
            resolve();
          } else if (status?.updateStatus === 'error') {
            clearInterval(interval);
            reject(new Error(status.error || 'Unknown error during update'));
          } else if (++attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error('Update timeout exceeded'));
          } else if (onProgress) {
            onProgress((attempts / maxAttempts) * 100);
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 3000); // Check every 3 seconds
    });
  }, [agentStatuses, verifyAgentSync]);

  // Utility function to notify agent of configuration update
  const notifyAgentUpdate = async (
    agentId: string,
    configVersion: string
  ): Promise<void> => {
    try {
      const notification = {
        type: 'config_update',
        agentId,
        configVersion,
        timestamp: Timestamp.now()
      };

      await addDoc(collection(db, 'agentNotifications'), notification);
    } catch (err) {
      throw new Error(`Failed to notify agent: ${err.message}`);
    }
  };

  // Get default configuration for agent type
  const getDefaultAgentConfig = (agentId: string): Partial<AgentConfig> => {
    const defaults: Record<string, Partial<AgentConfig>> = {
      teacherAgent: {
        maxConcurrent: 5,
        batchSize: 50,
        timeoutMs: 5000
      },
      researchAgent: {
        maxConcurrent: 2,
        validationDepth: 2,
        timeoutMs: 10000
      },
      supervisorAgent: {
        reviewThreshold: 0.8,
        escalationTriggers: ['error_rate', 'latency'],
        timeoutMs: 15000
      }
    };

    return defaults[agentId] || {};
  };

  // Deep equality check for configuration objects
  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    if (!obj1 || !obj2) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
  };

  // Expose hook interface
  return {
    agentStatuses,
    loading,
    error,
    updateAgentConfig,
    resetAgentConfig,
    verifyAgentSync,
    monitorAgentUpdates,
    checkAgentHealth
  };
};

// File: /src/components/AgentConfigurationPanel.tsx
import React, { useState, useCallback } from 'react';
import { useAgentConfigStatus } from '@/hooks/useAgentConfigStatus';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Check, AlertTriangle } from 'lucide-react';

interface AgentConfigPanelProps {
  agentId: string;
  onConfigChange?: (config: Partial<AgentConfig>) => void;
}

export const AgentConfigurationPanel: React.FC<AgentConfigPanelProps> = ({
  agentId,
  onConfigChange
}) => {
  const {
    agentStatuses,
    loading,
    error,
    updateAgentConfig,
    resetAgentConfig,
    checkAgentHealth
  } = useAgentConfigStatus();

  const [updateProgress, setUpdateProgress] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  const handleConfigUpdate = useCallback(async (
    config: Partial<AgentConfig>
  ) => {
    try {
      setUpdating(true);
      await updateAgentConfig(agentId, config);
      
      // Monitor update progress
      await monitorAgentUpdates(agentId, (progress) => {
        setUpdateProgress(progress);
      });

      onConfigChange?.(config);
    } catch (err) {
      console.error('Error updating agent config:', err);
    } finally {
      setUpdating(false);
      setUpdateProgress(0);
    }
  }, [agentId, updateAgentConfig, monitorAgentUpdates, onConfigChange]);

  const handleReset = useCallback(async () => {
    try {
      setUpdating(true);
      await resetAgentConfig(agentId);
    } catch (err) {
      console.error('Error resetting agent config:', err);
    } finally {
      setUpdating(false);
    }
  }, [agentId, resetAgentConfig]);

  const status = agentStatuses[agentId];
  const isHealthy = status ? checkAgentHealth(status) : false;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

  if (!status) {
    return (
      <Alert>
        <AlertDescription>No configuration found for agent</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {agentId} Configuration
            {isHealthy ? (
              <Check className="inline-block ml-2 w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="inline-block ml-2 w-5 h-5 text-yellow-500" />
            )}
          </CardTitle>
          <button
            onClick={handleReset}
            disabled={updating}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <RefreshCw className={`w-5 h-5 ${updating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Agent configuration form content */}
      </CardContent>
    </Card>
  );
};
