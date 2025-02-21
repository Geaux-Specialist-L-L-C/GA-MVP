# Consolidated Files (Part 3)

## src/pages/LearningStyles.tsx

```
// File: /src/pages/LearningStyles.tsx
// Description: Learning Styles page component explaining different learning styles.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { FaHeadphones, FaBook, FaRunning, FaBrain, FaUsers, FaEye } from 'react-icons/fa';
import Card from '../components/common/Card';

const LearningStyles: React.FC = () => {
  const learningStyles = [
    { title: "Visual", description: "Learn through seeing and watching demonstrations", icon: <FaEye /> },
    { title: "Auditory", description: "Learn through listening and speaking", icon: <FaHeadphones /> },
    { title: "Reading/Writing", description: "Learn through reading and writing text", icon: <FaBook /> },
    { title: "Kinesthetic", description: "Learn through doing and moving", icon: <FaRunning /> },
    { title: "Logical", description: "Learn through reasoning and problem-solving", icon: <FaBrain /> },
    { title: "Social", description: "Learn through group interaction and collaboration", icon: <FaUsers /> }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Learning Styles</h1>
      <p className="mt-4">Discover your preferred learning style and how Geaux Academy can help you learn more effectively.</p>

      <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <StylesGrid>
          {learningStyles.map((style, index) => (
            <MotionStyleCard 
              key={index}
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>{style.icon}</IconWrapper>
              <h3>{style.title}</h3>
              <p>{style.description}</p>
            </MotionStyleCard>
          ))}
        </StylesGrid>

        <CTASection>
          <h2>Want to know your learning style?</h2>
          <Button to='/take-assessment' $variant="primary">
            Take the Assessment
          </Button>
        </CTASection>
      </m.div>
    </div>
  );
};

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(Card)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MotionStyleCard = m.create(StyleCard);

const IconWrapper = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const CTASection = styled.div`
  text-align: center;
  margin: 4rem 0;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const Button = styled(Link)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-block;
  padding: 1rem 2rem;
  background: ${({ theme, $variant }) => 
    $variant === 'secondary' ? theme.palette.secondary.main : theme.palette.primary.main};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme, $variant }) => 
      $variant === 'secondary' ? theme.palette.secondary.dark : theme.palette.primary.dark};
  }
`;

export default LearningStyles;

```

## src/pages/About.tsx

```
// File: /src/pages/About.tsx
// Description: About page component providing information about Geaux Academy.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">About Geaux Academy</h1>
      <p className="mt-4">Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery.</p>
    </div>
  );
};

export default About;

```

## src/pages/__tests__/LearningStyles.test.tsx

```
// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import LearningStyles from "../LearningStyles";

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />, { withRouter: true });
    expect(screen.getByText("Learning Styles")).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
  });
});
```

## src/pages/__tests__/Home.test.tsx

```
// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockLoginWithGoogle } from "../../test/testUtils";
import Home from "../Home";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithProviders(<Home />, { withRouter: true });
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering personalized learning through ai/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  test("handles Google login", async () => {
    renderWithProviders(<Home />, { withRouter: true });
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    fireEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
```

## src/pages/__tests__/Contact.test.tsx

```
// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Contact from "../Contact";

describe('Contact Component', () => {
  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});
```

## src/pages/__tests__/Features.test.tsx

```
// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Features from "../Features";

describe('Features Component', () => {
  test("renders Features component with correct content", () => {
    renderWithProviders(<Features />);
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("AI-powered learning style assessment")).toBeInTheDocument();
    expect(screen.getByText("Personalized learning paths")).toBeInTheDocument();
    expect(screen.getByText("Real-time progress tracking")).toBeInTheDocument();
    expect(screen.getByText("Interactive dashboard")).toBeInTheDocument();
  });
});
```

## src/pages/__tests__/About.test.tsx

```
// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.

import { screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { renderWithProviders } from "../../test/testUtils";
import About from "../About";

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(<About />);
  });

  test("renders About component with correct content", () => {
    expect(screen.getByRole('heading', { name: /about geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery./i)).toBeInTheDocument();
  });
});
```

