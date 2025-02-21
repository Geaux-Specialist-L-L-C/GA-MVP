# Consolidated Files (Part 5)

## src/types/styled.d.ts

```
import 'styled-components';
import { Theme } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    breakpoints: Theme['breakpoints'] & {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
    spacing: Theme['spacing'] & {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    colors: {
      border: string;
      text: string;
      background: {
        hover: string;
      };
      error: {
        main: string;
        light: string;
      };
    };
    borderRadius: {
      default: string;
    };
  }
}
```

## src/types/auth.ts

```
import { UserCredential } from 'firebase/auth';

// Common types for auth context and components
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

export interface AuthError {
  code?: string;
  message: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  setAuthError: (error: string | null) => void;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
  createdAt: string;
  updatedAt: string;
  learningStyle?: string;
  assessmentResults?: object;
}

export interface Parent {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthRouteProps {
  children: React.ReactNode;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

declare global {
  interface WindowEventMap {
    'firebase-auth-worker-status': CustomEvent<{
      success: boolean;
      isSecure: boolean;
      supportsServiceWorker: boolean;
      error?: string;
    }>;
    'firebase-auth-error': CustomEvent<{
      error: string;
      fallbackToRedirect?: boolean;
      status?: number;
    }>;
    'firebase-auth-popup-ready': CustomEvent<{
      secure: boolean;
    }>;
    'firebase-auth-success': CustomEvent<{
      status: number;
    }>;
    'firebase-auth-security': CustomEvent<{
      secure: boolean;
    }>;
  }
}

export {};
```

## src/types/service-worker.d.ts

```

```

## src/types/dashboard.ts

```

export interface StudentProgress {
  completionRate: number;
  timeSpent: number;
  accuracy: number;
  subjectProgress: {
    [subject: string]: {
      completed: number;
      total: number;
    };
  };
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  reading: number;
  kinesthetic: number;
  recommendations: string[];
}

export interface DashboardState {
  activeTab: 'overview' | 'progress' | 'learning-styles' | 'curriculum';
  studentData: {
    progress: StudentProgress;
    learningStyle: LearningStyle;
  } | null;
}
```

## src/types/profiles.ts

```
// Base Types
export interface BaseProfile {
    uid: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
}

// Parent Profile Types
export interface Parent extends BaseProfile {
    phone?: string;
    students: string[];
}

// Student Profile Types
export interface Student {
    id: string;
    parentId: string;
    name: string;
    grade: string;
    learningStyle?: LearningStyle;
    hasTakenAssessment: boolean;
    assessmentStatus?: string;
    createdAt: string;
    updatedAt: string;
    recommendedActivities?: string[];
    progress?: StudentProgress[];
    assessmentResults?: AssessmentResult[];
}

// Progress Types
export interface StudentProgress {
    courseId: string;
    completed: number;
    total: number;
    lastAccessed: string;
}

// Assessment Types
export interface AssessmentResult {
    date: string;
    score: number;
    subject: string;
    details: Record<string, unknown>;
}

// Learning Style Types
export interface LearningStyle {
    type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
    strengths: string[];
    recommendations: string[];
}
```

## src/types/types.ts

```
// File: /types/types.ts
// Description: Core type definitions for user profiles, assessments, and course progress
// Author: Geaux Academy Team
// Created: 2024
export interface ParentProfile {
  uid: string;
  email: string;
  displayName: string;
  students: StudentProfile[];
}

export interface StudentProfile {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  age: number;
  grade: string;
  learningStyle?: LearningStyle;
  assessmentResults?: AssessmentResult[];
  progress?: CourseProgress[];
}

export interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  strengths: string[];
  recommendations: string[];
}

export interface AssessmentResult {
  date: string;
  score: number;
  subject: string;
  details: Record<string, unknown>;
}

export interface CourseProgress {
  courseId: string;
  completed: number;
  total: number;
  lastAccessed: string;
}
```

## src/styles/theme.js

```

```

## src/styles/global.css

