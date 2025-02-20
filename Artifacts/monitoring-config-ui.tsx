import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ConfigurationPanel = () => {
  const { user } = useAuth();
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const agentTypes = [
    'teacher_agent',
    'research_agent',
    'supervisor_agent'
  ];

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const configPromises = agentTypes.map(async (agentType) => {
        const response = await fetch(`/api/config/${agentType}`, {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load config for ${agentType}`);
        }
        
        const config = await response.json();
        return [agentType, config];
      });
      
      const results = await Promise.all(configPromises);
      setConfigs(Object.fromEntries(results));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (agentType, updatedConfig) => {
    try {
      setSaveStatus({ type: 'loading', message: 'Saving changes...' });
      
      const response = await fetch(`/api/config/${agentType}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedConfig)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }
      
      setConfigs(prev => ({
        ...prev,
        [agentType]: updatedConfig
      }));
      
      setSaveStatus({
        type: 'success',
        message: 'Configuration saved successfully'
      });
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: `Error saving configuration: ${err.message}`
      });
    } finally {
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleReset = async (agentType) => {
    try {
      setSaveStatus({ type: 'loading', message: 'Resetting configuration...' });
      
      const response = await fetch(`/api/config/${agentType}/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset configuration');
      }
      
      const defaultConfig = await response.json();
      setConfigs(prev => ({
        ...prev,
        [agentType]: defaultConfig
      }));
      
      setSaveStatus({
        type: 'success',
        message: 'Configuration reset to defaults'
      });
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: `Error resetting configuration: ${err.message}`
      });
    }
  };

  const ThresholdInput = ({ label, value, onChange, warning = false }) => (
    <div className="flex items-center space-x-4 mb-4">
      <label className="w-40 text-sm font-medium">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-24 p-2 border rounded ${
          warning ? 'border-yellow-500' : 'border-gray-300'
        }`}
        step="0.01"
      />
    </div>
  );

  const AgentConfigCard = ({ agentType, config }) => (
    <Card className="w-full mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {agentType.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </CardTitle>
          <div className="flex space-x-2">
            <button
              onClick={() => handleReset(agentType)}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Reset to defaults"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleConfigUpdate(agentType, config)}
              className="p-2 text-blue-500 hover:text-blue-700"
              title="Save changes"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Response Time</h3>
            <ThresholdInput
              label="Warning Threshold (s)"
              value={config.response_time.warning}
              onChange={(value) => {
                const updated = {
                  ...config,
                  response_time: {
                    ...config.response_time,
                    warning: value
                  }
                };
                setConfigs(prev => ({
                  ...prev,
                  [agentType]: updated
                }));
              }}
            />
            <ThresholdInput
              label="Critical Threshold (s)"
              value={config.response_time.critical}
              onChange={(value) => {
                const updated = {
                  ...config,
                  response_time: {
                    ...config.response_time,
                    critical: value
                  }
                };
                setConfigs(prev => ({
                  ...prev,
                  [agentType]: updated
                }));
              }}
              warning={true}
            />
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Error Rate</h3>
            <ThresholdInput
              label="Warning Threshold (%)"
              value={config.error_rate.warning * 100}
              onChange={(value) => {
                const updated = {
                  ...config,
                  error_rate: {
                    ...config.error_rate,
                    warning: value / 100
                  }
                };
                setConfigs(prev => ({
                  ...prev,
                  [agentType]: updated
                }));
              }}
            />
            <ThresholdInput
              label="Critical Threshold (%)"
              value={config.error_rate.critical * 100}
              onChange={(value) => {
                const updated = {
                  ...config,
                  error_rate: {
                    ...config.error_rate,
                    critical: value / 100
                  }
                };
                setConfigs(prev => ({
                  ...prev,
                  [agentType]: updated
                }));
              }}
              warning={true}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Resource Usage</h3>
            <ThresholdInput
              label="Memory Warning (%)"
              value={config.memory_usage.warning * 100}
              onChange={(value) => {
                const updated = {
                  ...config,
                  memory_usage: {
                    ...config.memory_usage,
                    warning: value / 100
                  }
                };
                setConfigs(prev => ({
                  ...prev,
                  [agentType]: updated
                }));
              }}
            />
            <ThresholdInput
              label="Memory Critical (%)"
              value={config.memory_usage.critical * 100}
              onChange={(value) => {
                const updated = {
                  ...config,
                  memory_usage: {
                    ...config.memory_usage,
                    critical: value / 100
                  }
                };
                setConfigs(prev => ({
                  ...prev,
                  [agentType]: updated
                }));
              }}
              warning={true}
            />
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
          <h1 className="text-2xl font-bold">Monitoring Configuration</h1>
          <p className="text-gray-600">
            Configure monitoring thresholds and alerts for each agent
          </p>
        </div>
        <Settings className="w-6 h-6 text-gray-500" />
      </div>

      {saveStatus && (
        <Alert
          variant={saveStatus.type === 'error' ? 'destructive' : 'default'}
          className="mb-4"
        >
          <AlertDescription>{saveStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {agentTypes.map(agentType => (
          <AgentConfigCard
            key={agentType}
            agentType={agentType}
            config={configs[agentType]}
          />
        ))}
      </div>
    </div>
  );
};

export default ConfigurationPanel;