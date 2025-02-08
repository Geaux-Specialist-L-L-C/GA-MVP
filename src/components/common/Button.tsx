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
  $variant?: 'primary' | 'secondary';
  style?: React.CSSProperties;
  disabled?: boolean;
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
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  to, 
  $variant = 'primary', 
  style,
  disabled = false 
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyledButton 
      onClick={handleClick} 
      $variant={$variant} 
      style={style}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

/* ------------------------------------------
   Styled Components
------------------------------------------ */
const StyledButton = styled.button<{ $variant: 'primary' | 'secondary'; disabled?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease-in-out;
  border: none;
  
  ${props => props.$variant === 'primary' && `
    background: var(--primary-color);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }
  `}
  
  ${props => props.$variant === 'secondary' && `
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    
    &:hover:not(:disabled) {
      background: var(--primary-color);
      color: white;
    }
  `}

  &:disabled {
    opacity: 0.7;
    background: #ccc;
  }
`;
