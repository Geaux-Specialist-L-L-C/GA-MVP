import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  $variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ to, children, $variant = 'primary', ...props }) => {
  const className = `btn btn-${$variant}`;
  
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
`;

export default Button;
