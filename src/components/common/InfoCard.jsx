import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface InfoCardProps {
  icon?: IconProp;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => {
  return (
    <CardContainer>
      {icon && (
        <IconWrapper>
          <FontAwesomeIcon icon={icon} />
        </IconWrapper>
      )}
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardContainer>
  );
};

export default InfoCard;

const CardContainer = styled.div`
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
