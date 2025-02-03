import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const SignUp = () => {
  const navigate = useNavigate();
  const { createUser, googleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setLoading(true);
    
    try {
      await createUser(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use' 
          ? 'Email already in use. Please try another email or login.'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address'
          : 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.code === 'auth/popup-closed-by-user'
          ? 'Sign up cancelled. Please try again.'
          : err.code === 'auth/popup-blocked'
          ? 'Pop-up blocked. Please allow pop-ups for this site.'
          : 'Failed to sign up with Google. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormBox>
        <h2>Sign Up</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              disabled={loading}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              disabled={loading}
              required
              minLength="6"
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <GoogleButton 
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Sign up with Google'}
        </GoogleButton>
        
        <LoginLink>
          Already have an account? <Link to="/login">Log In</Link>
        </LoginLink>
      </FormBox>
    </FormContainer>
  );
};

// Add these new styled components
const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }
  
  span {
    padding: 0 10px;
    color: #64748b;
    font-size: 0.875rem;
  }
`;

const GoogleButton = styled.button`
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
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #64748b;
  
  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const FormBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
`;

export default SignUp;