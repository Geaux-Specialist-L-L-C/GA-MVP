import { Link } from 'react-router-dom';
import { useState } from 'react';
import './styles/Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="main-nav">
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
      </button>
      
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/curriculum">Curriculum</Link></li>
        <li><Link to="/learning-styles">Learning Styles</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;