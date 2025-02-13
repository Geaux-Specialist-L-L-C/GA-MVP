import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { muiTheme, styledTheme } from './theme/theme';
import LoadingSpinner from './components/common/LoadingSpinner';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './components/dashboard/Dashboard';
import { ProfileProvider } from './contexts/ProfileContext';
import { AuthProvider } from './contexts/AuthContext';
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

// Root component to provide theme and context
const Root = () => {
  const navigate = useNavigate();
  
  return (
    <MUIThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={styledTheme}>
        <ProfileProvider>
          <AuthProvider>
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
          </AuthProvider>
        </ProfileProvider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <Root />
    </Router>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export default App;
