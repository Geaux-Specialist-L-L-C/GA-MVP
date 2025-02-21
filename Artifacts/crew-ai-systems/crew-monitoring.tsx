import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { useCrewOrchestration } from '@/hooks/useCrewOrchestration';
import { AgentRole, TaskStatus, TaskDefinition } from '@/lib/crew/types';
import { format } from 'date-fns';

const CrewMonitoringDashboard: React.FC = () => {
  const { orchestrator, loading, error } = useCrewOrchestration();
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentRole, any>>({});
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | null>(null);

  useEffect(() => {
    if (!orchestrator) return;

    // Subscribe to agent statuses
    const unsubscribeStatus = subscribeToAgentStatuses((statuses) => {
      setAgentStatuses(statuses);
    });

    // Subscribe to tasks
    const unsubscribeTasks = subscribeToTasks((updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTasks();
    };
  }, [orchestrator]);

  const AgentCard: React.FC<{ role: AgentRole }> = ({ role }) => {
    const status = agentStatuses[role];
    const activeTasks = tasks.filter(
      task => task.assignedTo === role && task.status === 'IN_PROGRESS'
    );

    return (
      <Card 
        className={`cursor-pointer transition-shadow hover:shadow-md ${
          selectedAgent === role ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => setSelectedAgent(selectedAgent === role ? null : role)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{role}</h3>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  status?.online ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-500 ml-2">
                  {status?.online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {activeTasks.length} Active Tasks
              </p>
              <p className="text-xs text-gray-500">
                {status?.load.toFixed(1)}% Load
              </p>
            </div>
          </div>

          {status?.lastHeartbeat && (
            <p className="text