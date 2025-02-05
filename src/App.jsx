import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AuthRoute from './components/auth/AuthRoute';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./components/Login'));
const StudentProfileLegacy = React.lazy(() => import('./pages/StudentProfileLegacy'));
const StudentDashboardFormLegacy = React.lazy(() => import('./pages/StudentDashboardFormLegacy'));
const ParentProfileLegacy = React.lazy(() => import('./pages/ParentProfileLegacy'));
const ParentProfileFormLegacy = React.lazy(() => import('./pages/ParentProfileFormLegacy'));
const ParentDashboardFormLegacy = React.lazy(() => import('./pages/ParentDashboardFormLegacy'));
const About = React.lazy(() => import('./pages/About'));
const Curriculum = React.lazy(() => import('./pages/Curriculum'));
const LearningStyles = React.lazy(() => import('./pages/LearningStyles'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <ProfileProvider>
            <Header />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/learning-styles" element={<LearningStyles />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected Routes */}
                <Route path="/student-profile" element={
                  <AuthRoute>
                    <StudentProfileLegacy />
                  </AuthRoute>
                } />
                <Route path="/student-dashboard" element={
                  <AuthRoute>
                    <StudentDashboardFormLegacy />
                  </AuthRoute>
                } />
                <Route path="/parent-profile" element={
                  <AuthRoute>
                    <ParentProfileLegacy />
                  </AuthRoute>
                } />
                <Route path="/parent-profile-form" element={
                  <AuthRoute>
                    <ParentProfileFormLegacy />
                  </AuthRoute>
                } />
                <Route path="/parent-dashboard" element={
                  <AuthRoute>
                    <ParentDashboardFormLegacy />
                  </AuthRoute>
                } />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />

                {/* Fallback route for unmatched paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
