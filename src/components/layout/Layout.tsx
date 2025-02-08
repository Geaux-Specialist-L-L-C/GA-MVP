import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../Header';
import Footer from '../Footer';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/global.css';

const Layout = () => {
  const { currentUser } = useAuth();

  return (
    <LayoutWrapper>
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height);
`;

const PageContainer = styled.main`
  flex: 1;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: var(--spacing-sm);
  }
`;

export default Layout;