```
:root {
  /* Colors */
  --primary-color: #2C3E50;
  --secondary-color: #E74C3C;
  --accent-color: #3498DB;
  --text-color: #333;
  --light-bg: #f8f9fa;
  --white: #ffffff;
  
  /* Layout */
  --header-height: 64px;
  --max-width: 1200px;
  --border-radius: 8px;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-family: 'Arial', sans-serif;
  --line-height: 1.6;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: var(--line-height);
  color: var(--text-color);
}

/* Layout Components */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
}

.page-container {
  padding-top: var(--header-height);
}

/* Common Components */
.card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--accent-color);
  color: var(--white);
  border: none;
}

.btn-secondary {
  background-color: var(--white);
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
}

.btn:hover {
  transform: translateY(-2px);
}

/* Forms */
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-family: inherit;
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .container {
    padding: var(--spacing-sm);
  }
}
```

## src/styles/global.ts

```
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.5;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font: inherit;
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
```

## src/styles/components/common.ts

```
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface ButtonProps extends ThemeProps {
  $variant?: 'primary' | 'secondary';
}

export const Container = styled(m.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }: ThemeProps) => theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }: ThemeProps) => theme.spacing.xl} 0;
`;

export const Card = styled(m.div)`
  background: ${({ theme }: ThemeProps) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }: ThemeProps) => theme.spacing.lg};
`;

export const Button = styled(m.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: ThemeProps) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 600;
  background: ${({ theme, $variant }: ButtonProps) => 
    $variant === 'secondary' 
      ? theme.palette.secondary.main 
      : theme.palette.primary.main};
  color: white;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }: ButtonProps) => 
      $variant === 'secondary' 
        ? theme.palette.secondary.dark 
        : theme.palette.primary.dark};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(m.div)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
```

## src/test/testUtils.tsx

```
import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext, type AuthContextProps } from "../contexts/AuthContext";
import '@testing-library/jest-dom';
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

// Enable React Router v7 future flags
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

export const mockLoginWithGoogle = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  mockAuthValue?: Partial<AuthContextProps>;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = true, mockAuthValue = {}, ...options }: RenderWithProvidersOptions = {}
): RenderResult => {
  const defaultAuthValue: AuthContextProps = {
    currentUser: null,
    isAuthReady: true,
    loading: false,
    error: null,
    login: mockLoginWithGoogle,
    loginWithGoogle: mockLoginWithGoogle,
    logout: jest.fn(),
    clearError: jest.fn(),
    ...mockAuthValue
  };

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={defaultAuthValue}>
          {children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  if (withRouter) {
    const router = createMemoryRouter(
      [{ path: "*", element: <Providers>{ui}</Providers> }],
      { 
        initialEntries: ['/'],
        future
      }
    );
    return render(<RouterProvider router={router} future={future} />, options);
  }

  return render(<Providers>{ui}</Providers>, options);
};
```

## src/test/mockThemes.ts

```
import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';
import type { Theme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350'
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

export const mockMuiTheme = muiTheme;

const spacing = Object.assign(
  ((factor: number) => `${0.25 * factor}rem`) as Theme['spacing'],
  {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  }
);

export const mockStyledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing,
  colors: {
    border: '#e0e0e0',
    text: '#000000',
    background: {
      hover: '#f5f5f5'
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee'
    }
  },
  borderRadius: {
    default: '4px'
  }
};
```

## src/test/setup.ts

```
// File: /src/test/setup.ts
// Description: Jest setup file for testing environment configuration.

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Run cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock react-icons
jest.mock('react-icons/fc', () => ({
  FcGoogle: function MockGoogleIcon() {
    return React.createElement('span', { 'data-testid': 'google-icon' }, 'Google Icon');
  }
}));

// Mock Firebase Auth
jest.mock('firebase/auth');

// Mock Firebase Config
jest.mock('../firebase/config', () => ({
  auth: jest.fn(),
  googleProvider: {
    setCustomParameters: jest.fn()
  }
}));
```

## src/components/CurriculumDesigner.tsx

```
// File: /src/components/CurriculumDesigner.tsx
// Description: Adaptive Curriculum Designer component with learning style detection and AddThis social sharing integration
// Author: [Your Name]
// Created: [Date]

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain } from 'lucide-react';
import { GradeLevelSelect, SubjectInput, DifficultySelect, StandardsInput } from './FormControls';
import { useCurriculumForm } from '@/hooks/useCurriculumForm';
import { detectLearningStyle } from '@/services/learningStyleService';
import { useAuth } from '@/contexts/AuthContext';
import { getAvailableStandards } from '@/services/standardsService';
import CurriculumContent from './CurriculumContent';

