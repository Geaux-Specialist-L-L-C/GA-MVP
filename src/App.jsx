import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AuthRoute from './components/auth/AuthRoute.tsx';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./components/Login'));
const StudentProfileLegacy = React.lazy(() => import('./pages/StudentProfileLegacy'));
const StudentDashboardFormLegacy = React.lazy(() => import('./pages/StudentDashboardFormLegacy'));
const ParentProfileLegacy = React.lazy(() => import('./pages/ParentProfileLegacy'));
const ParentProfileFormLegacy = React.lazy(() => import('./pages/ParentProfileFormLegacy'));
const ParentDashboardFormLegacy = React.lazy(() => import('./pages/ParentDashboardFormLegacy'));

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
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                
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
