import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link).attrs(({ disabled }) => ({
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

export default StyledLink;
