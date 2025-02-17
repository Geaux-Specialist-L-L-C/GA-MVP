# React Application Structure and Content - Part 22

Generated on: 2025-02-17 09:19:40

## /src/pages/Login.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login: React.FC = () => {
  const { loginWithGoogle, loading: authLoading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localError, setLocalError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof clearError === 'function') {
      clearError();
    }
  }, [clearError]);

  const handleDismissError = () => {
    setLocalError('');
    if (typeof clearError === 'function') {
      clearError();
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setLocalError('');
      setLoading(true);
      await loginWithGoogle();
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome Back</Title>
        {(localError || authError) && (
          <ErrorMessage>
            <span>{localError || authError}</span>
            <DismissButton 
              onClick={handleDismissError}
              type="button"
              aria-label="Dismiss error message"
            >✕</DismissButton>
          </ErrorMessage>
        )}
        
        <GoogleButton 
          onClick={handleGoogleLogin} 
          disabled={loading}
          type="button"
          aria-label="Sign in with Google"
        >
          <FcGoogle />
          Sign in with Google
        </GoogleButton>
        <SignUpPrompt>
          Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
        </SignUpPrompt>
      </LoginBox>
    </LoginContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SignUpPrompt = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: var(--primary-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  padding: 0 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

export default Login;
```

---

## /src/pages/NotFound.tsx

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const NotFound: React.FC = () => {
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
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed or doesn't exist.</p>
      <StyledLink to="/">Return to Home</StyledLink>
      <GoogleButton onClick={handleGoogleLogin}>
        <FcGoogle className="text-xl" />
        Sign in with Google
      </GoogleButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color);
  }
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
`;

export default NotFound;
```

---

## /src/pages/TakeAssessment.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { getStudentProfile, updateStudentAssessmentStatus } from "../services/profileService";
import type { Student } from '../types/student';
import styled from 'styled-components';
import LearningStyleChat from '../components/chat/LearningStyleChat';

const TakeAssessment: React.FC = () => {
  const { currentUser } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async (): Promise<void> => {
      if (!studentId || !currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const studentProfile = await getStudentProfile(studentId);
        if (!studentProfile || !studentProfile.id) {
          setError("Student profile not found");
        } else {
          setStudent({
            ...studentProfile,
            id: studentProfile.id
          });
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [currentUser, studentId]);

  const handleAssessmentCompletion = async (): Promise<void> => {
    if (!studentId) {
      setError("Student ID is required");
      return;
    }

    try {
      setLoading(true);
      await updateStudentAssessmentStatus(studentId, "completed");
      setStudent(prev => prev ? { ...prev, hasTakenAssessment: true } : null);
    } catch (error) {
      console.error("Error completing assessment:", error);
      setError("Failed to complete assessment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading assessment...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (!student) {
    return <ErrorContainer>No student found</ErrorContainer>;
  }

  return (
    <AssessmentContainer>
      <Header>
        <h1>Learning Style Assessment</h1>
        <StudentName>for {student.name}</StudentName>
      </Header>

      <ContentSection>
        <p>Chat with our AI assistant to help determine your learning style. The assistant will ask you questions and analyze your responses to identify the learning style that best suits you.</p>
        <LearningStyleChat />
      </ContentSection>

      <ActionSection>
        <CompleteButton 
          onClick={handleAssessmentCompletion}
          disabled={loading}
        >
          {loading ? "Completing..." : "Complete Assessment"}
        </CompleteButton>
      </ActionSection>
    </AssessmentContainer>
  );
};

const AssessmentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
`;

const StudentName = styled.h2`
  font-size: 1.25rem;
  color: var(--text-color);
`;

const ContentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
`;

const CompleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.1rem;
  color: var(--text-color);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

export default TakeAssessment;
```

---

## /src/pages/VarkStyles.tsx

```tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { FaEye, FaHeadphones, FaBookReader, FaRunning } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface LearningStyle {
  icon: JSX.Element;
  title: string;
  description: string;
  characteristics: string[];
}

const VarkStyles: React.FC = () => {
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

  const styles: LearningStyle[] = [
    {
      icon: <FaEye />,
      title: "Visual Learning",
      description: "Learn through seeing and observing",
      characteristics: [
        "Prefer diagrams and charts",
        "Remember visual details",
        "Benefit from visual aids",
        "Excel with graphic organizers"
      ]
    },
    {
      icon: <FaHeadphones />,
      title: "Auditory Learning",
      description: "Learn through listening and speaking",
      characteristics: [
        "Excel in discussions",
        "Remember spoken information",
        "Benefit from lectures",
        "Learn through verbal repetition"
      ]
    },
    {
      icon: <FaBookReader />,
      title: "Read/Write Learning",
      description: "Learn through written words",
      characteristics: [
        "Enjoy reading materials",
        "Take detailed notes",
        "Prefer written instructions",
        "Learn through writing summaries"
      ]
    },
    {
      icon: <FaRunning />,
      title: "Kinesthetic Learning",
      description: "Learn through doing and experiencing",
      characteristics: [
        "Learn by doing",
        "Prefer hands-on activities",
        "Remember through practice",
        "Benefit from role-playing"
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <m.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your VARK Learning Style
        </m.h1>
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Understanding how you learn best is the first step to academic success
        </m.p>
      </Header>

      <StylesGrid>
        {styles.map((style, index) => (
          <StyleCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <IconWrapper>{style.icon}</IconWrapper>
            <h2>{style.title}</h2>
            <p>{style.description}</p>
            <CharacteristicsList>
              {style.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </CharacteristicsList>
          </StyleCard>
        ))}
      </StylesGrid>

      <CTASection>
        <h2>Ready to optimize your learning journey?</h2>
        <p>Take our assessment to discover your learning style and get personalized recommendations.</p>
        <ButtonGroup>
          <PrimaryButton to="/signup">Get Started Now</PrimaryButton>
          <SecondaryButton to="/about">Learn More</SecondaryButton>
        </ButtonGroup>
      </CTASection>

      <GoogleLoginSection>
        <GoogleButton onClick={handleGoogleLogin}>
          Sign in with Google
        </GoogleButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </GoogleLoginSection>
    </Container>
  );
};

const Container = styled(m.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Header = styled(m.header)`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
  }

  p {
    font-size: 1.25rem;
    color: var(--text-color);
  }
`;

const StylesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StyleCard = styled(m.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CharacteristicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "•";
      color: var(--primary-color);
      position: absolute;
      left: 0;
    }
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 4rem;
  padding: 3rem;
  background: var(--background-alt);
  border-radius: 12px;

  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
`;

const GoogleLoginSection = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

export default VarkStyles;
```

---

## /src/pages/values/Collaboration.tsx

```tsx
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

---

## /src/pages/values/Excellence.tsx

```tsx
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

---

## /src/pages/values/Innovation.tsx

```tsx
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

---

## /src/pages/values/Integrity.tsx

```tsx
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

---

## /src/pages/profile/ParentProfile/CreateStudent.tsx

```tsx
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

---

## /src/pages/profile/ParentProfile/ParentDashboard.tsx

```tsx
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

---

## /src/pages/profile/ParentProfile/ParentProfile.tsx

```tsx
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

---

## /src/pages/profile/ParentProfile/ParentProfileForm.tsx

```tsx
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

---

## /src/pages/profile/ParentProfile/dashboard/components/CurriculumApproval.tsx

```tsx
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

---

## /src/pages/profile/ParentProfile/dashboard/components/NotificationCenter.tsx

```tsx
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

---

## /src/pages/profile/ParentProfile/components/StudentProgressTracker.tsx

```tsx
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

---

## /src/pages/profile/StudentProfile/StudentDashboard.tsx

```tsx
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

---

## /src/pages/profile/StudentProfile/StudentProfile.tsx

```tsx
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

---

## /src/pages/profile/StudentProfile/StudentProfileForm.tsx

```tsx
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

---

## /src/pages/profile/components/LearningStyleInsights.tsx

```tsx
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

---

## /src/pages/__tests__/About.test.tsx

```tsx
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

---

## /src/pages/__tests__/Contact.test.tsx

```tsx
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

---

## /src/pages/__tests__/Curriculum.test.tsx

```tsx
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

---

## /src/pages/__tests__/Features.test.tsx

```tsx
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

---

## /src/pages/__tests__/Home.test.tsx

```tsx
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

---

## /src/pages/__tests__/LearningStyles.test.tsx

```tsx
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

---

## /src/pages/styles/Contact.css

```css
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

---

## /src/server/main.py

```plaintext
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.student_routes import router as student_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vue.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## /src/server/routes/studentRoutes.js

```javascript
const express = require('express');
const router = express.Router();

// ...existing code...

router.post('/students', async (req, res) => {
  try {
    const { name } = req.body;
    // Here you would typically create a new student in your database
    // This is a mock response
    const newStudent = {
      id: Date.now(),
      name,
      createdAt: new Date()
    };
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to create student profile: ${error.message}` });
  }
});

