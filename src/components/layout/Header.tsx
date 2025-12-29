import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../theme/ThemeModeContext';
import styles from './layout.module.css';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark} aria-hidden="true">GA</span>
          <span>Geaux Academy</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <button
            type="button"
            className={styles.menuToggle}
            onClick={handleToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <span className={styles.menuToggleText}>{menuOpen ? 'Close' : 'Menu'}</span>
            <span className={styles.menuToggleIcon} aria-hidden="true" />
          </button>
          <ul
            id="primary-navigation"
            className={`${styles['navigation-list']} ${menuOpen ? styles.open : ''}`}
          >
            <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
            <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
            <li><NavLink to="/features" onClick={closeMenu}>Features</NavLink></li>
            <li><NavLink to="/curriculum" onClick={closeMenu}>Curriculum</NavLink></li>
            <li><NavLink to="/learning-styles" onClick={closeMenu}>Learning Styles</NavLink></li>
            <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={toggleMode}
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className={styles.toggleIcon} aria-hidden="true">
              {mode === 'light' ? '🌙' : '☀️'}
            </span>
            <span>{mode === 'light' ? 'Dark' : 'Light'} mode</span>
          </button>
          <Link to="/login" className={styles.primaryButton} onClick={closeMenu}>
            Take Assessment
          </Link>
          {!currentUser ? (
            <Link to="/login" className={styles.secondaryButton} onClick={closeMenu}>
              Login
            </Link>
          ) : (
            <Link to="/dashboard" className={styles.secondaryButton} onClick={closeMenu}>
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
