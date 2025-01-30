// src/pages/Contact.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';
import React from 'react';
import './styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your form submission logic here
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ContactContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>Contact Us</h1>
          <p>Get in touch with our team</p>
        </Header>

        <ContentGrid>
          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                rows="5" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </FormGroup>
            <SubmitButton type="submit">Send Message</SubmitButton>
          </ContactForm>

          <ContactInfo>
            <InfoCard>
              <h3>Contact Info</h3>
              <p>Email: support@geauxacademy.com</p>
              <p>Phone: (225) 773-5786</p>
            </InfoCard>
            <InfoCard>
              <h3>Office Hours</h3>
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Weekend: Closed</p>
            </InfoCard>
          </ContactInfo>
        </ContentGrid>

        {isSubmitted && (
          <SuccessMessage
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Thank you for your message! We'll get back to you soon.
          </SuccessMessage>
        )}
      </motion.div>
      <div className="social-media">
        <h2>Follow Us</h2>
        {/* Social media links */}
      </div>
      <div className="office-info">
        <h2>Our Office</h2>
        <p>Location: 123 Main St, Anytown, USA</p>
        <p>Hours: Mon-Fri, 9am-5pm</p>
      </div>
      <div className="support-info">
        <h2>Support</h2>
        <p>Email: support@geauxacademy.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 60px auto 0; // Add top margin to match header height
  padding: 2rem;
  min-height: calc(100vh - 60px); // Ensure full viewport height minus header
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--hover-color);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-color);
    margin-bottom: 0.5rem;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--success-color);
  color: white;
  border-radius: 4px;
`;

export default Contact;