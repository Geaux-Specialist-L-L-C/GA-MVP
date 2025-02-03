// filepath: /src/components/common/Card.tsx
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

/**
 * CardProps interface
 * @property {IconProp} [icon] - Optional FontAwesome icon
 * @property {string} [title] - Card title
 * @property {string} [description] - Card description text
 * @property {React.ReactNode} [children] - Elements to render inside the card
 * @property {string} [className] - Optional additional class names for styling
 */
interface CardProps {
  icon?: IconProp;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Card component for displaying content in a card layout
 * @component
 * @example
 * return (
 *   <Card icon="coffee" title="Sample Title" description="Sample Description">
 *     <p>Any additional content can go here.</p>
 *   </Card>
 * )
 */
const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  children,
  className,
}) => {
  return (
    <StyledCard className={className}>
      {icon && (
        <IconWrapper>
          <FontAwesomeIcon icon={icon} />
        </IconWrapper>
      )}
      {title && <CardTitle>{title}</CardTitle>}
      {description && <CardDescription>{description}</CardDescription>}
      {children}
    </StyledCard>
  );
};

export default Card;

/* ------------------------------------------
   Styled Components
------------------------------------------ */
const StyledCard = styled.div`
  background: #ffffff;
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

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.25rem;
`;

const CardDescription = styled.p`
  margin: 0 0 1rem;
  color: #666;
  line-height: 1.4;
`;