router.get('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically fetch the student from your database
    // This is a mock response
    const student = {
      id: student_id,
      name: 'John Doe',
      createdAt: new Date()
    };
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: `Failed to get student profile: ${error.message}` });
  }
});

router.put('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    const { name } = req.body;
    // Here you would typically update the student in your database
    // This is a mock response
    const updatedStudent = {
      id: student_id,
      name,
      createdAt: new Date()
    };
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: `Failed to update student profile: ${error.message}` });
  }
});

router.delete('/students/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;
    // Here you would typically delete the student from your database
    // This is a mock response
    res.status(200).json({ detail: `Student ${student_id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete student profile: ${error.message}` });
  }
});

// ...existing code...

module.exports = router;
```

---

## /src/server/routes/student_routes.py

```plaintext
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import time

router = APIRouter()

class StudentCreate(BaseModel):
    name: str

class StudentUpdate(BaseModel):
    name: str

class Student(StudentCreate):
    id: int
    created_at: datetime

students_db = {}

@router.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    try:
        new_student = Student(
            id=int(time.time()),
            name=student.name,
            created_at=datetime.now()
        )
        students_db[new_student.id] = new_student
        return new_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create student profile")

@router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: int):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student_update: StudentUpdate):
    student = students_db.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    updated_student = Student(id=student_id, name=student_update.name, created_at=student.created_at)
    students_db[student_id] = updated_student
    return updated_student

@router.delete("/students/{student_id}")
async def delete_student(student_id: int):
    student = students_db.pop(student_id, None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Student deleted successfully"}
```

---

## /src/store/index.ts

```typescript
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
```

---

## /src/store/slices/profileSlice.ts

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parent, Student } from '../../types/profiles';

interface ProfileState {
  parent: Parent | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  parent: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setParentProfile: (state, action: PayloadAction<Parent>) => {
      state.parent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        state.parent.students.push(action.payload);
      }
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      if (state.parent) {
        const index = state.parent.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.parent.students[index] = action.payload;
        }
      }
    },
  },
});

export const { setParentProfile, addStudent, updateStudent } = profileSlice.actions;
export default profileSlice.reducer;
```

---

## /src/config/env.js

```javascript
const config = {
  AZURE_ENDPOINT: process.env.REACT_APP_AZURE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.openai.azure.com/',
  AZURE_COGNITIVE_ENDPOINT: process.env.REACT_APP_AZURE_COGNITIVE_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.cognitiveservices.azure.com/',
  AZURE_DEPLOYMENT_ENDPOINT: process.env.REACT_APP_AZURE_DEPLOYMENT_ENDPOINT || 'https://ai-geauxacademy8942ai219453410909.services.ai.azure.com/models',
  MODEL_NAME: process.env.REACT_APP_MODEL_NAME || 'gpt-4',
  AZURE_API_KEY: process.env.REACT_APP_AZURE_API_KEY || process.env.VITE_OPENAI_API_KEY
};

export default config;
```

---

## /src/types/auth.ts

```typescript
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

---

## /src/types/css.d.ts

```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}
```

---

## /src/types/dashboard.ts

```typescript
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

---

## /src/types/firebase.d.ts

```typescript
// File: /src/types/firebase.d.ts
// Description: Type declarations for Firebase modules
// Author: GitHub Copilot
// Created: 2024-02-12

declare module 'firebase/app' {
  export * from '@firebase/app';
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
}

declare module 'firebase/analytics' {
  export * from '@firebase/analytics';
}

declare module 'firebase/messaging' {
  export * from '@firebase/messaging';
}
```

---

## /src/types/profiles.ts

```typescript
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

---

## /src/types/service-worker.d.ts

```typescript

```

---

## /src/types/student.ts

```typescript
export interface Student {
  id: string;
  name: string;
  grade?: string;
  age?: number;
  learningStyle?: string;
  hasTakenAssessment: boolean;
  progress?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
  }>;
  recommendedActivities?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentId: string;
}
```

---

## /src/types/styled.d.ts

```typescript
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

---

## /src/types/types.ts

```typescript
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

---

## /src/types/userTypes.ts

```typescript
export interface BaseProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentProfile extends BaseProfile {
  role: 'parent';
  phone?: string;
  students: StudentProfile[];
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  parentId: string;
  grade: string;
  dateOfBirth: Date;
}
```

---

## /src/services/api.js

```javascript
import axios from 'axios';

import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://learn.geaux.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Enable sending cookies in cross-origin requests
});

// Add request interceptor for auth headers
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true); // Get a fresh token
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('token');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized errors and try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login
      }
    }

    // Handle other error cases
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      request: error.request,
      message: error.message
    });

    // Enhanced error handling
    let errorMessage = "An error occurred. Please try again.";
    switch (error.response?.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      case 503:
        errorMessage = "Service unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
```

---

## /src/services/cheshireService.ts

```typescript
import axios, { AxiosInstance } from 'axios';
import { auth } from '../firebase/config';

// Use environment variable if set, otherwise fall back to the production URL
const CHESHIRE_API_URL = import.meta.env.VITE_CHESHIRE_API_URL || 'https://cheshire.geaux.app';
const CHESHIRE_DEBUG = import.meta.env.VITE_CHESHIRE_DEBUG === 'true';

// Create axios instance with default configuration
const cheshireAxios: AxiosInstance = axios.create({
  baseURL: CHESHIRE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Add authentication interceptor
cheshireAxios.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Auth interceptor error:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
cheshireAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (CHESHIRE_DEBUG) {
      console.error('Cheshire API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Unable to connect to Cheshire API:', error);
      console.error('Please ensure the TIPI container is running and accessible at:', CHESHIRE_API_URL);
    }
    return Promise.reject(error);
  }
);

interface CheshireResponse {
  text: string;
  response: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireUser {
  username: string;
  permissions: {
    CONVERSATION: string[];
    MEMORY: string[];
    STATIC: string[];
    STATUS: string[];
  };
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface CheshireError {
  message: string;
  code?: string;
  response?: {
    status: number;
    data: unknown;
  };
  config?: {
    url: string;
    method: string;
    headers: Record<string, string>;
  };
}

export class CheshireService {
  private static async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    const token = await user.getIdToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static async getFirebaseToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  static async checkTipiHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await cheshireAxios.get('/');
      return {
        status: 'healthy',
        version: response.data.version || 'unknown'
      };
    } catch (error) {
      const err = error as CheshireError;
      console.error('TIPI health check failed:', err);
      if (err.code === 'ERR_NETWORK') {
        throw new Error('TIPI container is not accessible. Please ensure it is running.');
      }
      throw err;
    }
  }

  static async initialize(): Promise<void> {
    try {
      // Check TIPI container health
      await this.checkTipiHealth();
      
      console.log('✅ Cheshire Cat service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Cheshire Cat service:', error);
      throw error;
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      await cheshireAxios.get('/', { headers });
      return true;
    } catch (error) {
      console.error('Cheshire API Connection Error:', error);
      return false;
    }
  }

  static async sendChatMessage(message: string, userId: string, chatId: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await cheshireAxios.post<CheshireResponse>(
        '/message',
        { text: message },
        { headers }
      );
      
      return {
        data: response.data.response,
        memories: response.data.memories
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw this.getErrorMessage(error);
    }
  }

  static async createCheshireUser(firebaseUid: string, email: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const payload: CheshireUser = {
        username: email,
        permissions: {
          CONVERSATION: ["WRITE", "EDIT", "LIST", "READ", "DELETE"],
          MEMORY: ["READ", "LIST"],
          STATIC: ["READ"],
          STATUS: ["READ"]
        }
      };

      await cheshireAxios.post('/users/', payload, { headers });
    } catch (error) {
      console.error('Error creating Cheshire user:', error);
      throw this.getErrorMessage(error);
    }
  }

  static getErrorMessage(error: CheshireError): string {
    if (error.message === 'Authentication required') {
      return "Please log in to continue.";
    }
    if (error.message === 'Failed to obtain Cheshire auth token') {
      return "Unable to connect to the chat service. Please try again later.";
    }
    if (error.code === 'ECONNABORTED') {
      return "The request timed out. Please try again.";
    }
    if (error.code === 'ERR_NETWORK') {
      if (error.message.includes('CORS')) {
        return "Unable to connect to the chat service due to CORS restrictions. Please contact support.";
      }
      return "Network error - Unable to connect to the chat service. Please check your connection and try again.";
    }
    if (error.response?.status === 401) {
      return "Your session has expired. Please try again.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    if (error.response?.status === 404) {
      return "The chat service is not available. Please check if the service is running.";
    }
    return "Sorry, I'm having trouble connecting to the chat service. Please try again later.";
  }
}
```

---

## /src/services/firestore.ts

```typescript
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function getData(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function setData(collectionName: string, docId: string, data: any) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  return true;
}

