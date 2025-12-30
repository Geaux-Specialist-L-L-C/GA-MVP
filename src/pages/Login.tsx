import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <LoginContainer>
      <LoginContent className="glass-card">
        <LoginCopy>
          <span className="badge">Welcome back</span>
          <h1>Continue your learning journey.</h1>
          <p>Access your personalized dashboard, progress insights, and learning plan.</p>
          <InfoList>
            <li>Secure, one-tap Google sign in</li>
            <li>Instant access to your assessment results</li>
            <li>Personalized learning plan updates</li>
          </InfoList>
        </LoginCopy>

        <LoginBox>
          <Title>Sign in</Title>
          <LoginForm />
          <SignUpPrompt>
            Don't have an account? <StyledLink to="/signup">Sign up</StyledLink>
          </SignUpPrompt>
        </LoginBox>
      </LoginContent>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 20px;
`;

const LoginContent = styled.div`
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const LoginCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  p {
    color: var(--text-secondary);
  }
`;

const InfoList = styled.ul`
  display: grid;
  gap: 0.5rem;
  padding-left: 1.2rem;
  color: var(--text-secondary);
`;

const LoginBox = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
`;

const Title = styled.h1`
  text-align: left;
  color: var(--text-primary);
  margin-bottom: 2rem;
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

export default Login;
