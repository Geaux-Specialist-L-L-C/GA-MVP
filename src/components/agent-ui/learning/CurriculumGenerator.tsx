// frontend/src/components/agent-ui/learning/CurriculumGenerator.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import { mongoService } from '../../../services/mongoService';
import { agentService } from '../../../services/agentService';
import { RealtimeTaskViewer } from '../RealtimeTaskViewer';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';

const CurriculumGenerator: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('elementary');
  const [learningStyle, setLearningStyle] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [savedCurriculumId, setSavedCurriculumId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  const handleTaskComplete = async (result: any) => {
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
  
  return (
    <Container>
      <h2>Generate Personalized Curriculum</h2>
      
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
          <RealtimeTaskViewer 
            taskId={taskId} 
            onComplete={handleTaskComplete} 
          />
          
          {savedCurriculumId && (
            <SuccessMessage>
              <p>Curriculum saved successfully!</p>
              <ViewButton
                $variant="secondary"
                onClick={() => window.location.href = `/curriculum/${savedCurriculumId}`}
              >
                View Saved Curriculum
              </ViewButton>
            </SuccessMessage>
          )}
          
          <NewCurriculumButton
            $variant="secondary"
            onClick={() => setTaskId(null)}
          >
            Create Another Curriculum
          </NewCurriculumButton>
        </TaskViewerContainer>
      )}
    </Container>
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

const SuccessMessage = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #ecfdf5;
  border-radius: 4px;
  text-align: center;

  p {
    color: #059669;
    margin-bottom: 1rem;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const ViewButton = styled(Button)`
  width: 100%;
`;

const NewCurriculumButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

export default CurriculumGenerator;