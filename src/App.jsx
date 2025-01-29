import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Curriculum from './pages/Curriculum';
import Features from './pages/Features';
import LearningStyles from './pages/LearningStyles';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

import ParentProfile from './components/ParentProfile/ParentProfile';
import TakeAssessment from './pages/TakeAssessment';
import StudentDashboard from './pages/StudentDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
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
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/parent-profile" element={<PrivateRoute><ParentProfile /></PrivateRoute>} />
            <Route path="/take-assessment" element={<PrivateRoute><TakeAssessment /></PrivateRoute>} />
            <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
