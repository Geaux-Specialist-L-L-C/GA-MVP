import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { user, googleLogin } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    if (loading) return;
    
    setError('');
    setLoading(true);
    
    try {
      await googleLogin();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in with Google. Please try again.');
        console.error('Google sign in error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}
        <button 
          onClick={handleGoogleSignIn}
          className="google-button"
          disabled={loading}
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <img 
                src="/google-icon.svg" 
                alt="Google" 
              />
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;