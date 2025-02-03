/src/components/common/Button.tsx

import React from 'react';
import styled from 'styled-components';

/**
 * Button component for reusable button elements
 * @component
 * @example
 * return (
 *   <Button onClick={handleClick}>Click Me</Button>
 * )
 */
const Button: React.FC<ButtonProps> = ({ children, onClick, variant }) => {
  return (
    <StyledButton onClick={onClick} variant={variant}>
      {children}
    </StyledButton>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

/* ------------------------------------------
   Styled Components
------------------------------------------ */
const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  /* Base Styles */
  background-color: ${({ variant }) =>
    variant === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)'};
  color: white;

  /* Modifiers */
  &:hover {
    background-color: ${({ variant }) =>
      variant === 'primary' ? 'var(--primary-color-dark)' : 'var(--secondary-color-dark)'};
  }

  /* Media Queries */
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

export default Button;
