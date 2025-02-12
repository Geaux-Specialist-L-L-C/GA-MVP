import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import styled from 'styled-components';

interface GoogleLoginButtonProps {
  handleGoogleLogin: () => Promise<void>;
  error?: string;
  loading?: boolean;
  onDismissError?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  handleGoogleLogin, 
  error,
  loading = false,
  onDismissError
}) => {
  return (
    <Wrapper>
      {error && (
        <ErrorMessage role="alert">
          <ErrorText>{error}</ErrorText>
          <DismissButton 
            onClick={(e) => {
              e.stopPropagation();
              if (onDismissError) {
                onDismissError();
              }
            }}
            aria-label="Dismiss error"
          >
            ✕
          </DismissButton>
        </ErrorMessage>
      )}
      <Button
        onClick={handleGoogleLogin}
        disabled={loading}
        type="button"
      >
        <FcGoogle size={20} />
        <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const Button = styled.button`
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
  transition: background-color 0.2s, border-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #f8f8f8;
    border-color: #ccc;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

const ErrorText = styled.span`
  flex: 1;
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

export default GoogleLoginButton;
