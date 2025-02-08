import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import theme from './theme/theme';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthRoute from '../AuthRoute';
import Login from './pages/Login';
import Dashboard from './components/dashboard/Dashboard';
import { ProfileProvider } from './contexts/ProfileContext';
import Layout from './components/Layout';

// Lazy load other components
const SignUp = React.lazy(() => import('./components/auth/SignUp'));
const TakeAssessment = React.lazy(() => import('./pages/TakeAssessment'));
const StudentProfile = React.lazy(() => import('./pages/profile/StudentProfile/StudentProfile'));
const StudentDashboard = React.lazy(() => import('./pages/profile/StudentProfile/StudentDashboard'));

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ProfileProvider>
        <AppContainer>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Auth routes */}
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              <Route path="/signup" element={
                <AuthRoute>
                  <SignUp />
                </AuthRoute>
              } />

              {/* Protected routes */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/take-assessment" element={<TakeAssessment />} />
                <Route path="/student-profile" element={<StudentProfile />} />
                <Route path="/student-dashboard/:id" element={<StudentDashboard />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppContainer>
      </ProfileProvider>
    </ThemeProvider>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default App;