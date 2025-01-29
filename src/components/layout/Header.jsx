import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Navigation from "./Navigation";
import "./styles/Header.css";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/">
            <img 
              src="/assets/geaux-logo.png" 
              alt="Geaux Academy Logo" 
              className="h-12 w-auto"
            />
          </Link>
          <h1>Geaux Academy</h1>
        </div>

        <button 
          className="mobile-menu-btn md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger"></span>
        </button>

        <div className={`nav-section ${isMenuOpen ? 'active' : ''}`}>
          <Navigation />
          <div className="auth-buttons">
            {currentUser ? (
              <>
                <Link to="/parent-profile" className="btn-primary">
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/signup" className="btn-signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;