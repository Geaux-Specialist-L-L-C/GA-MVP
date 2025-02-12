import React from 'react';
import { FcGoogle } from 'react-icons/fc';

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
    <>
      {error && (
        <div className="auth-error" role="alert">
          <span>{error}</span>
          <button 
            className="auth-error-dismiss" 
            onClick={(e) => {
              e.stopPropagation();
              if (onDismissError) {
                onDismissError();
              }
            }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="google-button"
      >
        <FcGoogle size={20} />
        <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
      </button>
    </>
  );
};

export default GoogleLoginButton;
