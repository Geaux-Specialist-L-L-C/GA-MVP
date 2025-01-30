import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for might have been removed or doesn't exist.</p>
      <StyledLink to="/">Return to Home</StyledLink>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;

  h1 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: var(--text-color);
  }
`;

const StyledLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

export default NotFound;
