import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
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
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;