import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Curriculum from './pages/Curriculum';
import LearningStyles from './pages/LearningStyles';
import Contact from './pages/Contact';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ParentDashboard from './components/dashboard/ParentDashboard';
import LoadingSpinner from './components/shared/LoadingSpinner';
import PrivateRoute from './components/auth/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Theme configuration
const theme = {
  colors: {
    primary: '#2C3E50',
    secondary: '#E74C3C',
    accent: '#3498DB',
    background: '#FFFFFF',
    text: '#333333',
    lightBg: '#F8F9FA',
    error: '#E74C3C',
    success: '#2ECC71',
  }
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learning-styles" element={<LearningStyles />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <ParentDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;