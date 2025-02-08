import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  const location = useLocation();
  
  return (
    <StyledHeaderContainer>
      <LogoContainer>
        <StyledLogo src="/images/logo.svg" alt="Geaux Academy Logo" />
      </LogoContainer>
      
      <NavWrapper>
        <StyledNav>
          <StyledNavLink to="/" $active={location.pathname === '/'}>
            Home
          </StyledNavLink>
          <StyledNavLink to="/about" $active={location.pathname === '/about'}>
            About
          </StyledNavLink>
          <StyledNavLink to="/features" $active={location.pathname === '/features'}>
            Features
          </StyledNavLink>
          <StyledNavLink to="/curriculum" $active={location.pathname === '/curriculum'}>
            Curriculum
          </StyledNavLink>
          <StyledNavLink to="/contact" $active={location.pathname === '/contact'}>
            Contact
          </StyledNavLink>
        </StyledNav>
      </NavWrapper>

      <AuthButtons>
        <StyledButton to="/login">Login</StyledButton>
        <StyledButton to="/signup" $primary>Sign Up</StyledButton>
      </AuthButtons>
    </StyledHeaderContainer>
  );
};

const StyledHeaderContainer = styled.header`
  position: fixed;
  width: 100%;
  height: 64px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LogoContainer = styled.div`
  flex: 0.7;
`;

const StyledLogo = styled.img`
  height: 50px;
  object-fit: contain;
`;

const NavWrapper = styled.div`
  flex: 2;
  display: flex;
  justify-content: flex-start;
  margin-left: 4%;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const StyledNavLink = styled(Link)<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? "gold" : "white")};
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: gold;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-right: 1.5rem;
`;

const StyledButton = styled(Link)<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  color: white;
  background: ${(props) => (props.$primary ? "gold" : "transparent")};
  border: 2px solid gold;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: white;
    color: black;
  }
`;

export const PageContainer = styled.main`
  max-width: 1200px;
  margin: auto;
  padding: 4rem 2rem;
  text-align: center;
`;

export default Header;
