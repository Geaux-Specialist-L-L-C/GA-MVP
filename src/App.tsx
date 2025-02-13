import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { muiTheme, styledTheme } from './theme/theme';
import LoadingSpinner from './components/common/LoadingSpinner';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './components/dashboard/Dashboard';
import { ProfileProvider } from './contexts/ProfileContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import LearningStyles from './pages/LearningStyles';
import LearningPlan from './pages/LearningPlan';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Curriculum from './pages/Curriculum';
import './App.css';

// Lazy load components
const SignUp = React.lazy(() => import('./components/auth/SignUp'));
const TakeAssessment = React.lazy(() => import('./pages/TakeAssessment'));
const StudentProfile = React.lazy(() => import('./pages/profile/StudentProfile/StudentProfile'));
const StudentDashboard = React.lazy(() => import('./pages/profile/StudentProfile/StudentDashboard'));
const LearningStyleChat = React.lazy(() => import('./components/chat/LearningStyleChat'));
const ParentDashboard = React.lazy(() => import('./pages/profile/ParentProfile/ParentDashboard'));
const TestChat = React.lazy(() => import('./components/chat/TestChat'));

function PrivateRoute({ element }: { element: React.ReactNode }) {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) return <p>Loading...</p>;
  return user ? element : <Navigate to="/login" />;
}

const App: React.FC = () => {
  return (
    <MUIThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={styledTheme}>
        <ProfileProvider>
          <AuthProvider>
            <AppContainer>
              <Suspense fallback={<LoadingSpinner />}>
                <Router>
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
                      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                      <Route path="/parent-dashboard" element={<ParentDashboard />} />
                      <Route path="/student-dashboard/:id" element={<StudentDashboard />} />
                      <Route path="/student-profile/:id" element={<StudentProfile />} />
                      <Route path="/learning-plan" element={<LearningPlan />} />
                      <Route path="/assessment/:studentId" element={<TakeAssessment />} />
                      <Route path="/learning-style-chat/:studentId" element={<LearningStyleChat />} />
                      <Route path="/test-chat" element={<TestChat />} />

                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Router>
              </Suspense>
            </AppContainer>
          </AuthProvider>
        </ProfileProvider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export default App;
