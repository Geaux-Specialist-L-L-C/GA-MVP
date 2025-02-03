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

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavBrand = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: var(--primary-color);
  }
`;

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
