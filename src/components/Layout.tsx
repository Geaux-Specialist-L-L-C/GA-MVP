import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { currentUser } = useAuth();

  return (
    <LayoutWrapper>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  padding-top: 64px; /* Matches header height */
`;

const PageContainer = styled.main`
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  text-align: center;
`;

export default Layout;
