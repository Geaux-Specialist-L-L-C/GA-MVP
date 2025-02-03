import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Layout } from './components/Layout';
import { AppRoutes } from './routes';
import { theme } from './theme';

const MainContent = styled.main`
  min-height: calc(100vh - 70px);
  flex: 1;
  position: relative;
  z-index: 1;
`;

const ErrorFallback = ({ error }) => (
  <div role="alert">
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
  </div>
);

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Layout>
            <Suspense 
              fallback={<LoadingSpinner />}
            >
              <MainContent>
                <AppRoutes />
              </MainContent>
            </Suspense>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
