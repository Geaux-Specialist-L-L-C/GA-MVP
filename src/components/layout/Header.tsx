import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Button from '../common/Button';
import styles from './layout.module.css';

const Header = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <Link to="/">
          <img src="/images/logo.svg" alt="Geaux Academy Logo" height="50" />
        </Link>
        
        <nav>
          <ul className={styles['navigation-list']}>
            <li>
              <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className={location.pathname === '/features' ? styles.active : ''}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/curriculum" className={location.pathname === '/curriculum' ? styles.active : ''}>
                Curriculum
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {!currentUser ? (
            <>
              <Button to="/login" className="btn btn-secondary">Login</Button>
              <Button to="/signup" className="btn btn-primary">Sign Up</Button>
            </>
          ) : (
            <Button to="/dashboard" className="btn btn-primary">Dashboard</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