// ...other helper functions as needed...
```

---

## /src/services/openai.js

```javascript
import axios from 'axios';

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default openaiClient;
```

---

## /src/services/profileService.ts

```typescript
import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { Parent, Student, LearningStyle } from "../types/profiles";

// Cache for storing profiles
const profileCache = new Map();

// Helper to check online status
const isOnline = () => navigator.onLine;

// Helper to handle offline errors
const handleOfflineError = (operation: string) => {
  const error = new Error(`Cannot ${operation} while offline`);
  error.name = 'OfflineError';
  return error;
};

// ✅ Create Parent Profile
export const createParentProfile = async (parentData: Partial<Parent>): Promise<string> => {
  try {
    if (!parentData.uid) throw new Error('User ID is required');
    
    const parentRef = doc(db, 'parents', parentData.uid);
    await setDoc(parentRef, {
      ...parentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      students: []
    });
    
    console.log('✅ Parent profile created successfully:', parentData.uid);
    return parentData.uid;
  } catch (error) {
    console.error('❌ Error creating parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Parent Profile
export const getParentProfile = async (userId: string): Promise<Parent | null> => {
  try {
    console.log('🔍 Fetching parent profile for:', userId);

    // Check cache first
    if (profileCache.has(`parent_${userId}`)) {
      return profileCache.get(`parent_${userId}`);
    }

    const docRef = doc(db, 'parents', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const parentProfile: Parent = {
        uid: data.uid || userId,
        email: data.email || '',
        displayName: data.displayName || '',
        students: data.students || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      console.log('✅ Parent profile found:', parentProfile);
      // Cache the result
      profileCache.set(`parent_${userId}`, parentProfile);
      return parentProfile;
    }
    
    console.log('ℹ️ No parent profile found, creating one...');
    // If no profile exists, create one
    await createParentProfile({ uid: userId });
    return getParentProfile(userId); // Retry fetch after creation
    
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`parent_${userId}`) || null;
    }
    console.error('❌ Error fetching parent profile:', error);
    throw error;
  }
};

// ✅ Fetch Student Profile
export const getStudentProfile = async (studentId: string): Promise<Student> => {
  try {
    // Check cache first
    if (profileCache.has(`student_${studentId}`)) {
      return profileCache.get(`student_${studentId}`);
    }

    const studentRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error("Student profile not found");
    }

    const studentData = studentDoc.data() as Student;
    // Cache the result
    profileCache.set(`student_${studentId}`, studentData);
    return studentData;
  } catch (error) {
    if (!isOnline()) {
      console.warn('Offline: Using cached data if available');
      return profileCache.get(`student_${studentId}`) || null;
    }
    throw error;
  }
};

// ✅ Add Student Profile
export const addStudentProfile = async (parentId: string, studentData: {
  name: string;
  grade: string;
  parentId: string;
  hasTakenAssessment: boolean;
}) => {
  try {
    console.log('📝 Adding student profile for parent:', parentId);
    
    // Add the student to the students collection
    const studentRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Update the parent's students array
    const parentRef = doc(db, 'parents', parentId);
    const parentDoc = await getDoc(parentRef);

    if (parentDoc.exists()) {
      const currentStudents = parentDoc.data().students || [];
      await updateDoc(parentRef, {
        students: [...currentStudents, studentRef.id],
        updatedAt: new Date().toISOString()
      });
    }

    console.log('✅ Student profile added successfully:', studentRef.id);
    return studentRef.id;
  } catch (error) {
    console.error('❌ Error adding student profile:', error);
    throw error;
  }
};

// ✅ Update Student's Assessment Status
export const updateStudentAssessmentStatus = async (studentId: string, status: string) => {
  if (!isOnline()) {
    throw handleOfflineError('update assessment status');
  }

  const studentRef = doc(db, "students", studentId);
  try {
    await updateDoc(studentRef, {
      hasTakenAssessment: status === 'completed',
      assessmentStatus: status,
      updatedAt: new Date().toISOString(),
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        hasTakenAssessment: status === 'completed',
        assessmentStatus: status,
        updatedAt: new Date().toISOString()
      });
    }
    console.log(`Assessment status updated to: ${status}`);
  } catch (error) {
    console.error("Error updating assessment status:", error);
    throw new Error("Failed to update assessment status");
  }
};

// ✅ Save Learning Style
export const saveLearningStyle = async (studentId: string, learningStyle: LearningStyle): Promise<void> => {
  if (!isOnline()) {
    throw handleOfflineError('save learning style');
  }

  try {
    console.log('📝 Saving learning style for student:', studentId);
    const studentRef = doc(db, 'students', studentId);
    
    await updateDoc(studentRef, {
      learningStyle,
      updatedAt: new Date().toISOString()
    });

    // Update cache
    const cachedData = profileCache.get(`student_${studentId}`);
    if (cachedData) {
      profileCache.set(`student_${studentId}`, {
        ...cachedData,
        learningStyle,
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log('✅ Learning style saved successfully');
  } catch (error) {
    console.error('❌ Error saving learning style:', error);
    throw error;
  }
};

// Listen for online/offline events to manage cache
window.addEventListener('online', () => {
  console.info('Back online. Syncing data...');
  // Could add sync logic here if needed
});

window.addEventListener('offline', () => {
  console.warn('Gone offline. Using cached data...');
});

export class ProfileService {
  async getUserProfile(userId: string): Promise<any> {
    // ...existing API call logic...
    // Example:
    const response = await fetch(`/api/profiles/${userId}`);
    return response.json();
  }
}
```

---

## /src/theme/index.tsx

```tsx
// File: /src/theme/index.ts
// Description: Custom theme including breakpoint helpers

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

interface CustomBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  large: string;
  keys: (number | Breakpoint)[];
  up: (key: number | Breakpoint) => string;
  down: (key: number | Breakpoint) => string;
  between: (start: number | Breakpoint, end: number | Breakpoint) => string;
  only: (key: number | Breakpoint) => string;
}

export const breakpoints: CustomBreakpoints = {
  mobile: "0px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
  keys: ["xs", "sm", "md", "lg", "xl"],
  up: (key: number | Breakpoint) => {
    // implement using a strategy that works for both numbers and defined breakpoints
    // For simplicity, if key is number then convert to string with px otherwise use a mapping.
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  down: (key: number | Breakpoint) => {
    if (typeof key === "number") {
      return `${key}px`;
    }
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  },
  between: (start: number | Breakpoint, end: number | Breakpoint) => {
    const getValue = (v: number | Breakpoint): number =>
      typeof v === "number" ? v : ({ xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }[v]);
    return `${getValue(start)}px and ${getValue(end)}px`;
  },
  only: (key: number | Breakpoint) => {
    if (typeof key === "number") return `${key}px`;
    const values: Record<Breakpoint, number> = { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 };
    return `${values[key]}px`;
  }
};
```

---

## /src/theme/theme.js

```javascript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // This will multiply the spacing by 4px (MUI's default spacing unit)
});

// Create styled-components theme with the same values
export const styledTheme = {
  palette: {
    ...muiTheme.palette,
  },
  breakpoints: {
    ...muiTheme.breakpoints.values,
  },
  spacing: (factor) => `${0.25 * factor}rem`, // Keep rem units for styled-components
};
```

---

## /src/theme/theme.ts

```typescript
// File: /src/theme/theme.ts
// Description: Unified theme configuration for MUI and styled-components
// Author: GitHub Copilot
// Created: 2024-02-12

import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

// Create the base MUI theme
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
      light: '#F9EBEA',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
      light: '#FEF9E7',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
      light: '#EBF5FB',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
      light: '#E8F8F5',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // Base spacing unit (4px)
});

// Create spacing utility that returns rem values
const createSpacing = () => {
  const spacingFn = (value: number): string => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  });
};

// Create the styled-components theme that extends MUI theme
export const styledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  spacing: createSpacing(),
  colors: {
    border: '#e0e0e0',
    text: muiTheme.palette.text.primary,
    background: {
      hover: '#f5f5f5',
    },
    error: {
      main: muiTheme.palette.error.main,
      light: muiTheme.palette.error.light,
    },
  },
  borderRadius: {
    default: '4px',
  },
};
```

---

## /src/components/CourseCard.tsx

```tsx
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

---

## /src/components/GoogleLoginButton.test.tsx

```tsx
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

---

## /src/components/GoogleLoginButton.tsx

```tsx
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

---

## /src/components/HomeContainer.js

```javascript
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

---

## /src/components/Login.tsx

```tsx
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

