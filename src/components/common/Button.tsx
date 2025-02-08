// filepath: /src/components/common/Button.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

/**
 * ButtonProps interface
 * @property {React.ReactNode} children - Elements or text inside the button
 * @property {() => void} [onClick] - Optional click handler
 * @property {'primary' | 'secondary'} [variant] - Button style variant
 * @property {React.CSSProperties} [style] - Inline styles
 */
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;  // ✅ NEW: Allows navigation
  variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
}

/**
 * Reusable Button component
 * @component
 * @example
 * return (
 *   <Button onClick={handleClick} variant="primary">
 *     Click Me
 *   </Button>
 * )
 */
const Button: React.FC<ButtonProps> = ({ children, onClick, to, variant = 'primary', style }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to); // ✅ Navigate to specified route
    } else if (onClick) {
      onClick(); // ✅ Call custom onClick if provided
    }
  };

  return (
    <StyledButton onClick={handleClick} variant={variant} style={style}>
      {children}
    </StyledButton>
  );
};

export default Button;

/* ------------------------------------------
   Styled Components
------------------------------------------ */
const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #ffffff;

  /* Base Styles */
  background-color: ${({ variant }) =>
    variant === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)'};

  /* Hover Modifiers */
  &:hover {
    background-color: ${({ variant }) =>
      variant === 'primary'
        ? 'var(--primary-color-dark)'
        : 'var(--secondary-color-dark)'};
  }

  /* Media Queries */
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;
