// frontend/src/hooks/useTaskWebSocket.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TaskStatus, TaskResult } from '../types/task';

export const useTaskWebSocket = (taskId: string | null) => {
  const { getToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [result, setResult] = useState<TaskResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  
  // Function to establish WebSocket connection
  const connect = useCallback(async () => {
    if (!taskId) return;
    
    try {
      // Get authentication token
      const token = await getToken();
      if (!token) throw new Error('Authentication required');
      
      // Create WebSocket connection
      const ws = new WebSocket(`${process.env.REACT_APP_WS_BASE_URL}/ws/tasks/${token}`);
      
      ws.onopen = () => {
        setIsConnected(true);
        // Subscribe to task status updates
        if (taskId) {
          ws.send(JSON.stringify({
            type: 'subscribe_task',
            task_id: taskId
          }));
        }
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'subscription_ack':
            console.log(`Subscribed to updates for task ${data.task_id}`);
            break;
          
          case 'task_update':
            setStatus(data.status);
            break;
          
          case 'task_result':
            setResult(data.result);
            break;
          
          default:
            console.log('Unknown message type:', data.type);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
      };
      
      ws.onerror = (err) => {
        setError(new Error('WebSocket error'));
        setIsConnected(false);
      };
      
      wsRef.current = ws;
      
      // Cleanup function
      return () => {
        ws.close();
      };