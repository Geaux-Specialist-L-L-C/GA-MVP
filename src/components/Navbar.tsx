import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <NavbarContainer>
      <NavContent>
        <LogoLink to="/">
          <Logo>Geaux Academy</Logo>
        </LogoLink>
        
        <NavLinks>
          <StyledLink to="/about">About Us</StyledLink>
          <StyledLink to="/curriculum">Curriculum</StyledLink>
          <StyledLink to="/learning-styles">Learning Styles</StyledLink>
          <StyledLink to="/contact">Contact</StyledLink>
          
          {currentUser ? (
            <>
              <StyledLink to="/dashboard">Dashboard</StyledLink>
              <ActionButton onClick={handleLogout}>Log Out</ActionButton>
            </>
          ) : (
            <>
              <ActionButton as={Link} to="/login" $primary>Login</ActionButton>
              <ActionButton as={Link} to="/signup">Sign Up</ActionButton>
            </>
          )}
        </NavLinks>
      </NavContent>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height, 64px);
  background: var(--navbar-bg, white);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--spacing-md, 1rem);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 1rem);

  @media (max-width: 768px) {
    gap: var(--spacing-sm, 0.5rem);
  }
`;

const StyledLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-speed, 0.3s) var(--transition-timing, ease);

  &:hover {
    color: var(--link-color);
  }
`;

interface ActionButtonProps {
  $primary?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-speed, 0.3s) var(--transition-timing, ease);
  border: none;
  cursor: pointer;
  
  background-color: ${props => props.$primary ? 'var(--btn-primary-bg, #D4AF37)' : 'transparent'};
  color: ${props => props.$primary ? 'var(--btn-primary-text, #FFFFFF)' : 'var(--text-primary)'};
  border: 1px solid ${props => props.$primary ? 'var(--btn-primary-bg, #D4AF37)' : 'currentColor'};

  &:hover {
    background-color: ${props => props.$primary ? 'var(--btn-hover-bg, #C19B26)' : 'var(--light-bg)'};
  }
`;

export default Navbar;