---

## /src/components/Message.tsx

```tsx
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

---

## /src/components/Mission.tsx

```tsx
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

---

## /src/components/PrivateRoute.tsx

```tsx
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

---

## /src/components/UserProfileCard.tsx

```tsx
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

---

## /src/components/layout/Footer.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './layout.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <div className={styles['footer-column']}>
          <h3>About</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/curriculum">Curriculum</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Learning</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/learning-styles">Learning Styles</Link></li>
            <li><Link to="/learning-plan">Learning Plan</Link></li>
            <li><Link to="/assessment">Assessment</Link></li>
          </ul>
        </div>

        <div className={styles['footer-column']}>
          <h3>Support</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="mailto:support@geauxacademy.com">Email Support</a></li>
            <li><Link to="/help">Help Center</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## /src/components/layout/Header.tsx

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import styles from './layout.module.css';

const Header = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <Link to="/">
          <img src="/images/logo.svg" alt="Geaux Academy Logo" height="50" />
        </Link>
        
        <nav>
          <ul className={styles['navigation-list']}>
            <li>
              <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className={location.pathname === '/features' ? styles.active : ''}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/curriculum" className={location.pathname === '/curriculum' ? styles.active : ''}>
                Curriculum
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {!currentUser ? (
            <>
              <Button to="/login" className="btn btn-secondary">Login</Button>
              <Button to="/signup" className="btn btn-primary">Sign Up</Button>
            </>
          ) : (
            <Button to="/dashboard" className="btn btn-primary">Dashboard</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

---

## /src/components/layout/Layout.tsx

```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/global.css';

const Layout = () => {
  const { currentUser } = useAuth();

  return (
    <LayoutWrapper>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height);
`;

const PageContainer = styled.main`
  flex: 1;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
  }
`;

export default Layout;
```

---

## /src/components/layout/Navigation.tsx

```tsx
import React from "react";
import { Link } from "react-router-dom";
import './styles/Navigation.css';

const Navigation = () => {
  return (
    <nav className="flex space-x-6 text-lg font-medium">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/curriculum" className="hover:underline">Curriculum</Link>
      <Link to="/learning-styles" className="hover:underline">Learning Styles</Link>
      <Link to="/contact" className="hover:underline">Contact Us</Link>
    </nav>
  );
};

export default Navigation;
```

---

## /src/components/layout/Sidebar.tsx

```tsx
// src/components/SomeComponent.tsx

import React from 'react';

const SomeComponent: React.FC = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

export default SomeComponent;
```

---

## /src/components/layout/layout.module.css

```css
/* Layout Components */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem;
}

.navigation {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-md);
  height: 100%;
}

.navigation-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation-list a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: color 0.2s, background-color 0.2s;
}

.navigation-list a:hover {
  color: var(--primary-color);
  background-color: var(--light-bg);
}

