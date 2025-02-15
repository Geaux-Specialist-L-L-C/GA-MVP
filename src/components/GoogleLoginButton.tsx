import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import type { DefaultTheme } from 'styled-components';

interface GoogleLoginButtonProps {
  handleGoogleLogin: () => Promise<void>;
  loading?: boolean;
  error?: string;
  onDismissError?: () => void;
}

interface StyledProps {
  theme: DefaultTheme;
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
        aria-label="sign in with google"
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
