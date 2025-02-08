import React from "react";
import { Link } from "react-router-dom";
import './styles/Navigation.css';

const Navigation = () => {
  return (
    <nav className="flex space-x-6 text-lg font-medium">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/curriculum" className="hover:underline">Curriculum</Link>
      <Link to="/learning-styles" className="hover:underline">Learning Styles</Link>
      <Link to="/contact" className="hover:underline">Contact Us</Link>
    </nav>
  );
};

export default Navigation;
