import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled, { ThemeProvider } from 'styled-components';
import Layout from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import AuthRoute from './components/auth/AuthRoute';
import LoadingSpinner from './components/shared/LoadingSpinner';
import theme from './styles/theme';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Public pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Curriculum = React.lazy(() => import('./pages/Curriculum'));
const Features = React.lazy(() => import('./pages/Features'));
const LearningStyles = React.lazy(() => import('./pages/LearningStyles'));
const VarkStyles = React.lazy(() => import('./pages/VarkStyles'));

// Value pages
const Integrity = React.lazy(() => import('./pages/values/Integrity'));
const Excellence = React.lazy(() => import('./pages/values/Excellence'));
const Innovation = React.lazy(() => import('./pages/values/Innovation'));
const Collaboration = React.lazy(() => import('./pages/values/Collaboration'));

// Auth components
const Login = React.lazy(() => import('./components/auth/LoginForm'));
const SignUpForm = React.lazy(() => import('./components/auth/SignUpForm'));

// Protected pages
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ParentDashboard = React.lazy(() => import('./components/ParentDashboard'));
const ParentProfile = React.lazy(() => import('./components/profile/ParentProfile'));
const TakeAssessment = React.lazy(() => import('./pages/TakeAssessment'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function AppRoutes() {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/learning-styles" element={<LearningStyles />} />
        <Route path="/vark-styles" element={<VarkStyles />} /> {/* Fix the route path */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpForm />} />

        {/* Values Routes */}
        <Route path="/values/integrity" element={<Integrity />} />
        <Route path="/values/excellence" element={<Excellence />} />
        <Route path="/values/innovation" element={<Innovation />} />
        <Route path="/values/collaboration" element={<Collaboration />} />

        {/* Protected Routes */}
        <Route element={<AuthRoute />}>
          <Route path="/create-profile" element={<ParentProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/take-assessment" element={<TakeAssessment />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Error Routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

const MainContent = styled.main`
  margin-top: 70px;
  min-height: calc(100vh - 70px);
  flex: 1;
  position: relative;
  z-index: 1;
`;

function App() {
  return (
    <ErrorBoundary>
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
