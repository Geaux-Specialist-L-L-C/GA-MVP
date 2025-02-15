import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconProp | string;
  title?: string;
  description?: string | string[];
  className?: string;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  icon,
  title,
  description,
  children,
  className,
  onClick,
  ...props
}, ref) => {
  const isImagePath = typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'));
  
  return (
    <StyledCard 
      ref={ref}
      className={className} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {icon && (
        <IconContainer>
          {isImagePath ? (
            <img 
              src={icon} 
              alt={title || 'Card icon'}
              crossOrigin={icon.startsWith('http') ? "anonymous" : undefined}
            />
          ) : (
            typeof icon === 'object' && <FontAwesomeIcon icon={icon} />
          )}
        </IconContainer>
      )}
      {title && <CardTitle>{title}</CardTitle>}
      {description && (
        Array.isArray(description) ? (
          <CardList>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </CardList>
        ) : (
          <CardDescription>{description}</CardDescription>
        )
      )}
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    ${props => props.onClick && `
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    `}
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.palette.primary.main};
  
  img {
    max-width: 48px;
    height: auto;
  }
`;

const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.palette.text.primary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export default Card;
