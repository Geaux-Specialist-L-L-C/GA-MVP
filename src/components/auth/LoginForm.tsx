import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../GoogleLoginButton';
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
      
      <GoogleLoginButton 
        handleGoogleLogin={handleGoogleLogin}
        error={error}
        loading={loading}
        onDismissError={() => setError('')}
      />
      
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
