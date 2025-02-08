import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  const location = useLocation();
  const isLoggedIn = false; // This will need to be dynamic based on your auth logic

  return (
    <StyledHeaderContainer>
      <StyledLogoSection>
        <Link to="/">
          <StyledLogoImage src="/images/logo.png" alt="Geaux Academy Logo" />
          <h1>Geaux Academy</h1>
        </Link>
      </StyledLogoSection>
      <StyledNavSection>
        <StyledNavLinks>
          <StyledNavItem>
            <StyledNavLink to="/" $isActive={location.pathname === "/"}>Home</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/about" $isActive={location.pathname === "/about"}>About</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/features" $isActive={location.pathname.startsWith("/features")}>Features</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/learning-styles" $isActive={location.pathname.startsWith("/learning-styles")}>Learning Styles</StyledNavLink>
          </StyledNavItem>
          <StyledNavItem>
            <StyledNavLink to="/contact" $isActive={location.pathname === "/contact"}>Contact</StyledNavLink>
          </StyledNavItem>
        </StyledNavLinks>
      </StyledNavSection>
      <StyledAuthButtons>
        {isLoggedIn ? (
          <LogoutButton>Logout</LogoutButton>
        ) : (
          <>
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/signup" className="btn btn-signup">Sign Up</Link>
          </>
        )}
      </StyledAuthButtons>
    </StyledHeaderContainer>
  );
};

// Styled Components
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

const StyledNavLink = styled(Link)<{ $isActive: boolean }>`
  color: var(--text-color, #333);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    color: var(--primary-color, #646cff);
    background: rgba(100, 108, 255, 0.08);
  }

  ${(props) => props.$isActive && `
    color: var(--primary-color, #646cff);
    background: rgba(100, 108, 255, 0.08);
  `}
`;

const StyledAuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;

export default Header;
