import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  z-index: 200;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default Nav;
