// File: /src/hooks/useDeploymentConfig.ts
import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

// Type-safe configuration schema
export const agentConfigSchema = z.object({
  teacherAgent: z.object({
    maxConcurrent: z.number().min(1).max(10),
    batchSize: z.number().min(1).max(100),
    timeoutMs: z.number().min(1000).max(30000)
  }),
  researchAgent: z.object({
    maxConcurrent: z.number().min(1).max(5),
    validationDepth: z.number().min(1).max(3),
    timeoutMs: z.number().min(1000).max(30000)
  }),
  supervisorAgent: z.object({
    reviewThreshold: z.number().min(0.1).max(1),
    escalationTriggers: z.array(z.string()),
    timeoutMs: z.number().min(1000).max(30000)
  })
});

export type AgentConfig = z.infer<typeof agentConfigSchema>;

export const deploymentConfigSchema = z.object({
  version: z.string(),
  environment: z.enum(['development', 'staging', 'production']),
  agents: agentConfigSchema,
  deployment: z.object({
    batchSize: z.number().min(1).max(1000),
    warmUpIterations: z.number().min(100).max(10000),
    healthCheckInterval: z.number().min(30).max(3600),
    thresholds: z.object({
      performance: z.number().min(0).max(1),
      rollback: z.number().min(0).max(1),
      latency: z.number().min(0).max(10000),
      memory: z.number().min(0).max(100000)
    }),
    resources: z.object({
      maxConcurrent: z.number().min(1).max(100),
      maxMemory: z.number().min(128).max(32768),
      maxCpu: z.number().min(0.1).max(8)
    }),
    enableRollback: z.boolean(),
    gradualDeployment: z.boolean()
  }),
  security: z.object({
    rateLimit: z.number().min(1).max(1000),
    tokenExpiration: z.number().min(300).max(86400),
    allowedOrigins: z.array(z.string()),
    requireAuth: z.boolean()
  })
});

export type DeploymentConfig = z.infer<typeof deploymentConfigSchema>;

interface UseDeploymentConfigReturn {
  config: DeploymentConfig | null;
  loading: boolean;
  error: Error | null;
  updateConfig: (updates: Partial<DeploymentConfig>) => Promise<void>;
  validateConfig: (config: DeploymentConfig) => boolean;
  resetConfig: () => Promise<void>;
}

export const useDeploymentConfig = (): UseDeploymentConfigReturn => {
  const { user } = useAuth();
  const [config, setConfig] = useState<DeploymentConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to real-time config updates
  useEffect(() => {
    if (!user) return;

    const configRef = doc(db, 'deploymentConfig', 'current');
    
    const unsubscribe = onSnapshot(configRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          try {
            const data = deploymentConfigSchema.parse(snapshot.data());
            setConfig(data);
          } catch (err) {
            setError(new Error('Invalid configuration schema'));
          }
        }
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Update configuration
  const updateConfig = useCallback(async (
    updates: Partial<DeploymentConfig>
  ): Promise<void> => {
    if (!user) throw new Error('Not authenticated');

    try {
      const configRef = doc(db, 'deploymentConfig', 'current');
      const mergedConfig = { ...config, ...updates };
      
      // Validate complete config
      deploymentConfigSchema.parse(mergedConfig);
      
      // Update in Firestore
      await updateDoc(configRef, updates);
      
      // Update local agents
      await updateAgentConfigs(mergedConfig.agents);
      
    } catch (err) {
      throw new Error(`Failed to update config: ${err.message}`);
    }
  }, [user, config]);

  // Validate configuration
  const validateConfig = useCallback((
    configToValidate: DeploymentConfig
  ): boolean => {
    try {
      deploymentConfigSchema.parse(configToValidate);
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  // Reset configuration to defaults
  const resetConfig = useCallback(async (): Promise<void> => {
    if (!user) throw new Error('Not authenticated');

    try {
      const defaultConfig: DeploymentConfig = {
        version: '1.0.0',
        environment: 'development',
        agents: {
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
        },
        deployment: {
          batchSize: 100,
          warmUpIterations: 1000,
          healthCheckInterval: 60,
          thresholds: {
            performance: 0.8,
            rollback: 0.6,
            latency: 1000,
            memory: 1024
          },
          resources: {
            maxConcurrent: 10,
            maxMemory: 2048,
            maxCpu: 2
          },
          enableRollback: true,
          gradualDeployment: true
        },
        security: {
          rateLimit: 100,
          tokenExpiration: 3600,
          allowedOrigins: ['https://geaux-academy.com'],
          requireAuth: true
        }
      };

      const configRef = doc(db, 'deploymentConfig', 'current');
      await updateDoc(configRef, defaultConfig);
      
      // Reset agent configurations
      await updateAgentConfigs(defaultConfig.agents);
      
    } catch (err) {
      throw new Error(`Failed to reset config: ${err.message}`);
    }
  }, [user]);

  return {
    config,
    loading,
    error,
    updateConfig,
    validateConfig,
    resetConfig
  };
};

// File: /src/contexts/DeploymentContext.tsx
import React, { createContext, useContext } from 'react';
import { useDeploymentConfig, DeploymentConfig } from '@/hooks/useDeploymentConfig';

interface DeploymentContextType {
  config: DeploymentConfig | null;
  loading: boolean;
  error: Error | null;
  updateConfig: (updates: Partial<DeploymentConfig>) => Promise<void>;
  validateConfig: (config: DeploymentConfig) => boolean;
  resetConfig: () => Promise<void>;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

export const DeploymentProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const deploymentConfig = useDeploymentConfig();

  return (
    <DeploymentContext.Provider value={deploymentConfig}>
      {children}
    </DeploymentContext.Provider>
  );
};

export const useDeployment = () => {
  const context = useContext(DeploymentContext);
  if (context === undefined) {
    throw new Error('useDeployment must be used within a DeploymentProvider');
  }
  return context;
};

// File: /src/utils/agent-config.ts
import { AgentConfig } from '@/hooks/useDeploymentConfig';

export async function updateAgentConfigs(
  agentConfig: AgentConfig
): Promise<void> {
  try {
    // Update Teacher Agent configuration
    await updateTeacherAgent(agentConfig.teacherAgent);
    
    // Update Research Agent configuration
    await updateResearchAgent(agentConfig.researchAgent);
    
    // Update Supervisor Agent configuration
    await updateSupervisorAgent(agentConfig.supervisorAgent);
    
  } catch (err) {
    throw new Error(`Failed to update agent configs: ${err.message}`);
  }
}

async function updateTeacherAgent(config: AgentConfig['teacherAgent']): Promise<void> {
  const response = await fetch('/api/agents/teacher/config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });

  if (!response.ok) {
    throw new Error('Failed to update Teacher Agent config');
  }
}

async function updateResearchAgent(config: AgentConfig['researchAgent']): Promise<void> {
  const response = await fetch('/api/agents/research/config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });

  if (!response.ok) {
    throw new Error('Failed to update Research Agent config');
  }
}

async function updateSupervisorAgent(config: AgentConfig['supervisorAgent']): Promise<void> {
  const response = await fetch('/api/agents/supervisor/config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });

  if (!response.ok) {
    throw new Error('Failed to update Supervisor Agent config');
  }
}
