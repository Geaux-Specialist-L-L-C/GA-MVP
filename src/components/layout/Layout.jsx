import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <LayoutContainer>
      <Header>
        <HeaderLeft>
          <MenuButton onClick={() => setSidebarOpen(!isSidebarOpen)}>☰</MenuButton>
          <Logo>Geaux Academy</Logo>
        </HeaderLeft>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/curriculum">Curriculum</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </NavLinks>
      </Header>

      <Content>
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <MainContent isSidebarOpen={isSidebarOpen}>{children}</MainContent>
      </Content>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  width: 100%;
  background: #fff;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #ddd;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 15px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-weight: 600;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
  display: block;
`;

const Content = styled.div`
  display: flex;
  height: 100vh;
  margin-top: 60px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease-in-out;
  margin-left: ${(props) => (props.isSidebarOpen ? '250px' : '0px')};

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

export default Layout;