import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <NavContainer>
      <NavWrapper>
        <LogoSection>
          <Link to="/">
            <img src="/images/logo.svg" alt="Geaux Academy Logo" height="50" />
          </Link>
        </LogoSection>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/curriculum">Curriculum</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </NavLinks>

        <AuthSection>
          {!currentUser ? (
            <>
              <AuthButton to="/login" $variant="login">Login</AuthButton>
              <AuthButton to="/signup" $variant="signup">Sign Up</AuthButton>
            </>
          ) : (
            <AuthButton to="/dashboard">Dashboard</AuthButton>
          )}
        </AuthSection>
      </NavWrapper>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height, 64px);
  background: var(--navbar-bg, white);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
`;

const NavWrapper = styled.div`
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--spacing-md, 1rem);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: var(--spacing-md, 1rem);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  padding: var(--spacing-xs, 0.5rem);
  transition: color var(--transition-speed, 0.3s) var(--transition-timing, ease);

  &:hover {
    color: var(--link-color);
  }
`;

const AuthSection = styled.div`
  display: flex;
  gap: var(--spacing-sm, 0.75rem);
`;

const AuthButton = styled(Link)<{ $variant?: 'login' | 'signup' }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-speed, 0.3s) var(--transition-timing, ease);
  
  ${props => props.$variant === 'signup' ? `
    background: var(--btn-primary-bg, #C29A47);
    color: var(--btn-primary-text, white);
    
    &:hover {
      background: var(--btn-hover-bg, #B8860B);
    }
  ` : props.$variant === 'login' ? `
    background: var(--btn-secondary-bg, #2C3E50);
    color: var(--btn-secondary-text, white);
    
    &:hover {
      opacity: 0.9;
    }
  ` : `
    color: var(--text-primary);
    
    &:hover {
      color: var(--link-color);
    }
  `}
`;

export default Navbar;