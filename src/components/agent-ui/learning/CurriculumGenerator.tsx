// frontend/src/components/agent-ui/learning/CurriculumGenerator.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import { mongoService } from '../../../services/mongoService';
import { agentService } from '../../../services/agentService';
import { useTaskWebSocket } from '../../../hooks/useTaskWebSocket';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import type { TaskResult, TaskStatus } from '../../../types/task';
import WebSocketErrorBoundary from '../../error-boundaries/WebSocketErrorBoundary';
import websocketService from '../../../services/websocketService';
import ConnectionStatus from '../../common/ConnectionStatus';
import CurriculumViewer from './CurriculumViewer';

export const CurriculumGenerator: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('elementary');
  const [learningStyle, setLearningStyle] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [savedCurriculumId, setSavedCurriculumId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isConnected, status, result, error: wsError } = useTaskWebSocket(taskId);

  // Load user's learning style on mount
  useEffect(() => {
    const loadLearningStyle = async () => {
      if (user?.uid) {
        try {
          const styleData = await mongoService.getLearningStyle(user.uid);
          if (styleData?.style) {
            setLearningStyle(styleData.style);
          }
        } catch (err) {
          console.error('Error loading learning style:', err);
        }
      }
    };
    
    loadLearningStyle();
  }, [user?.uid]);

  // Update error state to include WebSocket errors
  useEffect(() => {
    if (wsError) {
      setError(wsError.message);
    }
  }, [wsError]);

  // Handle task completion from WebSocket updates
  useEffect(() => {
    if (result && !savedCurriculumId) {
      handleTaskComplete(result);
    }
  }, [result]);
  
  const handleStartGeneration = async () => {
    if (!user?.uid) {
      setError('You must be logged in to generate curriculum');
      return;
    }
    
    if (!subject) {
      setError('Please enter a subject');
      return;
    }
    
    if (!learningStyle) {
      setError('Learning style is required. Please take the assessment first.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create task request
      const taskId = await agentService.createTask({
        task_type: 'curriculum_generation',
        subject,
        grade_level: gradeLevel,
        learning_style: learningStyle,
        custom_params: {}
      });
      
      setTaskId(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTaskComplete = async (result: TaskResult) => {
    if (!user?.uid || !result?.content) return;
    
    try {
      // Save curriculum to MongoDB
      const savedCurriculum = await mongoService.saveCurriculum(user.uid, result.content);
      setSavedCurriculumId(savedCurriculum.id);
    } catch (err) {
      setError('Error saving curriculum');
      console.error('Error saving curriculum:', err);
    }
  };

  const handleRetryConnection = () => {
    websocketService.connect().catch(error => {
      setError(error instanceof Error ? error.message : 'Failed to reconnect');
    });
  };

  return (
    <WebSocketErrorBoundary onRetry={handleRetryConnection}>
      <Container>
        <h2>Generate Personalized Curriculum</h2>
        
        <ConnectionStatus 
          isConnected={isConnected} 
          onRetry={handleRetryConnection}
          className="mb-4"
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {!taskId ? (
          <Form onSubmit={(e) => { e.preventDefault(); handleStartGeneration(); }}>
            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Science, History"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Select
                id="gradeLevel"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="elementary">Elementary School</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="learningStyle">Learning Style</Label>
              <Select
                id="learningStyle"
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                required
                disabled={!!learningStyle}
              >
                <option value="">Select Learning Style</option>
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="reading">Reading/Writing</option>
                <option value="kinesthetic">Kinesthetic</option>
              </Select>
              {!learningStyle && (
                <HelperText>
                  <StyledLink href="/learning-style-assessment">Take the learning style assessment</StyledLink> to determine your learning style
                </HelperText>
              )}
            </FormGroup>
            
            <SubmitButton 
              type="submit" 
              disabled={loading}
              $variant="primary"
            >
              {loading ? (
                <ButtonContent>
                  <LoadingSpinner />
                  <span>Generating...</span>
                </ButtonContent>
              ) : (
                "Generate Curriculum"
              )}
            </SubmitButton>
          </Form>
        ) : (
          <TaskViewerContainer>
            {status?.status === 'in_progress' && (
              <ProgressMessage>
                <LoadingSpinner />
                <p>Our AI agents are collaborating to create your curriculum:</p>
                <AgentList>
                  <AgentItem $active={true}>
                    Researcher is gathering relevant information
                  </AgentItem>
                  <AgentItem $active={Boolean(status.details?.includes('teacher'))}>
                    Teacher is adapting content for your learning style
                  </AgentItem>
                  <AgentItem $active={Boolean(status.details?.includes('supervisor'))}>
                    Supervisor is ensuring quality and coherence
                  </AgentItem>
                </AgentList>
              </ProgressMessage>
            )}
            
            {status?.status === 'failed' && (
              <ErrorContainer>
                <ErrorMessage>
                  {status.details || 'Failed to generate curriculum'}
                </ErrorMessage>
                <RetryButton
                  onClick={() => setTaskId(null)}
                >
                  Try Again
                </RetryButton>
              </ErrorContainer>
            )}
            
            {result && (
              <SuccessContainer>
                <SuccessMessage>Curriculum generated successfully!</SuccessMessage>
                <CurriculumViewer result={result} />
              </SuccessContainer>
            )}
            
            {!result && status?.status !== 'failed' && (
              <CancelButton
                onClick={() => setTaskId(null)}
              >
                Cancel Generation
              </CancelButton>
            )}
          </TaskViewerContainer>
        )}
      </Container>
    </WebSocketErrorBoundary>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    color: var(--primary-color);
    margin-bottom: 2rem;
    font-size: 1.75rem;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const HelperText = styled.p`
  font-size: 0.875rem;
  color: var(--text-color);
  margin-top: 0.5rem;
`;

const StyledLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const TaskViewerContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SuccessContainer = styled.div`
  margin-top: 2rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  font-weight: 500;
  margin-bottom: 1rem;
  text-align: center;
`;

const ErrorContainer = styled.div`
  text-align: center;
  margin: 2rem 0;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-bottom: 1rem;
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;

  &:hover {
    background-color: #4b5563;
  }
`;

const AgentList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 400px;
  margin: 1rem auto;
`;

const AgentItem = styled.li<{ $active: boolean }>`
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 0.375rem;
  background-color: ${props => props.$active ? '#f0fdf4' : '#f3f4f6'};
  color: ${props => props.$active ? '#059669' : '#6b7280'};
  border: 1px solid ${props => props.$active ? '#bbf7d0' : '#e5e7eb'};
  transition: all 0.2s ease-in-out;
`;

const ProgressMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const RetryButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #b91c1c;
  }
`;

export default CurriculumGenerator;