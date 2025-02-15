import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { Theme } from '../../theme';

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
        role="button"
        aria-busy={loading}
      >
        <FcGoogle />
        <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
      </LoginButton>
    </ButtonContainer>
  );
};

interface StyledProps {
  theme: Theme;
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }: StyledProps) => theme.spacing.md};
  width: 100%;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }: StyledProps) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }: StyledProps) => theme.spacing.md};
  border: 1px solid ${({ theme }: StyledProps) => theme.colors.border};
  border-radius: ${({ theme }: StyledProps) => theme.borderRadius.default};
  background: white;
  color: ${({ theme }: StyledProps) => theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }: StyledProps) => theme.colors.background.hover};
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
  padding: ${({ theme }: StyledProps) => theme.spacing.sm};
  background-color: ${({ theme }: StyledProps) => theme.colors.error.light};
  color: ${({ theme }: StyledProps) => theme.colors.error.main};
  border-radius: ${({ theme }: StyledProps) => theme.borderRadius.default};
  font-size: 0.875rem;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: ${({ theme }: StyledProps) => theme.spacing.xs};
  margin-left: ${({ theme }: StyledProps) => theme.spacing.sm};

  &:hover {
    opacity: 0.8;
  }
`;

export default GoogleLoginButton;
