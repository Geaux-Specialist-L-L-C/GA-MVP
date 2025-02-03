import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUsers, FaBook, FaBrain } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          Geaux Academy
        </Logo>
        <NavLinks>
          <NavItem isActive={location.pathname === '/'}>
            <NavLink to="/">
              <FaHome />
              <span>Home</span>
            </NavLink>
          </NavItem>
          <NavItem isActive={location.pathname === '/about'}>
            <NavLink to="/about">
              <FaUsers />
              <span>About Us</span>
            </NavLink>
          </NavItem>
          <NavItem isActive={location.pathname === '/learning-style'}>
            <NavLink to="/learning-style">
              <FaBrain />
              <span>Learning Style</span>
            </NavLink>
          </NavItem>
          <NavItem isActive={location.pathname === '/curriculum'}>
            <NavLink to="/curriculum">
              <FaBook />
              <span>Curriculum</span>
            </NavLink>
          </NavItem>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
`;

const NavItem = styled.li`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--primary-color);
    transform: scaleX(${props => props.isActive ? 1 : 0});
    transition: transform 0.3s ease;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }

  svg {
    font-size: 1.2rem;
  }
`;

export default Navbar;
