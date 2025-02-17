import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  $variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children, $variant = 'primary', size = 'medium', ...props }) => {
  const className = `btn btn-${$variant} btn-${size}`;
  
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <StyledButton className={className} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &.btn-medium {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &.btn-large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }
`;

export default Button;
