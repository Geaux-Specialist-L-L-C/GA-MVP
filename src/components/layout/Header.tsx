/src/components/layout/Header.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../../public/JSX/Header';

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LogoSection>
        <LogoImage src="/images/logo.png" alt="Geaux Academy Logo" />
        <h1>Geaux Academy</h1>
      </LogoSection>
      <NavSection>
        <NavLinks>
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
        </NavLinks>
      </NavSection>
      <AuthButtons>
        <Link to="/login" className="btn btn-login">Login</Link>
        <Link to="/signup" className="btn btn-signup">Sign Up</Link>
      </AuthButtons>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const NavSection = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  color: var(--text-color, #333);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color, #646cff);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export default Header;
