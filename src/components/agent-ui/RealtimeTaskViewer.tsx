// frontend/src/components/agent-ui/RealtimeTaskViewer.tsx
import React, { useEffect } from 'react';
import { useTaskWebSocket } from '../../hooks/useTaskWebSocket';
import TaskProgressBar from './TaskProgressBar';
import AgentResponseViewer from './AgentResponseViewer';

interface RealtimeTaskViewerProps {
  taskId: string;
  onComplete?: (result: any) => void;
}

export const RealtimeTaskViewer: React.FC<RealtimeTaskViewerProps> = ({
  taskId,
  onComplete
}) => {
  const { isConnected, status, result, error } = useTaskWebSocket(taskId);
  
  useEffect(() => {
    if (result && onComplete) {
      onComplete(result);
    }
  }, [result, onComplete]);
  
  if (error) {
    return (
      <div className="task-error">
        <h3>Error</h3>
        <p>{error.message}</p>
      </div>
    );
  }
  
  return (
    <div className="realtime-task-viewer">
      <div className="connection-status">
        {isConnected ? (
          <span className="status-connected">Connected</span>
        ) : (
          <span className="status-disconnected">Disconnected</span>
        )}
      </div>
      
      {status && (
        <div className="task-status">
          <h3>Task Status: {status.status}</h3>
          <TaskProgressBar status={status} />
          {status.status === 'in_progress' && (
            <div className="agent-messages">
              <p>Our AI agents are collaborating to complete your task:</p>
              <ul>
                <li>Researcher is gathering relevant information</li>
                <li>Teacher is creating personalized curriculum</li>
                <li>Supervisor is ensuring quality and coherence</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {result && (
        <AgentResponseViewer result={result} />
      )}
    </div>
  );
};