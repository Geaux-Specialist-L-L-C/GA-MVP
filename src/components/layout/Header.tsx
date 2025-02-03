/src/components/layout/Header.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header: React.FC = () => {
  return (
    <StyledHeaderContainer>
      <StyledLogoSection>
        <StyledLogoImage src="/images/logo.png" alt="Geaux Academy Logo" />
        <h1>Geaux Academy</h1>
      </StyledLogoSection>
      <StyledNavSection>
        <StyledNavLinks>
          <StyledNavItem>
            <StyledNavLink to="/">Home</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/about">About</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/features">Features</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/curriculum">Curriculum</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/contact">Contact</StyledNavLink>
          </StyledNavItem>
        </StyledNavLinks>
      </StyledNavSection>
      <StyledAuthButtons>
        <Link to="/login" className="btn btn-login">Login</Link>
        <Link to="/signup" className="btn btn-signup">Sign Up</Link>
      </StyledAuthButtons>
    </StyledHeaderContainer>
  );
};

const StyledHeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;

const StyledLogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledLogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const StyledNavSection = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const StyledNavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
`;

const StyledNavItem = styled.li`
  position: relative;
`;

const StyledNavLink = styled(Link)`
  color: var(--text-color, #333);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color, #646cff);
  }
`;

const StyledAuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export default Header;
