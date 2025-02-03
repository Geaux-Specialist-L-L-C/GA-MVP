import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <Link to="/">
            <LogoImage src="/images/logo.png" alt="Geaux Academy Logo" />
            <LogoText>Geaux Academy</LogoText>
          </Link>
        </LogoSection>

        <Navigation>
          <NavList>
            <NavItem>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/about">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/features">Features</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/curriculum">Curriculum</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact">Contact</NavLink>
            </NavItem>
          </NavList>
        </Navigation>

        <AuthSection>
          <AuthLink to="/login">Login</AuthLink>
          <AuthButton to="/signup">Sign Up</AuthButton>
        </AuthSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  a {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0;
`;

const Navigation = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  padding: 0;
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

const AuthButton = styled(Link)`
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--secondary-color);
  }
`;

export default Header;
