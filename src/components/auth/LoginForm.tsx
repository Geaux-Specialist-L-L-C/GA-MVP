import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import './auth.css';

const LoginForm = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      // Navigation is handled in AuthContext after successful login
    } catch (err) {
      // The error message is already user-friendly from AuthContext
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      if (err instanceof Error && err.message.includes('popup')) {
        console.info('Google login popup interaction:', err.message);
      } else {
        console.error('Login error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container card">
      <h2 className="auth-title">Welcome Back</h2>
      
      {error && (
        <div className="auth-error" role="alert">
          <span>{error}</span>
          {error.includes('popup') && (
            <button 
              className="auth-error-dismiss" 
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          )}
        </div>
      )}
      
      <button 
        className="google-button" 
        onClick={handleGoogleLogin} 
        disabled={loading}
      >
        <FcGoogle size={20} />
        <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
      </button>
      
      <div className="auth-divider">
        <span>New to Geaux Academy?</span>
      </div>
      
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/signup')}
      >
        Create an Account
      </button>
    </div>
  );
};

export default LoginForm;
