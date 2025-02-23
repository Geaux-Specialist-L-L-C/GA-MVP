// File: /src/components/assessment/__tests__/LearningAssessment.test.tsx
// Description: Tests for the LearningAssessment component
// Author: GitHub Copilot
// Created: 2024-02-20

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { LearningAssessment } from '../LearningAssessment';
import { theme } from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';

const mockLearningStyle = {
  primary: 'visual',
  scores: {
    visual: 0.8,
    auditory: 0.4,
    reading: 0.6,
    kinesthetic: 0.3
  },
  confidence: 0.85
};

const server = setupServer(
  rest.post('/api/learning-assessment/start', (req, res, ctx) => {
    return res(
      ctx.json({
        assessmentId: 'test-id',
        studentId: 'test-student',
        learningStyle: mockLearningStyle,
        timestamp: new Date().toISOString()
      })
    );
  }),
  
  rest.get('/api/learning-assessment/*/progress', (req, res, ctx) => {
    return res(
      ctx.json({
        assessmentId: 'test-id',
        completed: true,
        progress: 100,
        learningStyle: mockLearningStyle
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderComponent = () => {
  return render(
    <ErrorBoundary fallback={<div>Error Boundary</div>}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <LearningAssessment 
            studentId="test-student"
            onComplete={jest.fn()}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

describe('LearningAssessment', () => {
  it('renders start assessment button', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: /start learning assessment/i })
    ).toBeInTheDocument();
  });

  it('shows loading state during assessment', async () => {
    renderComponent();
    
    fireEvent.click(
      screen.getByRole('button', { name: /start learning assessment/i })
    );

    expect(await screen.findByText(/analyzing learning style/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays learning style results after completion', async () => {
    renderComponent();
    
    fireEvent.click(
      screen.getByRole('button', { name: /start learning assessment/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/visual learner/i)).toBeInTheDocument();
      expect(screen.getByText(/85% confidence/i)).toBeInTheDocument();
    });
  });

  it('handles assessment errors', async () => {
    server.use(
      rest.post('/api/learning-assessment/start', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderComponent();
    
    fireEvent.click(
      screen.getByRole('button', { name: /start learning assessment/i })
    );

    expect(
      await screen.findByText(/failed to complete assessment/i)
    ).toBeInTheDocument();
  });

  it('requires authentication', async () => {
    server.use(
      rest.post('/api/learning-assessment/start', (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );

    renderComponent();
    
    fireEvent.click(
      screen.getByRole('button', { name: /start learning assessment/i })
    );

    expect(
      await screen.findByText(/authentication required/i)
    ).toBeInTheDocument();
  });
});