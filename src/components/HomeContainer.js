import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    h2 { 
      font-size: 1.5rem; 
    }
  }
`;

export const StyledLink = styled(Link).attrs(({ disabled }) => ({
  role: 'button',
  'aria-disabled': disabled,
}))`
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 1.1rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--secondary-color);
  }

  &:focus-visible {
    outline: 2px dashed var(--secondary-color);
    outline-offset: 4px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