.navigation-list a.active {
  color: var(--primary-color);
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.footer {
  background: var(--primary-color);
  color: var(--white);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.footer-column h3 {
  margin-bottom: var(--spacing-md);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: var(--white);
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-links a:hover {
  opacity: 0.8;
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .navigation-list {
    display: none;
  }

  .navigation-list.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--white);
    padding: var(--spacing-md);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-bottom: var(--spacing-md);
}

/* Toast */
.toast {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  color: var(--white);
  animation: slideIn 0.3s ease-in-out;
  z-index: 1000;
}

.toast-info { background-color: var(--accent-color); }
.toast-success { background-color: #10b981; }
.toast-error { background-color: var(--secondary-color); }
.toast-warning { background-color: #f59e0b; }

/* Loading Spinner */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Card Components */
.card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  margin: var(--spacing-sm);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.card-description {
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list {
  list-style-position: inside;
  color: var(--text-color);
  line-height: var(--line-height);
}

.card-list li {
  margin-bottom: var(--spacing-xs);
}

@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }
}

/* Student Card Styles */
.student-card {
  background: var(--white);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
}

.student-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.student-info {
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.assessment-status {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-complete {
  background-color: #10b981;
  color: var(--white);
}

.status-pending {
  background-color: #f59e0b;
  color: var(--white);
}

/* Animations */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## /src/components/common/Button.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  $variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children, $variant = 'primary', ...props }) => {
  const className = `btn btn-${$variant}`;
  
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <StyledButton className={className} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Button;
```

---

## /src/components/common/Card.tsx

```tsx
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconProp | string;
  title?: string;
  description?: string | string[];
  className?: string;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  icon,
  title,
  description,
  children,
  className,
  onClick,
  ...props
}, ref) => {
  const isImagePath = typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'));
  
  return (
    <StyledCard 
      ref={ref}
      className={className} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon && (
        <IconContainer>
          {isImagePath ? (
            <img 
              src={icon} 
              alt={title || 'Card icon'}
              crossOrigin={icon.startsWith('http') ? "anonymous" : undefined}
            />
          ) : (
            typeof icon === 'object' && <FontAwesomeIcon icon={icon} />
          )}
        </IconContainer>
      )}
      {title && <CardTitle>{title}</CardTitle>}
      {description && (
        Array.isArray(description) ? (
          <CardList>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </CardList>
        ) : (
          <CardDescription>{description}</CardDescription>
        )
      )}
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    ${props => props.onClick && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    `}
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.palette.primary.main};
  
  img {
    max-width: 48px;
    height: auto;
  }
`;

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export default Card;
```

---

## /src/components/common/LoadingSpinner.tsx

```tsx
import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

const SpinnerElement = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoadingContainer>
      <SpinnerElement />
    </LoadingContainer>
  );
};

export default LoadingSpinner;
```

---

## /src/components/common/Modal.tsx

```tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Body>{children}</Body>
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const Body = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
`;

export default Modal;
```

---

## /src/components/common/StyledLink.tsx

```tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface StyledLinkProps {
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const StyledLink = styled(Link).attrs<StyledLinkProps>(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))<StyledLinkProps>`
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-lg);
  background: ${props => props.variant === 'secondary' ? 'var(--secondary-color)' : 'var(--primary-color)'};
  color: var(--white);
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s, transform 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not([aria-disabled="true"]) {
    background: ${props => props.variant === 'secondary' ? 'var(--primary-color)' : 'var(--secondary-color)'};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }
`;

export default StyledLink;
```

---

## /src/components/common/Toast.tsx

```tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <ToastContainer $type={type}>
      <p>{message}</p>
    </ToastContainer>
  );
};

const showToast = (props: ToastProps): void => {
  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  
  const onClose = () => {
    document.body.removeChild(toastElement);
    props.onClose?.();
  };
  
  const toastComponent = React.createElement(Toast, { ...props, onClose });
  ReactDOM.render(toastComponent, toastElement);
};

const getToastColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return css`
        background-color: ${({ theme }) => theme.palette.success?.main || '#2ECC71'};
        color: white;
      `;
    case 'warning':
      return css`
        background-color: ${({ theme }) => theme.palette.warning?.main || '#F1C40F'};
        color: white;
      `;
    case 'error':
      return css`
        background-color: ${({ theme }) => theme.palette.error?.main || '#E74C3C'};
        color: white;
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.palette.info?.main || '#3498DB'};
        color: white;
      `;
  }
};

const ToastContainer = styled.div<{ $type: ToastType }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  ${props => getToastColor(props.$type)}

  p {
    margin: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default Toast;
```

---

## /src/components/common/types/index.ts

```typescript
// src/components/SomeComponent.tsx

import React from 'react';

// Reusable component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

// Example component with proper types
export interface SomeComponentProps extends BaseComponentProps {
  title?: string;
}

// Use arrow function with explicit return for better type inference
export const SomeComponent: React.FC<SomeComponentProps> = ({ title = 'Hello, World!', className, id }): JSX.Element => {
  return React.createElement('div', { className, id },
    React.createElement('h1', null, title)
  );
};

// Example utility function with explicit return type
export const exampleFunction = (input: string): string => input.toUpperCase();
```

---

## /src/components/student/StudentCard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStudentProfile } from '../../services/profileService';
import Card from '../common/Card';

interface Student {
  name: string;
  grade: string;
  hasTakenAssessment: boolean;
}

interface StudentCardProps {
  studentId: string;
  onClick?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ studentId, onClick }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await getStudentProfile(studentId);
        setStudent(studentData);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Could not load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <StyledCard onClick={onClick}>Loading student data...</StyledCard>;
  if (error) return <StyledCard onClick={onClick}>Error: {error}</StyledCard>;
  if (!student) return null;

  return (
    <StyledCard onClick={onClick}>
      <StudentName>{student.name}</StudentName>
      <StudentInfo>Grade: {student.grade}</StudentInfo>
      <AssessmentStatus $isComplete={student.hasTakenAssessment}>
        {student.hasTakenAssessment ? 'Assessment Complete' : 'Assessment Needed'}
      </AssessmentStatus>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StudentName = styled.h3`
  color: ${({ theme }) => theme.palette.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StudentInfo = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AssessmentStatus = styled.div<{ $isComplete: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  background-color: ${({ theme, $isComplete }) => 
    $isComplete ? theme.palette.success?.main || '#2ECC71' : theme.palette.warning?.main || '#F1C40F'};
  color: white;
  font-size: 0.875rem;
  text-align: center;
`;

export default StudentCard;
```

---

## /src/components/auth/AuthErrorDialog.tsx

```tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '../../theme';
import styled from 'styled-components';

interface AuthError {
  message: string;
  retry?: boolean;
}

interface AuthErrorDialogProps {
  open: boolean;
  error: AuthError | null;
  onClose: () => void;
  onRetry?: () => Promise<void>;
}

const AuthErrorDialog: React.FC<AuthErrorDialogProps> = ({
  open,
  error,
  onClose,
  onRetry
}): JSX.Element | null => {
  if (!error) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-error-dialog-title"
    >
      <DialogTitle id="auth-error-dialog-title">
        Authentication Error
        <CloseIconButton
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </CloseIconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {error.retry && onRetry && (
          <Button 
            onClick={onRetry} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Try Again
          </Button>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

interface StyledProps {
  theme: Theme;
}

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    padding: ${({ theme }: StyledProps) => theme.spacing.md};
  }
`;

const CloseIconButton = styled(IconButton)`
  position: absolute;
  right: ${({ theme }: StyledProps) => theme.spacing.sm};
  top: ${({ theme }: StyledProps) => theme.spacing.sm};
`;

const StyledDialogActions = styled(DialogActions)`
  padding: ${({ theme }: StyledProps) => theme.spacing.md} 0 0;
`;

export default AuthErrorDialog;
```

---

## /src/components/auth/AuthRoute.tsx

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.8);
`;

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Allow access to auth pages if not authenticated
  return <>{children}</>;
};

export default AuthRoute;
```

---

## /src/components/auth/Login.css

```css
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.login-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-form h2 {
    text-align: center;
    color: #2C3E50;
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
    font-weight: 500;
    font-size: 1rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input::placeholder {
    color: #a0aec0;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.login-button:hover {
    background-color: #4338ca;
}

.login-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

.error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
}

.login-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
}

.login-footer p {
    margin-bottom: 0.5rem;
    color: #4a5568;
}

.login-footer a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
}

.login-footer a:hover {
    text-decoration: underline;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}

.divider span {
    padding: 0 10px;
    color: #64748b;
    font-size: 0.875rem;
}

.google-button {
    width: 100%;
    padding: 0.75rem;
    background-color: white;
    color: #333;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background-color 0.2s ease;
}

.google-button:hover {
    background-color: #f8fafc;
}

.google-button img {
    width: 18px;
    height: 18px;
}

@media (max-width: 480px) {
    .login-form {
        padding: 1.5rem;
    }
}
```

---

## /src/components/auth/LoginForm.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
import './auth.css';

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc3545;
  &:hover {
    opacity: 0.7;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #357abd;
  }
`;

const LoginForm: React.FC = (): JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      {/* ...existing form JSX... */}
    </form>
  );
};

export default LoginForm;
```

---

## /src/components/auth/SignUp.css

```css
.signup-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
}
```

---

## /src/components/auth/SignUp.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { CheshireService } from '../../services/cheshireService';
import Button from '../common/Button';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const createCheshireAccount = async (uid: string, email: string) => {
    try {
      await CheshireService.createCheshireUser(uid, email);
    } catch (error) {
      console.error('Error creating Cheshire account:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signup(formData.email, formData.password);
      
      if (userCredential?.user) {
        await createCheshireAccount(userCredential.user.uid, userCredential.user.email || '');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <h2>Create an Account</h2>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
            <DismissButton onClick={() => setError('')}>✕</DismissButton>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
            />
          </FormGroup>

          <StyledButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </StyledButton>
        </Form>

        <Divider>
          <span>Or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
          <FcGoogle />
          <span>Sign up with Google</span>
        </GoogleButton>

        <LoginPrompt>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginPrompt>
      </SignUpCard>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const SignUpCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
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

const StyledButton = styled.button`
  width: 100%;
  margin-top: 1rem;
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

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  span {
    padding: 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
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

const LoginPrompt = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
`;

const Link = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default SignUp;
```

---

## /src/components/auth/auth.css

```css
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.auth-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 0.875rem;
}

.auth-error-dismiss {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.auth-error-dismiss:hover {
  opacity: 1;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s, border-color 0.2s;
  gap: 0.5rem;
}

.google-button:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.google-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 3rem);
  height: 1px;
  background-color: #e5e7eb;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-divider span {
  background-color: #fff;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.btn.btn-secondary {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s;
  cursor: pointer;
}

.btn.btn-secondary:hover {
  background-color: #e5e7eb;
}
```

---

## /src/components/dashboard/Dashboard.tsx

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import { ProfileService, getStudentProfile } from '../../services/profileService';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Student, BaseProfile } from '../../types/profiles';

interface UserData {
  name: string;
  lastLogin: string;
}

interface ParentProfile {
  id?: string;
  students?: string[];
  name?: string;
  email?: string;
}

interface DashboardProps {
  onProfileUpdate?: (profile: BaseProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onProfileUpdate }): JSX.Element => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Retry data fetch when back online
      if (currentUser) fetchUserData();
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);

  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      if (!currentUser?.uid) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError('');
      
      // Set basic user data immediately from auth
      setUserData({
        name: currentUser.displayName || currentUser.email || '',
        lastLogin: currentUser.metadata?.lastSignInTime || 'N/A',
      });

      // Fetch parent profile with retry mechanism
      const fetchProfileWithRetry = async () => {
        try {
          const profileService = new ProfileService();
          const profile = await profileService.getUserProfile(currentUser.uid);
          if (profile) {
            setParentProfile(profile);
            if (onProfileUpdate) {
              onProfileUpdate(profile);
            }
            return profile;
          }
          throw new Error('Profile not found');
        } catch (err) {
          if (retryCount < MAX_RETRIES && !isOffline) {
            setRetryCount(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return fetchProfileWithRetry();
          }
          throw err;
        }
      };

      const profile = await fetchProfileWithRetry();

      // Fetch students data if profile exists
      if (profile?.students?.length) {
        const studentsData = await Promise.all(
          profile.students.map(async (studentId: string) => {
            try {
              const student = await getStudentProfile(studentId);
              return student;
            } catch (err) {
              console.error(`Error fetching student ${studentId}:`, err);
              return null;
            }
          })
        );
        
        // Filter out null values and cast to Student array
        setStudents(studentsData.filter((s): s is Student => s !== null && s.id !== undefined));
      }

      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(isOffline ? 
        'You are currently offline. Some features may be limited.' :
        'Failed to fetch user data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser, navigate, onProfileUpdate, retryCount, isOffline]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleStudentSelect = (student: Student) => {
    if (isOffline) {
      setError('This action is not available while offline');
      return;
    }
    
    if (!student.hasTakenAssessment) {
      navigate(`/learning-style-chat/${student.id}`);
    } else {
      navigate(`/student-profile/${student.id}`);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <AnimatePresence>
        {isOffline && (
          <OfflineBanner
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            You are currently offline. Some features may be limited.
          </OfflineBanner>
        )}
      </AnimatePresence>

      <DashboardHeader>
        <h1>Welcome, {userData?.name}</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>

      {error && (
        <ErrorMessage>
          {error}
          <RetryButton onClick={fetchUserData}>Retry</RetryButton>
        </ErrorMessage>
      )}

      <DashboardGrid>
        <ParentSection>
          <h2>Parent Dashboard</h2>
          {!isOffline && <CreateStudent />}
          <StudentsList>
            <h3>Your Students</h3>
            {students.length > 0 ? (
              <StudentGrid>
                {students.map((student) => (
                  <StudentCardWrapper 
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    disabled={isOffline}
                  >
                    <StudentName>{student.name}</StudentName>
                    <StudentInfo>Grade: {student.grade}</StudentInfo>
                    <AssessmentStatus $completed={student.hasTakenAssessment}>
                      {student.hasTakenAssessment ? 'Assessment Complete' : 'Take Assessment'}
                    </AssessmentStatus>
                  </StudentCardWrapper>
                ))}
              </StudentGrid>
            ) : (
              <EmptyState>
                No students found. {!isOffline && 'Add your first student to get started.'}
              </EmptyState>
            )}
          </StudentsList>
        </ParentSection>
      </DashboardGrid>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ParentSection = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StudentsList = styled.div`
  margin-top: 1rem;
`;

const StudentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StudentCardWrapper = styled.div<{ disabled?: boolean }>`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const StudentName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
`;

const StudentInfo = styled.p`
  color: #4a5568;
  margin: 0 0 0.5rem 0;
`;

const AssessmentStatus = styled.div<{ $completed: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: ${props => props.$completed ? '#48BB78' : '#4299E1'};
  color: white;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  
  &:hover {
    background-color: #2563EB;
  }
`;

const EmptyState = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

const OfflineBanner = styled(motion.div)`
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid currentColor;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

export default Dashboard;
```

---

## /src/components/home/Features.css

```css
.features-section {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P920d */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P920d */
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.feature-description {
  color: #4a5568;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features-section {
    padding: 2rem 1rem;
  }

  .features-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## /src/components/home/Features.tsx

```tsx
import React from 'react';
import Card from '../common/Card';
import './Features.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faLightbulb, faChartLine, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const Features = () => {
  const features = [
    {
      title: "Personalized Learning",
      description: "Tailored learning paths based on your unique style",
      icon: faBullseye
    },
    {
      title: "Interactive Content",
      description: "Engage with dynamic and interactive learning materials",
      icon: faLightbulb
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics",
      icon: faChartLine
    },
    {
      title: "Expert Support",
      description: "Get help from experienced educators",
      icon: faChalkboardTeacher
    }
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card" icon={feature.icon}>
            <div className="feature-icon"><FontAwesomeIcon icon={feature.icon} /></div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
```

---

## /src/components/home/Hero.css

```css
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero-content p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
}

.hero-cta .btn {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.hero-cta .btn:hover {
  background-color: #e6b800;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}
```

---

## /src/components/home/Hero.tsx

```tsx
import { Link } from 'react-router-dom';
import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Your Learning Style</h1>
        <p>Personalized education tailored to how you learn best</p>
        <div className="hero-cta">
          <Link to="/assessment" className="btn btn-primary">
            <FontAwesomeIcon icon={faUser} /> Take Assessment
          </Link>
          <Link to="/about" className="btn btn-secondary">
            <FontAwesomeIcon icon={faUser} /> Learn More
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-learning.svg" alt="Learning illustration" />
      </div>
    </section>
  );
};

export default Hero;
```

---

## /src/components/home/LearningStyles.css

```css
:root {
  --primary-color: #2C3E50;
  --text-color: #333;
  --background-alt: #f8f9fa;
}

body {
  margin: 0;
  padding: 0;
}

.learning-styles-section {
  padding: 4rem 2rem;
  background-color: var(--light-bg);
}

.learning-styles-section h2 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.style-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.style-card:hover {
  transform: translateY(-5px);
  background-color: #e6b800; /* P4a73 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* P4a73 */
}

.style-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.style-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.style-card p {
  color: var(--text-color);
  line-height: 1.5;
}

.main-content {
  margin-left: 250px;
  padding: 2rem;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .styles-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .learning-styles-section {
    padding: 2rem 1rem;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
```

---

## /src/components/home/LearningStyles.tsx

```tsx
import React from 'react';
import styled from 'styled-components';
import InfoCard from '../common/InfoCard'; // Fixed path
import { motion } from 'framer-motion';
import Card from '../common/Card';
import './LearningStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEar, faBook, faRunning } from '@fortawesome/free-solid-svg-icons';

const LearningStyles = () => {
  const styles = [
    {
      title: 'Visual Learning',
      description: 'Learn through seeing and watching demonstrations',
      icon: faEye
    },
    {
      title: 'Auditory Learning',
      description: 'Learn through listening and discussion',
      icon: faEar
    },
    {
      title: 'Reading/Writing',
      description: 'Learn through reading and taking notes',
      icon: faBook
    },
    {
      title: 'Kinesthetic',
      description: 'Learn through doing and practicing',
      icon: faRunning
    }
  ];

  return (
    <section className="learning-styles-section">
      <div className="styles-grid">
        {styles.map((style, index) => (
          <Card key={index} className="style-card" icon={style.icon}>
            <div className="style-icon"><FontAwesomeIcon icon={style.icon} /></div>
            <h3>{style.title}</h3>
            <p>{style.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LearningStyles;
```

---

## /src/components/chat/ChatUI.css

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
}

.message {
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: auto;
  text-align: right;
}

.message.tutor {
  background-color: #f5f5f5;
  margin-right: auto;
}

.message.processing {
  background-color: #fafafa;
  opacity: 0.7;
  font-style: italic;
}

.input-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.input-container input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.input-container button {
  padding: 0.75rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.input-container button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.input-container input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
```

---

## /src/components/chat/ChatUI.tsx

```tsx
import React, { useState } from 'react';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';
import './ChatUI.css';

interface Message {
  sender: 'user' | 'tutor';
  text: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser?.uid) return;
    
    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const chatId = 'default';
      const response = await CheshireService.sendChatMessage(
        inputText,
        currentUser.uid,
        chatId
      );

      const tutorMessage: Message = {
        sender: 'tutor',
        text: response.data
      };
      setMessages(prev => [...prev, tutorMessage]);

      const memories = response.memories || [];
      if (memories.length > 0) {
        const learningStyleMemory = memories.find(
          memory => memory.metadata?.learning_style
        );
        if (learningStyleMemory?.metadata?.learning_style) {
          console.log('Learning style detected:', learningStyleMemory.metadata.learning_style);
        }
      }
    } catch (error) {
      const errorMessage = CheshireService.getErrorMessage(error);
      setMessages(prev => [...prev, { sender: 'tutor', text: errorMessage }]);
    } finally {
      setIsProcessing(false);
    }
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isProcessing && (
          <div className="message tutor processing">
            Thinking...
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          placeholder="Type your message..."
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
          disabled={isProcessing}
        />
        <button 
          onClick={handleSend}
          disabled={isProcessing || !inputText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
```

---

## /src/components/chat/LearningStyleChat.tsx

```tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Message from '../Message';
import { saveLearningStyle, updateStudentAssessmentStatus } from '../../services/profileService';
import { CheshireService } from '../../services/cheshireService';
import { LearningStyle } from '../../types/profiles';

type ValidLearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

interface CheshireResponse {
  data: string;
  memories?: Array<{
    metadata?: {
      learning_style?: string;
    };
  }>;
}

interface CheshireError {
  code?: string;
  message: string;
}

const isValidLearningStyle = (style: string): style is ValidLearningStyle => {
  return ['visual', 'auditory', 'kinesthetic', 'reading/writing'].includes(style);
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const LearningStyleChat: React.FC<{ studentId?: string }> = ({ studentId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Initialize chat with assessment start message
  useEffect(() => {
    setMessages([{ 
      text: "Hi! I'm here to help assess your learning style. Let's start with a few questions. How do you prefer to learn new things?", 
      sender: "bot" 
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check API connection on mount and set up periodic checks
  useEffect(() => {
    checkApiConnection();
    const intervalId = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const checkApiConnection = async (): Promise<void> => {
    const isConnected = await CheshireService.checkConnection();
    setConnectionError(!isConnected);
  };

  const retryWithDelay = async (fn: () => Promise<void>, maxRetries = 3, delay = 1000): Promise<void> => {
    try {
      return await fn();
    } catch (error) {
      if (maxRetries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithDelay(fn, maxRetries - 1, delay);
      }
      throw error;
    }
  };

  const handleResponse = async (response: CheshireResponse): Promise<void> => {
    const rawLearningStyle = response?.memories?.find(m => m.metadata?.learning_style)?.metadata?.learning_style;
    if (rawLearningStyle && isValidLearningStyle(rawLearningStyle) && studentId) {
      const learningStyle: LearningStyle = {
        type: rawLearningStyle,
        strengths: [],
        recommendations: []
      };
      try {
        await saveLearningStyle(studentId, learningStyle);
        await updateStudentAssessmentStatus(studentId, "completed");
      } catch (error) {
        console.error('Error saving learning style:', error);
        setMessages(prev => [...prev, { 
          text: "There was an error saving your learning style. Please try again.", 
          sender: "bot" 
        }]);
      }
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      setLoading(true);
      const response = await CheshireService.sendChatMessage(
        userMessage,
        currentUser?.uid || 'anonymous',
        studentId || 'default'
      );

      if (response) {
        setMessages(prev => [...prev, { text: response.data, sender: 'bot' }]);
        await handleResponse(response);
      }
      
      setConnectionError(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = CheshireService.getErrorMessage(error as CheshireError);
      setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
      setConnectionError(true);
      await checkApiConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer className="card">
      <ChatHeader>
        🎓 Learning Style Assessment
        {connectionError && (
          <ConnectionError>
            ⚠️ Connection Error - Check if the chat service is running
          </ConnectionError>
        )}
      </ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>{msg.text}</Message>
        ))}
        {loading && <Message sender="bot">Typing...</Message>}
        <div ref={chatEndRef} />
      </ChatBody>
      <ChatFooter>
        <ChatInput
          type="text"
          value={input}
          placeholder="Type your response..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="form-input"
        />
        <SendButton onClick={sendMessage} className="btn btn-primary">
          <FaPaperPlane />
        </SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const ConnectionError = styled.div`
  color: var(--color-error);
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
`;

const ChatFooter = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid #eee;
`;

const ChatInput = styled.input`
  flex: 1;
`;

const SendButton = styled.button`
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default LearningStyleChat;
```

---

## /src/components/chat/TestChat.tsx

```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheshireService } from '../../services/cheshireService';
import { useAuth } from '../../contexts/AuthContext';

const TestChat: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');
  const [testMessage, setTestMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { currentUser } = useAuth();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await CheshireService.checkConnection();
      setConnectionStatus(isConnected ? 'Connected ✅' : 'Not connected ❌');
    } catch (error) {
      setConnectionStatus('Connection failed ❌');
      setError(CheshireService.getErrorMessage(error));
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim() || !currentUser?.uid) return;

    try {
      setError('');
      const result = await CheshireService.sendChatMessage(
        testMessage,
        currentUser.uid,
        'test'
      );
      setResponse(result.data);
      if (result.memories?.length) {
        console.log('Memories received:', result.memories);
      }
    } catch (error) {
      setError(CheshireService.getErrorMessage(error));
    }
  };

  return (
    <TestContainer>
      <TestCard>
        <h2>Cheshire Service Test</h2>
        
        <StatusSection>
          <h3>Connection Status:</h3>
          <StatusText>{connectionStatus}</StatusText>
          <RefreshButton onClick={checkConnection}>
            Refresh Connection
          </RefreshButton>
        </StatusSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <TestSection>
          <h3>Send Test Message:</h3>
          <TestInput
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
          />
          <SendButton 
            onClick={handleTestMessage}
            disabled={!testMessage.trim() || !currentUser}
          >
            Send Message
          </SendButton>
        </TestSection>

        {response && (
          <ResponseSection>
            <h3>Response:</h3>
            <ResponseText>{response}</ResponseText>
          </ResponseSection>
        )}
      </TestCard>
    </TestContainer>
  );
};

const TestContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--background);
`;

const TestCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }

  h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const StatusSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const StatusText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const TestSection = styled.div`
  margin-bottom: 2rem;
`;

const TestInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ResponseSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ResponseText = styled.div`
  white-space: pre-wrap;
  font-family: monospace;
  padding: 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled(Button)`
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
`;

const SendButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
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

export default TestChat;
```

---

## /src/components/shared/ErrorBoundary.tsx

```tsx
import React, { Component, ErrorInfo } from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      isOffline: !navigator.onLine
    };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
    if (navigator.onLine && this.state.error?.message.includes('offline')) {
      // Clear offline-related errors when back online
      this.setState({ hasError: false, error: null });
    }
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isOffline: !navigator.onLine
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if error is Firebase offline error
      const isFirebaseOffline = this.state.error?.message.includes('offline') || 
                               this.state.error?.message.includes('network');

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>
              {this.state.isOffline ? '📡 You\'re Offline' : '❌ Something went wrong'}
            </ErrorTitle>
            
            <ErrorMessage>
              {this.state.isOffline || isFirebaseOffline ? (
                <>
                  <p>It looks like you're offline or having connection issues.</p>
                  <p>Some features may be limited until you're back online.</p>
                  <p>Your data will sync automatically when you reconnect.</p>
                </>
              ) : (
                <>
                  <p>An unexpected error occurred.</p>
                  <p>{this.state.error?.message}</p>
                </>
              )}
            </ErrorMessage>

            <RetryButton 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try Again
            </RetryButton>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: rgba(0, 0, 0, 0.05);
`;

const ErrorCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #4a5568;
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
  }
`;

const RetryButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3182ce;
  }
`;

export default ErrorBoundary;
```

---

## /src/components/shared/styles/Button.css

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

/* Authentication Components Styling */
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.auth-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-md) 0;
  text-align: center;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.auth-divider span {
  padding: 0 var(--spacing-sm);
  color: #666;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--white);
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.google-button:hover {
  background-color: #f5f5f5;
}

.auth-error {
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.auth-success {
  color: #4CAF50;
  text-align: center;
  margin-bottom: var(--spacing-md);
}

/* Form validation styling */
.auth-input.error {
  border-color: var(--secondary-color);
}

.error-message {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}
```

---

## /src/components/features/vue/VueComponent.tsx

```tsx
/src/components/features/vue/VueComponent.tsx

import React from 'react';
import VueComponentWrapper from './VueComponentWrapper';

interface VueComponentProps {
  // Add any props if needed
}

const VueComponent: React.FC<VueComponentProps> = () => {
  return (
    <div>
      <h1>React + Vue Integration</h1>
      <VueComponentWrapper />
    </div>
  );
};

export default VueComponent;
```

---

## /src/components/features/vue/VueWrapper.tsx

```tsx
import React, { useEffect, useRef } from 'react';
import { createApp, App } from 'vue';

interface VueWrapperProps {
  component: any; // Vue component
  props?: Record<string, any>;
}

const VueWrapper: React.FC<VueWrapperProps> = ({ component, props = {} }) => {
  const vueRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (!vueRef.current || !component) return;

    if (!appRef.current) {
      appRef.current = createApp(component, props);
      appRef.current.mount(vueRef.current);
    }

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component, props]);

  return <div ref={vueRef} />;
};

export default VueWrapper;
```

---

## /src/components/features/learning/LearningStyleInsightsWrapper.tsx

```tsx
/src/components/features/learning/LearningStyleInsightsWrapper.tsx

import React from 'react';
import VueWrapper from '../vue/VueWrapper';
import LearningStyleInsights from './LearningStyleInsights.vue';

interface LearningStyleInsightsWrapperProps {
  studentData?: any; // Add proper typing based on your Vue component props
}

const LearningStyleInsightsWrapper: React.FC<LearningStyleInsightsWrapperProps> = ({ studentData }) => {
  return <VueWrapper component={LearningStyleInsights} props={{ studentData }} />;
};

export default LearningStyleInsightsWrapper;
```

---

## /src/components/styles/CoreValues.styles.ts

```typescript
import styled from 'styled-components';

export const CoreValuesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  text-align: center;
  padding: 1.5rem 0;
`;

export const CoreValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;
```

---

## /src/firebase/auth-service-worker.ts

```typescript
// File: /src/firebase/auth-service-worker.ts
// Description: Service worker initialization with enhanced security
// Author: GitHub Copilot
// Created: 2024-02-12

import { enableIndexedDbPersistence, type FirestoreSettings } from 'firebase/firestore';
import { db } from './config';

interface ServiceWorkerError extends Error {
  name: string;
  code?: string;
}

interface AuthServiceWorkerMessage {
  type: string;
  status?: number;
  ok?: boolean;
  fallbackToRedirect?: boolean;
  error?: string;
  secure?: boolean;
}

interface ServiceWorkerRegistrationResult {
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}

const SW_TIMEOUT = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || 10000;
const MAX_RETRIES = Number(import.meta.env.VITE_MAX_AUTH_RETRIES) || 3;

const isSecureContext = (): boolean => {
  return window.isSecureContext && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let retryCount = 0;

const registerWithRetry = async (): Promise<ServiceWorkerRegistration> => {
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth',
      type: 'module',
      updateViaCache: 'none'
    });
    return registration;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return registerWithRetry();
    }
    throw error;
  }
};

export const registerAuthServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: false,
      error: 'Service workers are not supported in this browser'
    };
  }

  if (!isSecureContext()) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: true,
      error: 'Secure context required for authentication'
    };
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));

    serviceWorkerRegistration = await registerWithRetry();

    const activationPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service worker activation timeout'));
      }, SW_TIMEOUT);

      if (serviceWorkerRegistration?.active) {
        clearTimeout(timeout);
        resolve();
        return;
      }

      serviceWorkerRegistration?.addEventListener('activate', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    await activationPromise;

    return {
      success: true,
      isSecure: isSecureContext(),
      supportsServiceWorker: true
    };

  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: true,
      error: error instanceof Error ? error.message : 'Service worker registration failed'
    };
  }
};

