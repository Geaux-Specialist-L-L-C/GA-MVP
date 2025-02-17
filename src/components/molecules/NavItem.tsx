import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

interface NavItemProps {
  link: string;
  href?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ link, href, label, icon, onClick }) => {
  return (
    <NavItemContainer>
      <Button to={link} onClick={onClick}>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {label}
      </Button>
    </NavItemContainer>
  );
};

const NavItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
`;

export default NavItem;
