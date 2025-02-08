import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { ProfileProvider } from './contexts/ProfileContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AuthRoute from './components/auth/AuthRoute';
import theme from './theme/theme';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import TakeAssessment from './pages/TakeAssessment';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Features = React.lazy(() => import('./pages/Features'));
const Login = React.lazy(() => import('./components/Login'));
const StudentProfile = React.lazy(() => import('./pages/profile/StudentProfile/StudentProfile'));
const About = React.lazy(() => import('./pages/About'));
const Curriculum = React.lazy(() => import('./pages/Curriculum'));
const LearningStyles = React.lazy(() => import('./pages/LearningStyles'));
const Contact = React.lazy(() => import('./pages/Contact'));
const SignUp = React.lazy(() => import('./components/auth/SignUp'));

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <ProfileProvider>
          <AppContainer>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/curriculum" element={<Curriculum />} />
                  <Route path="/learning-styles" element={<LearningStyles />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/take-assessment" element={<TakeAssessment />} />
                  <Route path="/student-profile" element={
                    <AuthRoute>
                      <StudentProfile />
                    </AuthRoute>
                  } />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                </Route>
                
                {/* Auth routes outside of Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AppContainer>
        </ProfileProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;