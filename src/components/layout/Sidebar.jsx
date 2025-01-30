// src/components/layout/Sidebar.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <SidebarContainer isOpen={isSidebarOpen}>
      <CloseButton onClick={() => setSidebarOpen(false)}>×</CloseButton>
      <Nav>
        <NavItem to="/">🏠 Dashboard</NavItem>
        <NavItem to="/curriculum">📖 Curriculum</NavItem>
        <NavItem to="/progress">📊 Progress</NavItem>
        <NavItem to="/profile">👤 Profile</NavItem>
      </Nav>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: ${(props) => (props.isOpen ? '250px' : '0px')};
  transition: width 0.3s ease-in-out;
  background: #f8f9fa;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #ddd;
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 900;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  margin: 10px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const NavItem = styled(Link)`
  padding: 10px;
  font-weight: 600;
  text-decoration: none;
  color: #333;
  display: block;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

export default Sidebar;