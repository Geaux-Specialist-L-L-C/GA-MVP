import React from 'react';
import Card from '../common/Card';
import './Features.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faLightbulb, faChartLine, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const Features = () => {
  const features = [
    {
      title: "Personalized Learning",
      description: "Tailored learning paths based on your unique style",
      icon: faBullseye
    },
    {
      title: "Interactive Content",
      description: "Engage with dynamic and interactive learning materials",
      icon: faLightbulb
    },
    {
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics",
      icon: faChartLine
    },
    {
      title: "Expert Support",
      description: "Get help from experienced educators",
      icon: faChalkboardTeacher
    }
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Why Choose Geaux Academy</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card" icon={feature.icon}>
            <div className="feature-icon"><FontAwesomeIcon icon={feature.icon} /></div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