## src/pages/__tests__/Curriculum.test.tsx

```
// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Curriculum from "../Curriculum";

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Curriculum component with correct content", () => {
    renderWithProviders(<Curriculum />);
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google to get started/i })).toBeInTheDocument();
  });
});
```

## src/pages/values/Excellence.tsx

```
import React, { useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface ThemeProps {
  theme: DefaultTheme;
}

const Excellence: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaTrophy size={40} />
        <h1>Excellence</h1>
      </ValueHeader>
      <ValueContent>
        <p>We strive for excellence in every aspect of education:</p>
        <ValuePoints>
          <li>Setting high academic standards while supporting individual growth</li>
          <li>Continuously improving our teaching methodologies</li>
          <li>Providing top-quality educational resources</li>
          <li>Measuring and celebrating student achievements</li>
        </ValuePoints>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const GoogleButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.875rem;
`;

export default Excellence;

```

## src/pages/values/Integrity.tsx

```
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBalanceScale } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Integrity: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Login error:", err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaBalanceScale size={40} />
        <h1>Integrity</h1>
      </ValueHeader>
      <ValueContent>
        <p>At Geaux Academy, integrity is the foundation of everything we do. We believe in:</p>
        <ValuePoints>
          <li>Maintaining the highest ethical standards in education</li>
          <li>Being transparent with our teaching methods and student progress</li>
          <li>Creating a safe and honest learning environment</li>
          <li>Delivering on our promises to students and parents</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(motion.div)`
  max-width: 800px;
  margin: 80px auto;
  padding: 2rem;
`;

const ValueHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);

  h1 {
    margin-top: 1rem;
    font-size: 2.5rem;
  }
`;

const ValueContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const ValuePoints = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--background-alt);
    border-radius: 4px;
    
    &:hover {
      transform: translateX(5px);
      transition: transform 0.2s;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Integrity;

```

## src/pages/values/Collaboration.tsx

```
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

const Collaboration: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      // Handle navigation to /dashboard after successful login
    } catch (err) {
      // Handle error as string per user preference
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaUsers size={40} />
        <h1>Collaboration</h1>
      </ValueHeader>
      <ValueContent>
        <p>We believe in the power of working together:</p>
        <ValuePoints>
          <li>Fostering partnerships between teachers, students, and parents</li>
          <li>Creating supportive learning communities</li>
          <li>Encouraging peer-to-peer learning</li>
          <li>Building strong educational networks</li>
        </ValuePoints>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default Collaboration;

```

## src/pages/values/Innovation.tsx

```
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Innovation: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <ValueContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ValueHeader>
        <FaLightbulb size={40} />
        <h1>Innovation</h1>
      </ValueHeader>
      <ValueContent>
        <p>Innovation drives our approach to personalized learning:</p>
        <ValuePoints>
          <li>Leveraging cutting-edge educational technology</li>
          <li>Developing adaptive learning pathways</li>
          <li>Creating interactive and engaging content</li>
          <li>Implementing data-driven teaching methods</li>
        </ValuePoints>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>
      </ValueContent>
    </ValueContainer>
  );
};

const ValueContainer = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ValueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }

  svg {
    color: var(--primary-color);
  }
`;

const ValueContent = styled.div`
  p {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
`;

const ValuePoints = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default Innovation;

```

## src/pages/styles/Contact.css

```
.contact-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
```

## src/pages/profile/StudentProfile/StudentProfileForm.tsx

```
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import styled from 'styled-components';

interface StudentFormData {
  firstName: string;
  lastName: string;
  age: string;
  grade: string;
}

interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const StudentProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    age: '',
    grade: ''
  });

  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      grade: ''
    });
    setFormState({
      loading: false,
      error: null,
      success: false
    });
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormState(prev => ({ ...prev, error: 'First and last name are required' }));
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 4 || parseInt(formData.age) > 18) {
      setFormState(prev => ({ ...prev, error: 'Age must be between 4 and 18' }));
      return false;
    }
    if (!formData.grade.trim()) {
      setFormState(prev => ({ ...prev, error: 'Grade is required' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = auth.currentUser?.uid;
    
    if (!parentId) {
      setFormState(prev => ({ ...prev, error: 'Parent authentication required' }));
      return;
    }

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await addDoc(collection(db, 'students'), {
        ...formData,
        parentId,
        createdAt: new Date().toISOString()
      });
      
      setFormState({ loading: false, error: null, success: true });
      setTimeout(resetForm, 3000);
    } catch (error) {
      setFormState({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false
      });
    }
  };

  return (
    <FormContainer>
      {formState.success && (
        <SuccessMessage>Student added successfully!</SuccessMessage>
      )}
      {formState.error && (
        <ErrorMessage>{formState.error}</ErrorMessage>
      )}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>First Name *</Label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name *</Label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Age *</Label>
          <Input
            type="number"
            min="4"
            max="18"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Grade *</Label>
          <Input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            disabled={formState.loading}
            required
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={formState.loading}>
          {formState.loading ? 'Adding Student...' : 'Add Student'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--secondary-color);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const SuccessMessage = styled(Message)`
  background: var(--success-color);
  color: white;
`;

const ErrorMessage = styled(Message)`
  background: var(--danger-color);
  color: white;
`;

export default StudentProfileForm;
```

## src/pages/profile/StudentProfile/StudentDashboard.tsx

```
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import styled from 'styled-components';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentProfile } from '../../../services/profileService';
import { Student } from '../../../types/auth';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import LearningStyleChat from '../../../components/chat/LearningStyleChat';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface StudentData extends Student {
  recentActivities: Array<{
    id?: string;
    type: string;
    name: string;
    date: string;
  }>;
  progress: Array<{
    type: string;
    value: number;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        setError('Student ID not found');
        return;
      }

      try {
        const data = await getStudentProfile(id);
        if (data) {
          setStudentData({
            ...data,
            id: data.id || id,
            recentActivities: [],
            progress: []
          } as StudentData);
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <LoadingSpinner />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return <StyledErrorContainer>{error}</StyledErrorContainer>;
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StyledHeader>
        <StyledHeaderLeft>
          <h1>Welcome, {studentData?.name}!</h1>
          <p>Grade {studentData?.grade}</p>
        </StyledHeaderLeft>
      </StyledHeader>

      <DashboardGrid>
        <MainSection>
          {!studentData?.hasTakenAssessment && (
            <AssessmentSection>
              <h2>Learning Style Assessment</h2>
              <p>Take your learning style assessment to get personalized recommendations.</p>
              <LearningStyleChat />
            </AssessmentSection>
          )}

          {studentData?.hasTakenAssessment && studentData.learningStyle && (
            <LearningStyleSection>
              <h2>Your Learning Style: {studentData.learningStyle}</h2>
              <p>Based on your assessment, we've customized your learning experience.</p>
            </LearningStyleSection>
          )}

          <ProgressSection>
            <h2>Recent Progress</h2>
            {/* Add progress visualization here */}
          </ProgressSection>
        </MainSection>
      </DashboardGrid>
    </m.div>
  );
};

const DashboardContainer = styled(m.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const StyledErrorContainer = styled.div`
  text-align: center;
  color: red;
  padding: 2rem;
`;

const StyledHeader = styled(m.header)`
  margin-bottom: 2rem;
`;

const StyledHeaderLeft = styled.div`
  h1 {
    margin: 0;
    color: var(--primary-color);
  }
  p {
    margin: 0.5rem 0 0;
    color: var(--text-secondary);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const MainSection = styled.div`
  display: grid;
  gap: 2rem;
`;

const AssessmentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LearningStyleSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default StudentDashboard;

```

## src/pages/profile/StudentProfile/StudentProfile.tsx

```
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import styled from "styled-components";
import CourseCard from "../../../components/CourseCard";

interface Course {
  title: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
}

const StudentProfile: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  const courses: Course[] = [
    { title: "Introduction to Learning Styles", type: "Video Animated", category: "Learning Fundamentals" },
    { title: "Learning Style Quiz", type: "Quiz", category: "Assessment" },
    { title: "Visual Learning Techniques", type: "Mind Map", category: "Learning Techniques" }
  ];

  return (
    <Container>
      <ProfileBox>
        <Title>Student Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        {/* Search Filter */}
        <input
          type="text"
          placeholder="Search courses..."
          className="border px-4 py-2 w-full mb-4 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {/* Course List */}
        <div className="grid grid-cols-3 gap-4">
          {courses
            .filter((course) => course.title.toLowerCase().includes(filter.toLowerCase()))
            .map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2C3E50;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

export default StudentProfile;

```

## src/pages/profile/ParentProfile/ParentProfile.tsx

```
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addStudent } from '../../../store/slices/profileSlice';
import { RootState } from '../../../store';
import { Student } from '../../../types/auth';  // Using the auth Student type consistently
import { useAuth } from '../../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';
import { getStudentProfile } from '../../../services/profileService';

const ParentProfile: React.FC = () => {
  const dispatch = useDispatch();
  const parent = useSelector((state: RootState) => state.profile.parent);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const handleAddStudent = () => {
    if (newStudent.name) {
      dispatch(addStudent({
        id: Date.now().toString(),
        name: newStudent.name || '',
        grade: newStudent.grade || '',
        parentId: parent?.id || '',
        hasTakenAssessment: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setShowAddStudent(false);
      setNewStudent({});
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    const fetchStudentsData = async () => {
      if (parent?.students) {
        try {
          const studentsPromises = parent.students.map(async studentId => {
            const student = await getStudentProfile(studentId);
            return student as Student;  // Ensure type consistency
          });
          const fetchedStudents = await Promise.all(studentsPromises);
          setStudentsData(fetchedStudents.filter((s): s is Student => s !== null));
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudentsData();
  }, [parent?.students]);

  return (
    <Container>
      <ProfileBox>
        <Title>Parent Profile</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleLogin}>
          <FcGoogle className="text-xl" />
          Sign in with Google
        </GoogleButton>

        <div className="students-section">
          <h3>My Students</h3>
          <button onClick={() => setShowAddStudent(true)}>Add Student</button>

          {showAddStudent && (
            <div className="add-student-form">
              <input
                type="text"
                placeholder="Student Name"
                value={newStudent.name || ''}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Grade"
                value={newStudent.grade || ''}
                onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
              />
              <button onClick={handleAddStudent}>Save</button>
              <button onClick={() => setShowAddStudent(false)}>Cancel</button>
            </div>
          )}

          <div className="students-list">
            {studentsData.map((student) => (
              <div key={student.id} className="student-card">
                <h4>{student.name}</h4>
                {student.grade && <p>Grade: {student.grade}</p>}
                <p>Learning Style: {student.learningStyle || 'Not assessed'}</p>
                <div className="progress-summary">
                  {student.hasTakenAssessment ? (
                    <div className="assessment-status">Assessment Complete</div>
                  ) : (
                    <div className="assessment-status">Assessment Needed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfileBox>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const ProfileBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default ParentProfile;

```

## src/pages/profile/ParentProfile/CreateStudent.tsx

```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addStudentProfile } from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext';
import StudentCard from '../../../components/student/StudentCard';

interface NewStudent {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}

const CreateStudent: React.FC = () => {
  const [studentName, setStudentName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newStudent: NewStudent = { 
        name: studentName, 
        grade, 
        parentId: currentUser.uid,
        hasTakenAssessment: false
      };

      await addStudentProfile(currentUser.uid, newStudent);
      setStudentName('');
      setGrade('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create student profile. Please try again.');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h2>Add a New Student</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Student Name:
            <Input
              type="text"
              value={studentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentName(e.target.value)}
              placeholder="Enter student's name"
              required
            />
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            Grade Level:
            <Select 
              value={grade} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGrade(e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Grade {i + 1}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Save Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
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
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default CreateStudent;

```

## src/pages/profile/ParentProfile/ParentDashboard.tsx

```
import React, { useState, useEffect } from 'react';
import StudentProgressTracker from './components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from '../components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';
import { useAuth } from "../../../contexts/AuthContext";
import { getParentProfile } from '../../../services/profileService';
import { Parent, Student } from '../../../types/auth';
import { useNavigate } from 'react-router-dom';

interface ParentProfile extends Omit<Parent, 'students'> {
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'curriculum' | 'insights'>('overview');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { currentUser: user, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profile = await getParentProfile(user.uid);
          if (profile) {
            setParentProfile({
              ...profile,
              name: profile.displayName,
              id: profile.id || user.uid,
              students: profile.students.map((student: string) => ({
                id: student,
                name: '',
                age: 0,
                grade: '',
                parentId: profile.id || user.uid,
                hasTakenAssessment: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })) || [],
              createdAt: profile.createdAt || new Date().toISOString(),
              updatedAt: profile.updatedAt || new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await loginWithGoogle();
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleProfileSwitch = (studentId: string) => {
    setSelectedStudent(studentId);
    navigate(`/student-dashboard/${studentId}`);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <ProfileSection>
        <h2>Account Details</h2>
        <p>Name: {parentProfile?.name || "Parent"}</p>
        <p>Email: {user?.email}</p>
        {!user && (
          <GoogleButton onClick={handleGoogleLogin}>
            Sign in with Google
          </GoogleButton>
        )}
      </ProfileSection>

      {user && (
        <>
          <StudentManagement>
            <h2>Student Profiles</h2>
            <AddStudentButton>➕ Add Student</AddStudentButton>
            
            <StudentList>
              {parentProfile?.students?.map((student) => (
                <StudentCard key={student.id} onClick={() => handleProfileSwitch(student.id)}>
                  <h3>{student.name}</h3>
                  <p>Grade: {student.grade}</p>
                  <p>Assessment: {student.hasTakenAssessment ? 'Completed' : 'Pending'}</p>
                  <ViewProfileButton>View Profile</ViewProfileButton>
                </StudentCard>
              ))}
            </StudentList>
          </StudentManagement>

          <TabContainer>
            <TabList>
              <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</Tab>
              <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</Tab>
              <Tab active={activeTab === 'curriculum'} onClick={() => setActiveTab('curriculum')}>Curriculum</Tab>
              <Tab active={activeTab === 'insights'} onClick={() => setActiveTab('insights')}>Insights</Tab>
            </TabList>

            <TabContent>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'progress' && <StudentProgressTracker />}
              {activeTab === 'curriculum' && <CurriculumApproval />}
              {activeTab === 'insights' && <LearningStyleInsights />}
            </TabContent>
          </TabContainer>

          <NotificationSection>
            <NotificationCenter />
          </NotificationSection>
        </>
      )}
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
  }
`;

const ProfileSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StudentManagement = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AddStudentButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
`;

const StudentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
`;

const TabContainer = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NotificationSection = styled.div`
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

const OverviewTab = styled.div`
  // Add specific styles for the overview tab content
`;

const ViewProfileButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

export default ParentDashboard;

```

## src/pages/profile/ParentProfile/ParentProfileForm.tsx

```
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createParentProfile } from '../../../services/profileService';
import styled from 'styled-components';

interface FormData {
  displayName: string;
  phone: string;
  email: string;
}

export const ParentProfileForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    displayName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a profile');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('📝 Creating parent profile for:', currentUser.uid);
      await createParentProfile({
        uid: currentUser.uid,
        email: formData.email,
        displayName: formData.displayName,
        phone: formData.phone
      });
      setSuccess(true);
      console.log('✅ Parent profile created successfully');
    } catch (err) {
      console.error('❌ Error creating parent profile:', err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage>
        Profile created successfully! You can now add students to your account.
      </SuccessMessage>
    );
  }

  return (
    <FormContainer>
      <h2>Complete Your Parent Profile</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Your full name"
            value={formData.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              displayName: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              phone: e.target.value
            })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
              ...formData,
              email: e.target.value
            })}
            required
            disabled={!!currentUser?.email}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Profile'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    text-align: center;
  }
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
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  background: #d1fae5;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem 0;
`;

export default ParentProfileForm;
```

## src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx

```
import React from 'react';
import styled from 'styled-components';

const NotificationCenter: React.FC = () => {
  return (
    <NotificationContainer>
      <h3>Notifications</h3>
      <NotificationList>
        {/* Placeholder for notifications */}
        <NotificationItem>
          <span>No new notifications</span>
        </NotificationItem>
      </NotificationList>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NotificationList = styled.div`
  margin-top: 15px;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export default NotificationCenter;
```

## src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx

```
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../../types/auth';

interface CurriculumApprovalProps {
  studentData?: Student[];
}

const CurriculumApproval: React.FC<CurriculumApprovalProps> = ({ studentData }) => {
  return (
    <ApprovalContainer>
      <h3>Pending Curriculum Approvals</h3>
      {studentData?.map(student => (
        <ApprovalCard key={student.id}>
          <h4>{student.name}</h4>
          <ApprovalActions>
            <button className="approve">Approve</button>
            <button className="review">Review</button>
          </ApprovalActions>
        </ApprovalCard>
      ))}
    </ApprovalContainer>
  );
};

const ApprovalContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ApprovalCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ApprovalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 5px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;

    &.approve {
      background: #4CAF50;
      color: white;
    }

    &.review {
      background: #FFA726;
      color: white;
    }
  }
`;

export default CurriculumApproval;
```

## src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx

```
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../../types/student';

interface StudentProgressTrackerProps {
  studentData?: Student[];
}

const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({ studentData }) => {
  return (
    <ProgressContainer>
      <h3>Student Progress Overview</h3>
      {studentData?.map(student => (
        <ProgressCard key={student.id}>
          <h4>{student.name}</h4>
          <ProgressBar>
            <Progress width={75} />
          </ProgressBar>
        </ProgressCard>
      ))}
    </ProgressContainer>
  );
};

const ProgressContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ProgressCard = styled.div`
  margin: 15px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
`;

export default StudentProgressTracker;
```

## src/pages/profile/components/LearningStyleInsights.tsx

```
import React from 'react';
import styled from 'styled-components';
import { Student } from '../../../types/student';

interface LearningStyleInsightsProps {
  studentData?: Student[];
}

const LearningStyleInsights: React.FC<LearningStyleInsightsProps> = ({ studentData }) => {
  return (
    <InsightsContainer>
      <h3>Learning Style Analytics</h3>
      {studentData?.map(student => (
        <InsightCard key={student.id}>
          <h4>{student.name}</h4>
          <InsightContent>
            <div>Learning Style: {student.learningStyle || 'Not assessed'}</div>
            <div>Recommended Activities: {student.recommendedActivities?.length || 0}</div>
          </InsightContent>
        </InsightCard>
      ))}
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const InsightCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const InsightContent = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default LearningStyleInsights;
```

## src/config/env.js

```
const config = {
  AZURE_ENDPOINT: process.env.REACT_APP_AZURE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.openai.azure.com/',
  AZURE_COGNITIVE_ENDPOINT: process.env.REACT_APP_AZURE_COGNITIVE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.cognitiveservices.azure.com/',
  AZURE_DEPLOYMENT_ENDPOINT: process.env.REACT_APP_AZURE_DEPLOYMENT_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.services.ai.azure.com/models',
  MODEL_NAME: process.env.REACT_APP_MODEL_NAME || 'gpt-4',
  AZURE_API_KEY: process.env.REACT_APP_AZURE_API_KEY || process.env.VITE_OPENAI_API_KEY
};

export default config;

```

