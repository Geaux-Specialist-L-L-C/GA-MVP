import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

// filepath: /src/components/layout/Layout.jsx
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
