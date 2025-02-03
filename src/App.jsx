import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';

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
  const { currentUser } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/student-profile" element={
              <ProtectedRoute>
                <StudentProfileLegacy />
              </ProtectedRoute>
            } />
            <Route path="/student-dashboard" element={
              <ProtectedRoute>
                <StudentDashboardFormLegacy />
              </ProtectedRoute>
            } />
            <Route path="/parent-profile" element={
              <ProtectedRoute>
                <ParentProfileLegacy />
              </ProtectedRoute>
            } />
            <Route path="/parent-profile-form" element={
              <ProtectedRoute>
                <ParentProfileFormLegacy />
              </ProtectedRoute>
            } />
            <Route path="/parent-dashboard" element={
              <ProtectedRoute>
                <ParentDashboardFormLegacy />
              </ProtectedRoute>
            } />

            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
