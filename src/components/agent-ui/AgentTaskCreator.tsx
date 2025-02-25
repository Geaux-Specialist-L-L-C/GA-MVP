// frontend/src/components/agent-ui/AgentTaskCreator.tsx
import React, { useState } from 'react';
import { useAgentTask } from '../../hooks/useAgentTask';
import { TaskRequest } from '../../types/task';
import TaskProgressBar from './TaskProgressBar';
import AgentResponseViewer from './AgentResponseViewer';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface AgentTaskCreatorProps {
  defaultSubject?: string;
  defaultGradeLevel?: string;
  defaultLearningStyle?: string;
}

export const AgentTaskCreator: React.FC<AgentTaskCreatorProps> = ({
  defaultSubject = '',
  defaultGradeLevel = 'elementary',
  defaultLearningStyle = 'visual'
}) => {
  const [subject, setSubject] = useState(defaultSubject);
  const [gradeLevel, setGradeLevel] = useState(defaultGradeLevel);
  const [learningStyle, setLearningStyle] = useState(defaultLearningStyle);
  
  const { taskId, status, result, loading, error, startTask } = useAgentTask();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskRequest: TaskRequest = {
      task_type: 'curriculum_generation',
      subject,
      grade_level: gradeLevel,
      learning_style: learningStyle,
      custom_params: {}
    };
    
    await startTask(taskRequest);
  };
  
  return (
    <div className="agent-task-creator">
      <h2>Generate Personalized Curriculum</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Math, Science, History"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="gradeLevel">Grade Level</label>
          <select
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            required
          >
            <option value="elementary">Elementary</option>
            <option value="middle">Middle School</option>
            <option value="high">High School</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="learningStyle">Learning Style</label>
          <select
            id="learningStyle"
            value={learningStyle}
            onChange={(e) => setLearningStyle(e.target.value)}
            required
          >
            <option value="visual">Visual</option>
            <option value="auditory">Auditory</option>
            <option value="reading">Reading/Writing</option>
            <option value="kinesthetic">Kinesthetic</option>
          </select>
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          variant="primary"
        >
          {loading ? 'Generating...' : 'Generate Curriculum'}
        </Button>
      </form>
      
      {loading && (
        <div className="task-loading">
          <TaskProgressBar status={status} />
          <p>Our AI agents are working together to create your personalized curriculum...</p>
        </div>
      )}
      
      {error && (
        <div className="task-error">
          <h3>Error</h3>
          <p>{error.message}</p>
        </div>
      )}
      
      {result && (
        <AgentResponseViewer result={result} />
      )}
    </div>
  );
};