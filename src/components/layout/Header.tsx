import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  const location = useLocation();
  const isLoggedIn = false; // Replace with authentication logic

  return (
    <StyledHeaderContainer>
      <Link to="/">
        <StyledLogo src="/images/logo.svg" alt="Geaux Academy Logo" />
      </Link>
      <StyledNav>
        <StyledNavLink to="/" active={location.pathname === "/"}>Home</StyledNavLink>
        <StyledNavLink to="/about" active={location.pathname === "/about"}>About</StyledNavLink>
        <StyledNavLink to="/features" active={location.pathname.startsWith("/features")}>Features</StyledNavLink>
        <StyledNavLink to="/learning-styles" active={location.pathname.startsWith("/learning-styles")}>Learning Styles</StyledNavLink>
        <StyledNavLink to="/contact" active={location.pathname === "/contact"}>Contact</StyledNavLink>
      </StyledNav>
      <StyledAuthButtons>
        {isLoggedIn ? (
          <LogoutButton>Logout</LogoutButton>
        ) : (
          <>
            <StyledButton to="/login">Login</StyledButton>
            <StyledButton to="/signup" primary>Sign Up</StyledButton>
          </>
        )}
      </StyledAuthButtons>
    </StyledHeaderContainer>
  );
};

// Styled Components
const StyledHeaderContainer = styled.header`
  position: fixed;
  width: 100%;
  height: 64px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledLogo = styled.img`
  height: 50px;
  object-fit: contain;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const StyledNavLink = styled(Link)`
  color: ${(props) => (props.active ? "gold" : "white")};
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;

  &:hover {
    color: gold;
  }
`;

const StyledAuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled(Link)`
  padding: 0.5rem 1rem;
  color: white;
  background: ${(props) => (props.primary ? "gold" : "transparent")};
  border: 2px solid gold;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background: white;
    color: black;
  }
`;

const LogoutButton = styled.button`
  background: red;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: darkred;
  }
`;

export default Header;
