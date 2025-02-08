import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';

const SignUp = () => {
  const navigate = useNavigate();
  const { createUser, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign up with Google');
    }
    setLoading(false);
  };

  return (
    <Container>
      <FormBox>
        <h2>Sign Up</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </FormGroup>
          <SignUpButton type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </SignUpButton>
        </form>
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <GoogleButton onClick={handleGoogleSignUp} disabled={loading}>
          <FcGoogle size={20} />
          Sign up with Google
        </GoogleButton>
        
        <LoginLink>
          Already have an account? <StyledLink to="/login">Log In</StyledLink>
        </LoginLink>
      </FormBox>
    </Container>
  );
};

export default SignUp;

/* ------------------ Styled Components ------------------ */

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
`;

const FormBox = styled.div`
  width: 380px;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #333;
  }
`;

const FormGroup = styled.div`
  text-align: left;
  margin-bottom: 1.2rem;
  
  label {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ddd;
    transition: 0.2s;
    
    &:focus {
      border-color: #007bff;
      outline: none;
    }
  }
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  font-weight: 600;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  
  svg {
    margin-right: 10px;
  }

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  
  span {
    padding: 0 10px;
    color: #777;
    font-size: 0.9rem;
  }
`;

const LoginLink = styled.div`
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #ffdddd;
  color: #d8000c;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;
