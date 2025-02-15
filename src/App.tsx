import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';
import { muiTheme, styledTheme } from './theme/theme';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Features = React.lazy(() => import('./pages/Features'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const LearningStyles = React.lazy(() => import('./pages/LearningStyles'));
const Curriculum = React.lazy(() => import('./pages/Curriculum'));
const Dashboard = React.lazy(() => import('./pages/profile/Dashboard'));
const ParentDashboard = React.lazy(() => import('./pages/profile/ParentProfile/ParentDashboard'));
const StudentDashboard = React.lazy(() => import('./pages/profile/StudentProfile/StudentDashboard'));
const StudentProfile = React.lazy(() => import('./pages/profile/StudentProfile/StudentProfile'));
const LearningPlan = React.lazy(() => import('./pages/LearningPlan'));
const TakeAssessment = React.lazy(() => import('./pages/TakeAssessment'));
const LearningStyleChat = React.lazy(() => import('./pages/LearningStyleChat'));
const TestChat = React.lazy(() => import('./pages/profile/TestChat'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App: React.FC = (): JSX.Element => {
  useEffect(() => {
    // Initialize service worker for Firebase messaging
    if ('serviceWorker' in navigator && (window.isSecureContext || process.env.NODE_ENV === 'development')) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', {
          scope: '/__/auth/',
          type: 'module',
          updateViaCache: process.env.NODE_ENV === 'development' ? 'none' : 'imports'
        })
        .then((registration) => {
          console.debug('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          // Only log as error in production
          const logMethod = process.env.NODE_ENV === 'production' ? console.error : console.warn;
          logMethod('Service Worker registration failed:', error);
        });
    } else {
      console.debug('Service Worker registration skipped - requires HTTPS or production environment');
    }
  }, []);
  
  return (
    <MUIThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={styledTheme}>
        <AppContainer>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<Features />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/learning-styles" element={<LearningStyles />} />
                <Route path="/curriculum" element={<Curriculum />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/parent-dashboard" element={<PrivateRoute><ParentDashboard /></PrivateRoute>} />
                <Route path="/student-dashboard/:id" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
                <Route path="/student-profile/:id" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />
                <Route path="/learning-plan" element={<PrivateRoute><LearningPlan /></PrivateRoute>} />
                <Route path="/assessment/:studentId" element={<PrivateRoute><TakeAssessment /></PrivateRoute>} />
                <Route path="/learning-style-chat/:studentId" element={<PrivateRoute><LearningStyleChat /></PrivateRoute>} />
                <Route path="/test-chat" element={<PrivateRoute><TestChat /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </AppContainer>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export default App;
