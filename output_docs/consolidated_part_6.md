# Consolidated Files (Part 6)

## src/components/common/Modal.tsx

```
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

## src/components/common/Card.tsx

```
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

## src/components/common/Button.tsx

```
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  $variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children, $variant = 'primary', size = 'medium', ...props }) => {
  const className = `btn btn-${$variant} btn-${size}`;
  
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

  &.btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &.btn-medium {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &.btn-large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
`;

export default Button;

```

## src/components/common/Toast.tsx

```
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

## src/components/common/StyledLink.tsx

```
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

## src/components/common/Input.tsx

```
import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChange, error, ...props }) => {
  return (
    <StyledInput
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      {...props}
    />
  );
};

const StyledInput = styled.input<{ error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ error }) => (error ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? '#dc3545' : '#4a90e2')};
    box-shadow: 0 0 0 2px ${({ error }) => (error ? 'rgba(220, 53, 69, 0.2)' : 'rgba(74, 144, 226, 0.2)')};
  }
`;

export default Input;

```

## src/components/common/LoadingSpinner.tsx

```
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

## src/components/common/types/index.ts

```
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

## src/components/auth/AuthRoute.tsx

```
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

## src/components/auth/SignUp.css

```
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

## src/components/auth/SignUp.tsx

```
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { CheshireService } from '../../services/cheshireService';
import Button from '../common/Button';
import FormGroup from '../molecules/FormGroup';

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
          <FormGroup
            label="Email"
            inputs={[{
              placeholder: 'Enter your email',
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              error: false
            }]}
          />
          <FormGroup
            label="Password"
            inputs={[{
              placeholder: 'Enter your password',
              value: formData.password,
              onChange: (e) => setFormData({ ...formData, password: e.target.value }),
              error: false
            }]}
          />
          <FormGroup
            label="Confirm Password"
            inputs={[{
              placeholder: 'Confirm your password',
              value: formData.confirmPassword,
              onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }),
              error: false
            }]}
          />
          <Button type="submit" $variant="primary">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
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

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
  color: #dc2626;
  &:hover {
    opacity: 0.7;
  }
`;

export default SignUp;

```

## src/components/auth/auth.css

```
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

## src/components/auth/Login.css

```
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

## src/components/auth/LoginForm.tsx

```
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
import Button from '../common/Button';
import FormGroup from '../molecules/FormGroup';
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
    <Form onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      <FormGroup
        label="Email"
        inputs={[{
          placeholder: 'Enter your email',
          value: '',
          onChange: () => {},
          error: false
        }]}
      />
      <FormGroup
        label="Password"
        inputs={[{
          placeholder: 'Enter your password',
          value: '',
          onChange: () => {},
          error: false
        }]}
      />
      <Button type="submit" $variant="primary">
        Login
      </Button>
      <GoogleLoginButton />
    </Form>
  );
};

export default LoginForm;

```

## src/components/auth/AuthErrorDialog.tsx

```
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

## src/components/dashboard/Dashboard.tsx

```
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CreateStudent from '../../pages/profile/ParentProfile/CreateStudent';
import { ProfileService, getStudentProfile } from '../../services/profileService';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
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
        <Button onClick={handleLogout} $variant="primary">
          Logout
        </Button>
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

## src/components/shared/ErrorBoundary.tsx

```
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

## src/components/shared/styles/Button.css

```
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

## src/components/student/StudentCard.tsx

```
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

## src/components/layout/Sidebar.tsx

```

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

## src/components/layout/Navigation.tsx

```
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

## src/components/layout/Header.tsx

```
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

## src/components/layout/Footer.tsx

```
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

## src/components/layout/Layout.tsx

```
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../Navbar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../templates/DashboardLayout';
import '../../styles/global.css';

const Layout = () => {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout
      userData={{
        name: currentUser?.displayName || '',
        email: currentUser?.email || '',
        profilePicture: currentUser?.photoURL || ''
      }}
      routeContext={{ currentRoute: window.location.pathname }}
      onLogout={() => console.log('Logout')}
    >
      <Navbar />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </DashboardLayout>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--navbar-height);
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

## src/components/layout/layout.module.css

```
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

