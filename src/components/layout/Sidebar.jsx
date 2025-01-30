// src/components/layout/Sidebar.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <SidebarContainer
      as={motion.div}
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
    >
      <CloseButton onClick={onClose}>×</CloseButton>
      <Nav>
        <NavItem to="/">
          <Icon>🏠</Icon> {isOpen && "Dashboard"}
        </NavItem>
        <NavItem to="/curriculum">
          <Icon>📖</Icon> {isOpen && "Curriculum"}
        </NavItem>
        <NavItem to="/progress">
          <Icon>📊</Icon> {isOpen && "Progress"}
        </NavItem>
        <NavItem to="/profile">
          <Icon>👤</Icon> {isOpen && "Profile"}
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