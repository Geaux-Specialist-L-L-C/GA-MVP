// src/pages/Home.jsx
import React from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import LearningStyles from '../components/home/LearningStyles';
import styled from 'styled-components';
import heroImage from "../assets/hero-image.png"; // Fixed path
import '../styles/Home.css'; // Fixed path

const Home = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Geaux Academy</h1>
        <p>Your journey to excellence starts here.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Learn More</button>
        </div>
      </section>
      <section className="features-overview">
        <h2>Our Features</h2>
        <div className="features-grid">
          {/* Feature cards */}
        </div>
      </section>
      <section className="learning-styles-preview">
        <h2>Learning Styles</h2>
        <div className="styles-grid">
          {/* Learning style cards */}
        </div>
        <button className="btn btn-primary">Discover Your Style</button>
      </section>
      <section className="cta-signup">
        <h2>Join Geaux Academy Today</h2>
        <button className="btn btn-primary">Sign Up Now</button>
      </section>
    </div>
  );
};

export default Home;