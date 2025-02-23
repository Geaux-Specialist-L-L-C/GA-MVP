import React, { useState, useEffect } from 'react';
import { useFirestore } from 'reactfire';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdvancedAgents } from '../hooks/useAdvancedAgents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Users, Brain, AlertTriangle, BarChart, RefreshCw } from 'lucide-react';
import type { AgentPerformance, TaskResult } from '../types/agents';

interface AgentMonitorProps {
  onTaskComplete: (results: TaskResult[]) => void;
}

export const AgentMonitor: React.FC<AgentMonitorProps> = ({
  onTaskComplete
}) => {
  const [activeTab, setActiveTab] = useState<string>('performance');
  const [agentPerformance, setAgentPerformance] = useState<Record<string, AgentPerformance>>({});
  const [taskHistory, setTaskHistory] = useState<TaskResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const firestore = useFirestore();
  const crewAI = useCrewAI();  // Custom hook for CrewAI client

  const {
    executeComplexTask,
    enhanceAgentKnowledge,
    getAgentPerformance
  } = useAdvancedAgents(firestore, crewAI);

  