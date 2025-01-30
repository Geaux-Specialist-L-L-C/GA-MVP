import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <main>{children}</main>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default Layout;
