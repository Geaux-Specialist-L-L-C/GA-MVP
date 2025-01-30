import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const Navigation = () => {
  const { currentUser } = useAuth();

  return (
    <Nav>
      <NavBrand to="/">LearnStyle</NavBrand>
      <NavLinks>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/learning-styles">Learning Styles</NavLink>
        {/* Existing nav links */}
        {/* Auth links */}
        {currentUser ? (
          <NavLink to="/dashboard">Dashboard</NavLink>
        ) : (
          <>
            <AuthLink to="/login">Login</AuthLink>
            <SignUpButton to="/signup">Sign Up</SignUpButton>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

// ...existing styled components...

const AuthLink = styled(NavLink)`
  &:hover {
    color: var(--primary-color);
  }
`;

const SignUpButton = styled(Link)`
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background: var(--secondary-color);
  }
`;

export default Navigation;
