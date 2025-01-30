// src/components/layout/Sidebar.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <SidebarContainer isOpen={isSidebarOpen}>
      <CloseButton onClick={() => setSidebarOpen(false)}>×</CloseButton>
      <Nav>
        <NavItem to="/">
          <Icon>🏠</Icon> {isSidebarOpen && "Dashboard"}
        </NavItem>
        <NavItem to="/curriculum">
          <Icon>📖</Icon> {isSidebarOpen && "Curriculum"}
        </NavItem>
        <NavItem to="/progress">
          <Icon>📊</Icon> {isSidebarOpen && "Progress"}
        </NavItem>
        <NavItem to="/profile">
          <Icon>👤</Icon> {isSidebarOpen && "Profile"}
        </NavItem>
      </Nav>
    </SidebarContainer>
  );
};

/* Styled Components */
const SidebarContainer = styled.div`
  position: fixed;
  top: 60px; // Below header
  left: 0;
  height: 100vh;
  width: 250px;
  background: #f8f9fa;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(-250px)")};
  display: flex;
  flex-direction: column;
  border-right: 2px solid #ddd;
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
  display: flex;
  align-items: center;
  padding: 12px;
  font-weight: 600;
  text-decoration: none;
  color: #333;
  transition: background 0.3s ease-in-out, padding 0.3s ease-in-out;
  
  &:hover {
    background: #007bff;
    color: white;
    padding-left: ${(props) => (props.isOpen ? "20px" : "10px")};
  }
`;

const Icon = styled.span`
  margin-right: 10px;
`;

export default Sidebar;