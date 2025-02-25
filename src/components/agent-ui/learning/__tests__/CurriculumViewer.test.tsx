// File: /src/components/agent-ui/learning/__tests__/CurriculumViewer.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CurriculumViewer } from '../CurriculumViewer';
import type { TaskResult } from '../../../../types/task';

const mockCurriculumResult: TaskResult = {
  content: {
    title: "Mathematics for Visual Learners",
    grade_level: "elementary",
    modules: [
      {
        title: "Introduction to Numbers",
        content: "Using visual aids to understand basic number concepts..."
      },
      {
        title: "Basic Addition",
        content: "Learning addition through picture grouping..."
      }
    ],
    learning_style_adaptations: {
      style: "visual",
      recommendations: [
        "Use diagrams and charts",
        "Incorporate color coding"
      ]
    }
  },
  metadata: {
    agent_id: "teacher-001",
    agent_name: "Teacher",
    agent_role: "curriculum_creation"
  }
};

describe('CurriculumViewer', () => {
  it('renders curriculum content correctly', () => {
    render(<CurriculumViewer result={mockCurriculumResult} />);
    
    // Check title and grade level
    expect(screen.getByText("Mathematics for Visual Learners")).toBeInTheDocument();
    expect(screen.getByText("Grade Level: elementary")).toBeInTheDocument();
    
    // Check modules
    expect(screen.getByText("Introduction to Numbers")).toBeInTheDocument();
    expect(screen.getByText("Basic Addition")).toBeInTheDocument();
    expect(screen.getByText(/Using visual aids/)).toBeInTheDocument();
    expect(screen.getByText(/Learning addition/)).toBeInTheDocument();
    
    // Check learning style adaptations
    expect(screen.getByText("Learning Style Adaptations")).toBeInTheDocument();
    expect(screen.getByText("Use diagrams and charts")).toBeInTheDocument();
    expect(screen.getByText("Incorporate color coding")).toBeInTheDocument();
  });

  it('handles empty recommendations gracefully', () => {
    const emptyResult: TaskResult = {
      content: {
        title: "Test Curriculum",
        grade_level: "elementary",
        modules: [],
        learning_style_adaptations: {
          style: "visual",
          recommendations: []
        }
      }
    };
    
    render(<CurriculumViewer result={emptyResult} />);
    
    expect(screen.getByText("Test Curriculum")).toBeInTheDocument();
    expect(screen.getByText("Learning Style Adaptations")).toBeInTheDocument();
    // Should still render section headers even with no content
  });

  it('renders all modules even with large curricula', () => {
    const manyModules = Array.from({ length: 10 }, (_, i) => ({
      title: `Module ${i + 1}`,
      content: `Content for module ${i + 1}`
    }));

    const largeResult: TaskResult = {
      content: {
        title: "Large Curriculum",
        grade_level: "elementary",
        modules: manyModules,
        learning_style_adaptations: {
          style: "visual",
          recommendations: ["Test recommendation"]
        }
      }
    };
    
    render(<CurriculumViewer result={largeResult} />);
    
    // Verify all modules are rendered
    manyModules.forEach(module => {
      expect(screen.getByText(module.title)).toBeInTheDocument();
      expect(screen.getByText(module.content)).toBeInTheDocument();
    });
  });
});