import React, { useEffect, Suspense, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';
import { muiTheme, styledTheme } from './theme/theme';
import { messaging } from './firebase/config';
import { getToken } from 'firebase/messaging';
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
  const registerServiceWorker = async () => {
    try {
      // Only register SW in production or with HTTPS
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.warn('Service Worker registration skipped: HTTPS required');
        return;
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
        type: 'module'
      });

      // Get the messaging instance
      const messaging = getMessaging();
      
      // Get the token
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY',
        serviceWorkerRegistration: registration
      });

      console.log('Service Worker registered. FCM Token:', token);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  useEffect(() => {
    registerServiceWorker();
  }, []);
  
  // Memoize routes to optimize performance
  const routes = useMemo(() => (
    <Routes>
      <Route element={<Layout />}>
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
      </Route>
    </Routes>
  ), []);

  return (
    <StyledThemeProvider theme={styledTheme}>
      <MUIThemeProvider theme={muiTheme}>
        <AppContainer>
          <Suspense fallback={<LoadingSpinner />}>
            {routes}
          </Suspense>
        </AppContainer>
      </MUIThemeProvider>
    </StyledThemeProvider>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export default App;
