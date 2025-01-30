import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import AuthRoute from './components/auth/AuthRoute';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Curriculum from './pages/Curriculum';
import Features from './pages/Features';
import LearningStyles from './pages/LearningStyles';

// Auth components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';

// Protected pages
import Dashboard from './components/Dashboard';
import ParentProfile from './components/ParentProfile/ParentProfile';
import TakeAssessment from './pages/TakeAssessment';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/learning-styles" element={<LearningStyles />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route element={<AuthRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/parent-profile" element={<ParentProfile />} />
            <Route path="/take-assessment" element={<TakeAssessment />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Route>
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
