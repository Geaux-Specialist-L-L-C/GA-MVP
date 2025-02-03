import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Your Learning Style</h1>
        <p>Personalized education tailored to how you learn best</p>
        <div className="hero-cta">
          <Link to="/assessment" className="btn btn-primary">Take Assessment</Link>
          <Link to="/about" className="btn btn-secondary">Learn More</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/images/hero-learning.svg" alt="Learning illustration" />
      </div>
    </section>
  );
};

export default Hero;