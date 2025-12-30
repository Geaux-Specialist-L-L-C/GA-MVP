import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';
import AuthRoute from './components/auth/AuthRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import RenderDebugOverlay from './components/debug/RenderDebugOverlay';
import { useAuth } from './contexts/AuthContext';
import { auth } from './config/firebase';
import { ThemeModeProvider } from './theme/ThemeModeContext';

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
const Todos = React.lazy(() => import('./pages/Todos'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const DebugPanel: React.FC = () => {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <DebugPanelContainer>
      <div><strong>Auth Debug</strong></div>
      <div>isAuthReady: {String(isAuthReady)}</div>
      <div>currentUser.uid: {currentUser?.uid ?? 'null'}</div>
      <div>auth.currentUser.uid: {auth.currentUser?.uid ?? 'null'}</div>
      <div>route: {location.pathname}</div>
    </DebugPanelContainer>
  );
};

const App: React.FC = (): JSX.Element => {
  // Register service worker for Firebase messaging
  useEffect(() => {
    const registerServiceWorker = async (): Promise<void> => {
      const enableMessaging = import.meta.env.VITE_ENABLE_MESSAGING === 'true';
      if (!enableMessaging) return;
      if (!('serviceWorker' in navigator)) return;
      if (!window.isSecureContext && import.meta.env.MODE !== 'development') {
        console.debug('[sw] Skipped (insecure context outside dev)');
        return;
      }
      try {
        const qp = new URLSearchParams({
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
          appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
        }).toString();
        const swUrl = `/firebase-messaging-sw.js?${qp}`;
        const registration = await navigator.serviceWorker.register(swUrl, {
          scope: '/',
          type: 'module',
          updateViaCache: import.meta.env.DEV ? 'none' : 'imports'
        });
        console.debug('[sw] Registered:', registration.scope);
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        (import.meta.env.PROD ? console.error : console.warn)('[sw] Registration failed:', msg);
      }
    };
    registerServiceWorker();
  }, []);
  
  return (
    <ErrorBoundary>
      <ThemeModeProvider>
        <AppContainer>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<Features />} />
                <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
                <Route path="/learning-styles" element={<LearningStyles />} />
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/todos" element={<Todos />} />
                
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
          </Suspense>
          <RenderDebugOverlay />
          <DebugPanel />
        </AppContainer>
      </ThemeModeProvider>
    </ErrorBoundary>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const DebugPanelContainer = styled.div`
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 9999;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 8px;
  pointer-events: none;
  max-width: 240px;
  word-break: break-word;
`;

export default App;
