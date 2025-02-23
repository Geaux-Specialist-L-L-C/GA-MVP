import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';
import { muiTheme, styledTheme } from './theme/theme';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { messaging } from './firebase/config';
import Navigation from './components/Navigation';
import Profile from './pages/Profile';
const Assessment = React.lazy(() => import('./pages/Assessment'));

// Lazy load components with explicit types
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Features = React.lazy(() => import('./pages/Features'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./components/auth/SignUp'));
const LearningStyles = React.lazy(() => import('./pages/LearningStyles'));
const Curriculum = React.lazy(() => import('./pages/Curriculum'));
const ParentDashboard = React.lazy(() => import('./pages/profile/ParentProfile/ParentDashboard'));
const StudentDashboard = React.lazy(() => import('./pages/profile/StudentProfile/StudentDashboard'));
const StudentProfile = React.lazy(() => import('./pages/profile/StudentProfile/StudentProfile'));
const LearningPlan = React.lazy(() => import('./pages/LearningPlan'));
const TakeAssessment = React.lazy(() => import('./pages/TakeAssessment'));
const LearningStyleChat = React.lazy(() => import('./components/chat/LearningStyleChat'));
const TestChat = React.lazy(() => import('./components/chat/TestChat'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App: React.FC = (): JSX.Element => {
  // Register service worker for Firebase messaging
  useEffect(() => {
    const registerServiceWorker = async (): Promise<void> => {
      try {
        // Only register if in secure context and messaging is available
        if ('serviceWorker' in navigator && window.isSecureContext && messaging) {
          // First unregister any existing service workers to ensure clean state
          const existingRegs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(existingRegs.map(reg => reg.unregister()));

          // Register new service worker
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/',
            type: 'module',
            updateViaCache: process.env.NODE_ENV === 'development' ? 'none' : 'imports'
          });

          // Get messaging token
          const currentToken = await messaging.getToken({
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
          });

          if (currentToken) {
            console.debug('FCM registration successful. Token:', currentToken);
          }
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    void registerServiceWorker();
  }, []);
  
  return (
    <ErrorBoundary>
      <MUIThemeProvider theme={muiTheme}>
        <StyledThemeProvider theme={styledTheme}>
          <AppContainer>
            <Suspense fallback={<LoadingSpinner />}>
              <Layout>
                <Navigation />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/assessment" element={<Assessment />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/learning-styles" element={<LearningStyles />} />
                  <Route path="/curriculum" element={<Curriculum />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
                  <Route path="/parent-dashboard" element={<PrivateRoute><ParentDashboard /></PrivateRoute>} />
                  <Route path="/student-dashboard/:id" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
                  <Route path="/student-profile/:id" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />
                  <Route path="/learning-plan" element={<PrivateRoute><LearningPlan /></PrivateRoute>} />
                  <Route path="/assessment/:studentId" element={<PrivateRoute><TakeAssessment /></PrivateRoute>} />
                  <Route path="/learning-style-chat/:studentId" element={<PrivateRoute><LearningStyleChat /></PrivateRoute>} />
                  <Route path="/test-chat" element={<PrivateRoute><TestChat /></PrivateRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Suspense>
          </AppContainer>
        </StyledThemeProvider>
      </MUIThemeProvider>
    </ErrorBoundary>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export default App;