export const initAuthServiceWorker = async (): Promise<boolean> => {
  const result = await registerAuthServiceWorker();
  
  window.dispatchEvent(new CustomEvent('firebase-auth-worker-status', { 
    detail: result 
  }));

  if (!result.success) {
    console.warn('Auth service worker initialization failed:', result.error);
    return false;
  }

  // Initialize Firestore persistence after successful service worker registration
  try {
    const settings: FirestoreSettings = {
      cacheSizeBytes: 50000000, // 50 MB
    };
    
    await enableIndexedDbPersistence(db);
    
    return true;
  } catch (error) {
    console.error('Failed to enable persistence:', error);
    return false;
  }
};

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error, secure } = event.data;

  const dispatch = (eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      dispatch('firebase-auth-worker-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      dispatch('firebase-auth-popup-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect && import.meta.env.VITE_AUTH_POPUP_FALLBACK === 'true') {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      dispatch('firebase-auth-error', { error, fallbackToRedirect });
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        dispatch('firebase-auth-error', { status, error });
      } else {
        dispatch('firebase-auth-success', { status });
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
        dispatch('firebase-auth-security', { secure: false });
      }
      break;
  }
}

navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

export default initAuthServiceWorker;
```

---

## /src/firebase/auth-service.ts

```typescript
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, Auth } from "firebase/auth";
import { auth } from './config';

