// src/components/common/InfoCard.jsx
import React from 'react';
import styled from 'styled-components';

const InfoCard = ({ title, description, icon }) => {
  const isImagePath = typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'));
  
  return (
    <CardContainer>
      {icon && (
        isImagePath ? (
          <CardIcon 
            as="img" 
            src={icon} 
            alt={title}
            crossOrigin={icon.startsWith('http') ? "anonymous" : undefined}
          />
        ) : (
          <CardIconText>{icon}</CardIconText>
        )
      )}
      <CardTitle>{title}</CardTitle>
      {Array.isArray(description) ? (
        <CardList>
          {description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </CardList>
      ) : (
        <CardDescription>{description}</CardDescription>
      )}
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
`;

const CardIconText = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: var(--text-color);
  line-height: 1.6;
`;

const CardList = styled.ul`
  list-style-position: inside;
  color: var(--text-color);
  line-height: 1.6;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

export default InfoCard;