/src/components/common/Card.tsx

import React from 'react';
import styled from 'styled-components';

/**
 * Card component for displaying content in a card layout
 * @component
 * @example
 * return (
 *   <Card>
 *     <h1>Title</h1>
 *     <p>Description</p>
 *   </Card>
 * )
 */
const Card: React.FC<CardProps> = ({ children }) => {
  return <StyledCard>{children}</StyledCard>;
};

interface CardProps {
  children: React.ReactNode;
}

/* ------------------------------------------
   Styled Components
------------------------------------------ */
const StyledCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export default Card;