export class AuthService {
  private provider: GoogleAuthProvider;
  private initialized: boolean = false;
  private popupOpen: boolean = false;
  private _auth: Auth;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
      scope: 'email profile'
    });
    this._auth = auth;
  }

  get auth(): Auth {
    return this._auth;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await new Promise<void>((resolve) => {
        const unsubscribe = this._auth.onAuthStateChanged(() => {
          unsubscribe();
          this.initialized = true;
          resolve();
        });
      });
    }
  }

  async signInWithGoogle() {
    try {
      if (this.popupOpen) {
        throw new Error('Authentication popup is already open');
      }

      await this.ensureInitialized();
      this.popupOpen = true;

      const result = await signInWithPopup(this._auth, this.provider);
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled by user');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked. Please allow popups for this site');
      }
      throw new Error(error.message || 'Failed to sign in with Google');
    } finally {
      this.popupOpen = false;
    }
  }

  async signOut() {
    try {
      await this.ensureInitialized();
      await firebaseSignOut(this._auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }
}
```

---

## /src/firebase/config.ts

```typescript
// File: /src/firebase/config.ts
// Description: Firebase configuration with Firestore persistence setup

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  type Auth
} from 'firebase/auth';
import { 
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentSingleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache settings
export const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({ forceOwnership: true }),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Initialize Auth with persistence and popup support (preferred method)
export const auth: Auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Initialize Analytics
export const analytics: Analytics = getAnalytics(app);

// Export app instance for other Firebase services
export { app as firebase };
```

---

## /src/utils/animations.js

```javascript
export const pageTransitions = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.2 }
  },
};

