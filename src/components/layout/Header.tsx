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
    </StyledHeaderContainer>
  );
};

const StyledHeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  background: black;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LogoContainer = styled.div`
  flex: 0.8;
`;

const StyledLogo = styled.img`
  height: 50px;
  object-fit: contain;
`;

const NavWrapper = styled.div`
  flex: 2.2;
  display: flex;
  justify-content: flex-start;
  margin-left: 5%;
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

export const PageContainer = styled.main`
  max-width: 1200px;
  margin: auto;
  padding: 4rem 2rem;
  text-align: center;
`;

export default Header;
