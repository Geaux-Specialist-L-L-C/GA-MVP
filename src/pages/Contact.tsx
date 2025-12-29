// File: /src/pages/Contact.tsx
// Description: Contact page component providing contact information and a contact form.
// Author: GitHub Copilot
// Created: 2023-10-10

import React from 'react';
import './styles/Contact.css';

const Contact: React.FC = () => {
  return (
    <section className="contact-container">
      <div className="contact-hero">
        <span className="badge">Contact</span>
        <h1>Let’s build the future of learning together.</h1>
        <p>Questions, feedback, or partnership ideas? We’d love to hear from you.</p>
      </div>

      <div className="contact-grid">
        <form className="contact-form glass-card" aria-label="Contact form">
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} placeholder="Tell us how we can help" required />
          </div>
          <button type="submit" className="btn btn-primary">Send message</button>
        </form>

        <div className="contact-info glass-card">
          <h2>Contact information</h2>
          <p>Reach the team anytime — we respond within one business day.</p>
          <div className="info-item">
            <strong>Email</strong>
            <span>support@geauxacademy.com</span>
          </div>
          <div className="info-item">
            <strong>Phone</strong>
            <span>(225) 555-0134</span>
          </div>
          <div className="info-item">
            <strong>Office</strong>
            <span>Baton Rouge, LA · Remote-first</span>
          </div>
          <div className="social-links">
            <a href="https://twitter.com" aria-label="Follow on Twitter">Twitter</a>
            <a href="https://linkedin.com" aria-label="Follow on LinkedIn">LinkedIn</a>
            <a href="https://instagram.com" aria-label="Follow on Instagram">Instagram</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