export const containerVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20 
  }
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 }
};
```

---

## /src/contexts/AuthContext.tsx

```tsx
// File: /src/contexts/AuthContext.tsx
// Description: Context for authentication using Firebase
// Author: GitHub Copilot
// Created: 2024-02-12

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../firebase/auth-service';

export interface AuthContextProps {
  currentUser: User | null;
  isAuthReady: boolean;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    const unsubscribe = authService.auth.onAuthStateChanged((firebaseUser: User | null) => {
      setCurrentUser(firebaseUser);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextProps = {
    currentUser,
    isAuthReady,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## /src/contexts/ProfileContext.tsx

```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  learningStyle?: string;
  grade?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
```

---

## /src/test/mockThemes.ts

```typescript
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

---

## /src/test/setup.ts

```typescript
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

---

## /src/test/testUtils.tsx

```tsx
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

---

## /src/styles/global.css

```css
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

---

## /src/styles/global.ts

```typescript
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

---

## /src/styles/theme.js

```javascript

```

---

## /src/styles/components/common.ts

```typescript
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

---

## /.vscode/settings.json

```json
{
    "github.copilot.chat.followUps": "always",
    "github.copilot.chat.scopeSelection": true,
    "github.copilot.chat.edits.codesearch.enabled": true,
    "github.copilot.nextEditSuggestions.enabled": true,
    "github.copilot.chat.completionContext.typescript.mode": "on",
    "github.copilot.chat.editor.temporalContext.enabled": true,
    "github.copilot.chat.enableUserPreferences": true,
    "github.copilot.chat.generateTests.codeLens": true,
    "github.copilot.chat.languageContext.typescript.enabled": true,
    "github.copilot.chat.search.semanticTextResults": true,
    "files.autoSave": "afterDelay",
    "editor.wordWrap": "on",
    "github.copilot.chat.codeGeneration.useInstructionFiles": true,
    "github.copilot.chat.edits.temporalContext.enabled": true,

    "github.copilot.chat.testGeneration.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.test.tsx",
            "instructions": "Generate unit tests using Jest & React Testing Library. Cover both success and failure cases. Use Mock Service Worker (MSW) for API mocking."
        },
        {
            "file": "",
            "filePattern": "backend/tests/**/*.py",
            "instructions": "Use FastAPI TestClient and Pytest for backend tests. Ensure JWT authentication and RBAC security tests are included."
        },
        {
            "file": "",
            "filePattern": "src/pages/**/*.test.tsx",
            "instructions": "For integration tests, use Cypress with end-to-end scenarios covering user authentication, navigation, and API calls."
        }
    ],

    "github.copilot.chat.commitMessageGeneration.instructions": [
        {
            "file": "",
            "filePattern": "*",
            "instructions": "Format commit messages using Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`. Provide a short, clear summary in the present tense."
        }
    ],

    "github.copilot.chat.reviewSelection.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Ensure TypeScript compliance, proper prop typing, and React best practices. Avoid inline styles; prefer Styled Components or Tailwind CSS."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Ensure FastAPI routes use Pydantic models for validation, JWT authentication, and RBAC. Implement proper error handling and response models."
        },
        {
            "file": "",
            "filePattern": ".github/workflows/*.yml",
            "instructions": "Validate CI/CD pipeline integrity. Ensure workflows include ESLint, Jest, Cypress, and dependency security scans."
        }
    ],

    "github.copilot.chat.codeReview.instructions": [
        {
            "file": "",
            "filePattern": "src/**/*.tsx",
            "instructions": "Check for performance optimizations, React hooks best practices, and clean code formatting. Ensure absolute imports are used."
        },
        {
            "file": "",
            "filePattern": "backend/**/*.py",
            "instructions": "Validate API endpoint security, response models, and authentication handling. Ensure database queries use ORM best practices."
        },
        {
            "file": "",
            "filePattern": "firestore.rules",
            "instructions": "Ensure Firestore security rules enforce RBAC. No public read/write access unless explicitly required."
        }
    ],
    "github-actions.workflows.pinned.workflows": []
}
```

---

## /dataconnect-generated/js/default-connector/README.md

```markdown
#  Generated TypeScript README
This README will guide you through the process of using the generated TypeScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.
You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

# Accessing the connector
A connector is a collection of queries and mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

In order to call Data Connect queries and mutations, you need to create an instance of the connector in your application code.

```javascript
import { getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```javascript
// add connectDataConnectEmulator to your imports 
import { connectDataConnectEmulator, getDataConnect, DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const connector: DataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(connector, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK. 

# Queries
No queries were generated for the `default` connector.

If you want to learn more about how to use queries in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

# Mutations
No mutations were generated for the `default` connector.

If you want to learn more about how to use mutations in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).
```

---

## /dataconnect-generated/js/default-connector/index.cjs.js

```javascript
const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;
```

---

## /dataconnect-generated/js/default-connector/index.d.ts

```typescript
import { ConnectorConfig, DataConnect } from 'firebase/data-connect';
export const connectorConfig: ConnectorConfig;

export type TimestampString = string;

export type UUIDString = string;

export type Int64String = string;

export type DateString = string;
```

---

## /dataconnect-generated/js/default-connector/package.json

```json
{
  "name": "@firebasegen/default-connector",
  "version": "1.0.0",
  "author": "Firebase <firebase-support@google.com> (https://firebase.google.com/)",
  "description": "Generated SDK For default",
  "license": "Apache-2.0",
  "engines": {
    "node": " >=18.0"
  },
  "typings": "index.d.ts",
  "module": "esm/index.esm.js",
  "main": "index.cjs.js",
  "browser": "esm/index.esm.js",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "require": "./index.cjs.js",
      "default": "./esm/index.esm.js"
    },
    "./package.json": "./package.json"
  },
  "peerDependencies": {
    "firebase": "^10.14.0 || ^11.0.0"
  }
}
```

---

## /dataconnect-generated/js/default-connector/esm/index.esm.js

```javascript
export const connectorConfig = {
  connector: 'default',
  service: 'geaux-academy',
  location: 'us-central1'
};
```

---

## /dataconnect-generated/js/default-connector/esm/package.json

```json
{"type":"module"}
```

---