export const CurriculumDesigner: React.FC = () => {
  const { user } = useAuth();
  const [curriculum, setCurriculum] = useState<CurriculumResponse | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyleData | null>(null);
  const [interactionStart, setInteractionStart] = useState<number>(0);
  const { errors, loading, handleSubmit } = useCurriculumForm();

  const [request, setRequest] = useState<CurriculumRequest>({
    grade_level: 1,
    subject: '',
    difficulty: 'beginner'
  });

  // Enhanced learning style detection
  useEffect(() => {
    let mounted = true;

    const updateLearningStyle = async () => {
      if (!user?.uid) return;
      try {
        const style = await detectLearningStyle(user.uid);
        if (mounted) {
          setLearningStyle(style);
        }
      } catch (error) {
        console.error('Failed to detect learning style:', error);
      }
    };

    updateLearningStyle();
    const interval = setInterval(updateLearningStyle, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user?.uid]);

  // Load AddThis script for social sharing
  useEffect(() => {
    if (!document.getElementById('addthis-script')) {
      const script = document.createElement('script');
      script.src = 'https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-PLACEHOLDER';
      script.async = true;
      script.id = 'addthis-script';
      document.body.appendChild(script);
    }
  }, []);

  // Track interaction start time
  useEffect(() => {
    setInteractionStart(Date.now());
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const engagementMetrics = {
      responseLatency: Date.now() - interactionStart,
      queryComplexity: calculateQueryComplexity(request.subject),
      feedbackIterations: 0
    };

    try {
      const response = await handleSubmit(request, learningStyle, engagementMetrics);
      if (response) {
        setCurriculum(response);
        setInteractionStart(Date.now()); // Reset interaction timer
      }
    } catch (error) {
      // Error handling is managed by useCurriculumForm
      console.error('Submission error:', error);
    }
  };

  const calculateQueryComplexity = (subject: string): number => {
    const words = subject.trim().split(/\s+/);
    const complexity = words.length +
      words.filter(w => w.length > 6).length * 0.5 +
      (subject.includes(',') ? 0.5 : 0);
    return Math.min(complexity / 5, 1);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Adaptive Curriculum Designer
        </CardTitle>
        {learningStyle && (
          <div className="flex items-center gap-2 text-sm">
            <div className="px-3 py-1 rounded-full bg-blue-100">
              <span>🎯 Learning Style: <strong>{learningStyle.style}</strong></span>
              <span className="ml-2 text-gray-500">
                ({(learningStyle.confidence * 100).toFixed(0)}% confidence)
              </span>
            </div>
            <div className="text-gray-500">
              Updated {new Date(learningStyle.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <GradeLevelSelect
            value={request.grade_level}
            onChange={(value) => setRequest(prev => ({ ...prev, grade_level: value as number }))}
            error={errors.grade_level}
            label="Grade Level"
          />

          <SubjectInput
            value={request.subject}
            onChange={(value) => setRequest(prev => ({ ...prev, subject: value as string }))}
            error={errors.subject}
            label="Subject"
          />

          <DifficultySelect
            value={request.difficulty}
            onChange={(value) => setRequest(prev => ({ 
              ...prev, 
              difficulty: value as CurriculumRequest['difficulty'] 
            }))}
            error={errors.difficulty}
            label="Difficulty Level"
          />

          <StandardsInput
            value={request.standards?.[0] || ''}
            onChange={(value) => setRequest(prev => ({ 
              ...prev, 
              standards: [value as string] 
            }))}
            standards={getAvailableStandards(request.subject, request.grade_level)}
            error={errors.standards}
            label="Educational Standards"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Curriculum'}
          </button>
        </form>

        {curriculum && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Personalized Curriculum</h3>
            {curriculum.style_adaptations && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-1">
                    <div>Format: {curriculum.style_adaptations.content_format}</div>
                    <div>Interaction: {curriculum.style_adaptations.interaction_method}</div>
                    <div>Assessment: {curriculum.style_adaptations.assessment_type}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {/* Curriculum content sections */}
            <CurriculumContent curriculum={curriculum} />
            {/* AddThis Social Sharing Buttons */}
            <div className="mt-4">
              <div className="addthis_inline_share_toolbox"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurriculumDesigner;

```

## src/components/Login.tsx

```
import React, { useState } from 'react';
import { useLocation, Location, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface LocationState {
  from?: {
    pathname: string;
  };
  error?: string;
}

const Login: React.FC = (): JSX.Element => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Welcome Back</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {location.state?.error && (
          <ErrorMessage>{location.state.error}</ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </LoginButton>
        </Form>

        <Divider>or</Divider>

        <GoogleButton onClick={handleGoogleLogin} disabled={loading}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </LoginBox>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background);
  padding: 1rem;
`;

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

  &:disabled {
    background-color: #f5f5f5;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  margin: 1.5rem 0;
  text-align: center;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #ddd;
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f8f8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export default Login;

```

## src/components/UserProfileCard.tsx

```
import React from 'react';
import Card from '../common/Card';

interface UserProfileCardProps {
  username: string;
  role: string;
  avatar?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ username, role, avatar }) => {
  return (
    <Card
      title="User Profile"
      icon={avatar}
      className="user-profile-card"
    >
      <div className="user-info">
        <label>Username:</label>
        <p>{username}</p>
      </div>
      <div className="user-info">
        <label>Role:</label>
        <p>{role}</p>
      </div>
    </Card>
  );
};

export default UserProfileCard;
```

## src/components/CourseCard.tsx

```
import React from "react";
import { FaVideo, FaListAlt, FaBrain } from "react-icons/fa";
import Card from "./common/Card";
import styled from "styled-components";

interface CourseCardProps {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const iconMap = {
  "Video Animated": <FaVideo style={{ color: "#9333ea" }} />,
  "Quiz": <FaListAlt style={{ color: "#eab308" }} />,
  "Mind Map": <FaBrain style={{ color: "#ec4899" }} />,
};

const StyledCard = styled(Card)`
  border-left: 4px solid ${props => props.theme.palette.primary.main};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  font-size: 1.875rem;
`;

const CategoryText = styled.p`
  color: ${props => props.theme.palette.text.secondary};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CourseCard: React.FC<CourseCardProps> = ({ title, type, category }) => {
  return (
    <StyledCard title={title} description={type}>
      <IconWrapper>{iconMap[type]}</IconWrapper>
      <CategoryText>{category}</CategoryText>
    </StyledCard>
  );
};

export default CourseCard;

```

## src/components/Navbar.tsx

```
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <NavbarContainer>
      <NavContent>
        <LogoLink to="/">
          <Logo>Geaux Academy</Logo>
        </LogoLink>
        
        <NavLinks>
          <StyledLink to="/about">About Us</StyledLink>
          <StyledLink to="/curriculum">Curriculum</StyledLink>
          <StyledLink to="/learning-styles">Learning Styles</StyledLink>
          <StyledLink to="/contact">Contact</StyledLink>
          
          {currentUser ? (
            <>
              <StyledLink to="/dashboard">Dashboard</StyledLink>
              <ActionButton onClick={handleLogout}>Log Out</ActionButton>
            </>
          ) : (
            <>
              <ActionButton as={Link} to="/login" $primary>Login</ActionButton>
              <ActionButton as={Link} to="/signup">Sign Up</ActionButton>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height, 64px);
  background: var(--navbar-bg, white);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--spacing-md, 1rem);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 1rem);

  @media (max-width: 768px) {
    gap: var(--spacing-sm, 0.5rem);
  }
`;

const StyledLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-speed, 0.3s) var(--transition-timing, ease);

  &:hover {
    color: var(--link-color);
  }
`;

interface ActionButtonProps {
  $primary?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-speed, 0.3s) var(--transition-timing, ease);
  border: none;
  cursor: pointer;
  
  background-color: ${props => props.$primary ? 'var(--btn-primary-bg, #D4AF37)' : 'transparent'};
  color: ${props => props.$primary ? 'var(--btn-primary-text, #FFFFFF)' : 'var(--text-primary)'};
  border: 1px solid ${props => props.$primary ? 'var(--btn-primary-bg, #D4AF37)' : 'currentColor'};

  &:hover {
    background-color: ${props => props.$primary ? 'var(--btn-hover-bg, #C19B26)' : 'var(--light-bg)'};
  }
`;

export default Navbar;
```

## src/components/HomeContainer.js

```
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
`;

export const StyledLink = styled(Link).attrs(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))`
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

```

## src/components/Message.tsx

```
import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ sender, children }) => {
  return (
    <MessageContainer $sender={sender}>
      {children}
    </MessageContainer>
  );
};

const MessageContainer = styled.div<{ $sender: 'user' | 'bot' }>`
  margin: var(--spacing-xs) 0;
  padding: var(--spacing-sm);
  max-width: 80%;
  background: ${({ $sender }) => ($sender === 'user' ? "var(--accent-color)" : "var(--white)")};
  color: ${({ $sender }) => ($sender === 'user' ? "var(--white)" : "var(--text-color)")};
  border-radius: var(--border-radius);
  align-self: ${({ $sender }) => ($sender === 'user' ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export default Message;
```

## src/components/GoogleLoginButton.test.tsx

```
/** @jest-environment jsdom */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import GoogleLoginButton from './GoogleLoginButton';

describe('GoogleLoginButton', () => {
  const mockHandleGoogleLogin = jest.fn();
  const mockDismissError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in button with correct accessibility', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} loading={true} />);
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Signing in...');
  });

  it('displays error message with dismiss button', () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
    expect(screen.getByRole('button', { name: /dismiss error/i })).toBeInTheDocument();
  });

  it('calls onDismissError when dismiss button is clicked', async () => {
    const errorMessage = 'Test error message';
    renderWithProviders(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /dismiss error/i }));
    await waitFor(() => {
      expect(mockDismissError).toHaveBeenCalledTimes(1);
    });
  });

  it('calls handleGoogleLogin when sign in button is clicked', async () => {
    renderWithProviders(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    await waitFor(() => {
      expect(mockHandleGoogleLogin).toHaveBeenCalled();
    });
  });
});
```

## src/components/Layout.tsx

```
// File: /src/components/Layout.tsx
// Description: Common layout container that provides consistent page structure with navbar and proper spacing
// Author: GitHub Copilot
// Created: 2024-02-17

import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./layout/Footer";
import ErrorBoundary from "./shared/ErrorBoundary";

const Layout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Navbar />
      <MainContent>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </MainContent>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--navbar-height, 64px);
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg, 2rem) var(--spacing-md, 1rem);

  @media (max-width: 768px) {
    padding: var(--spacing-md, 1rem) var(--spacing-sm, 0.5rem);
  }
`;

export default Layout;
```

## src/components/GoogleLoginButton.tsx

```
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  handleGoogleLogin: () => Promise<void>;
  loading?: boolean;
  error?: string;
  onDismissError?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  handleGoogleLogin,
  loading = false,
  error,
  onDismissError
}): JSX.Element => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleClick = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, provider);
      await handleGoogleLogin();
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <ButtonContainer>
      {error && (
        <ErrorMessage role="alert">
          <span>{error}</span>
          {onDismissError && (
            <DismissButton 
              onClick={onDismissError}
              aria-label="dismiss error"
            >
              ✕
            </DismissButton>
          )}
        </ErrorMessage>
      )}
      <LoginButton 
        onClick={handleClick}
        disabled={loading}
        aria-label={loading ? 'Signing in...' : 'Sign in with Google'}
      >
        <FcGoogle />
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </LoginButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 4px;
  background: white;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.palette.action?.hover || '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.palette.error.light};
  color: ${({ theme }) => theme.palette.error.main};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  margin-left: ${({ theme }) => theme.spacing.sm};

  &:hover {
    opacity: 0.8;
  }
`;

export default GoogleLoginButton;

```

## src/components/Mission.tsx

```
import styled from 'styled-components';
import React from 'react';

const MissionContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #444;
`;

interface MissionProps {
  text: string;
}

export const Mission: React.FC<MissionProps> = ({ text }) => {
  return (
    <MissionContainer>
      <MissionText>{text}</MissionText>
    </MissionContainer>
  );
};

export default Mission;

```

## src/components/PrivateRoute.tsx

```
// File: /src/components/PrivateRoute.tsx
// Description: A route component that protects routes from unauthorized access
// Author: GitHub Copilot

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }): JSX.Element => {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (!isAuthReady) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If not authenticated, redirect to login with current location
  if (!currentUser && isAuthReady) {
    // Only redirect if we're not already on the login page
    if (location.pathname !== '/login') {
      return (
        <Navigate 
          to="/login" 
          state={{ 
            from: location,
            error: "Please sign in to access this page" 
          }} 
          replace 
        />
      );
    }
  }

  // If authenticated, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;

```

