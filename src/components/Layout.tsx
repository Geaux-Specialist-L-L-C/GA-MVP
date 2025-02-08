import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import styled from 'styled-components';

const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  min-height: 100vh;
`;

const Main = styled.main`
  padding-top: 64px; // Same as header height
`;

export default Layout;
