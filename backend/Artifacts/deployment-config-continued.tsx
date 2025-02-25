import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// TypeScript interfaces for configuration
interface DeploymentThresholds {
  performance: number;
  rollback: number;
  latency: number;
  memory: number;
}

interface ResourceLimits {
  maxConcurrent: number;
  maxMemory: number;
  maxCpu: number;
}

interface DeploymentConfig {
  batchSize: number;
  warmUpIterations: number;
  healthCheckInterval: number;
  thresholds: DeploymentThresholds;
  resources: ResourceLimits;
  enableRollback: boolean;
  gradualDeployment: boolean;
}

// Zod schema for validation
const deploymentConfigSchema = z.object({
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
});

const DeploymentConfiguration: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const { control, handleSubmit, reset, formState: { errors } } = useForm<DeploymentConfig>({
    resolver: zodResolver(deploymentConfigSchema),
    defaultValues: {
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
    }
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/monitoring/deployment-config', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }

        const config = await response.json();
        reset(config);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [user, reset]);

  const onSubmit = async (data: DeploymentConfig) => {
    try {
      setSaveStatus('saving');
      const response = await fetch('/api/monitoring/deployment-config', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      setError(err.message);
    }
  };

  const ConfigurationField: React.FC<{
    name: string;
    label: string;
    description: string;
    type: 'number' | 'checkbox';
    min?: number;
    max?: number;
    step?: number;
  }> = ({ name, label, description, type, min, max, step }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          ) : (
            <input
              type="number"
              {...field}
              min={min}
              max={max}
              step={step}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          )
        )}
      />
      {errors[name as keyof DeploymentConfig] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name as keyof DeploymentConfig]?.message}
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Deployment Configuration</CardTitle>
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Settings</h3>
              <ConfigurationField
                name="batchSize"
                label="Batch Size"
                description="Number of predictions to process in each batch"
                type="number"
                min={1}
                max={1000}
              />
              <ConfigurationField
                name="warmUpIterations"
                label="Warm-up Iterations"
                description="Number of iterations for model warm-up"
                type="number"
                min={100}
                max={10000}
              />
              <ConfigurationField
                name="healthCheckInterval"
                label="Health Check Interval"
                description="Seconds between health checks"
                type="number"
                min={30}
                max={3600}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Thresholds</h3>
              <ConfigurationField
                name="thresholds.performance"
                label="Performance Threshold"
                description="Minimum acceptable performance score (0-1)"
                type="number"
                min={0}
                max={1}
                step={0.1}
              />
              <ConfigurationField
                name="thresholds.rollback"
                label="Rollback Threshold"
                description="Error rate threshold for automatic rollback"
                type="number"
                min={0}
                max={1}
                step={0.1}
              />
              <ConfigurationField
                name="thresholds.latency"
                label="Latency Threshold"
                description="Maximum acceptable response time (ms)"
                type="number"
                min={0}
                max={10000}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Resource Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ConfigurationField
                name="resources.maxConcurrent"
                label="Max Concurrent"
                description="Maximum concurrent predictions"
                type="number"
                min={1}
                max={100}
              />
              <ConfigurationField
                name="resources.maxMemory"
                label="Max Memory (MB)"
                description="Maximum memory usage"
                type="number"
                min={128}
                max={32768}
              />
              <ConfigurationField
                name="resources.maxCpu"
                label="Max CPU Cores"
                description="Maximum CPU cores"
                type="number"
                min={0.1}
                max={8}
                step={0.1}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Deployment Options</h3>
            <div className="space-y-4">
              <ConfigurationField
                name="enableRollback"
                label="Enable Automatic Rollback"
                description="Automatically rollback on error threshold"
                type="checkbox"
              />
              <ConfigurationField
                name="gradualDeployment"
                label="Gradual Deployment"
                description="Gradually increase traffic to new version"
                type="checkbox"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCcw className="w-4 h-4 mr-2 inline-block" />
              Reset
            </button>
            <button
              type="submit"
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2 inline-block" />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {saveStatus === 'success' && (
            <Alert className="mt-4">
              <AlertDescription>
                Configuration saved successfully
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default DeploymentConfiguration;