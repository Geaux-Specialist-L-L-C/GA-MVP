// File: /src/components/Layout.tsx
// Description: Common layout container that provides consistent page structure with navbar and proper spacing
// Author: GitHub Copilot
// Created: 2024-02-17

import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./layout/Footer";
import ErrorBoundary from "./shared/ErrorBoundary";

const Layout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Navbar />
      <MainContent>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </MainContent>
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--navbar-height, 64px);
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: var(--max-width, 1200px);
  margin: 0 auto;
  padding: var(--spacing-lg, 2rem) var(--spacing-md, 1rem);

  @media (max-width: 768px) {
    padding: var(--spacing-md, 1rem) var(--spacing-sm, 0.5rem);
  }
`;

export default Layout;