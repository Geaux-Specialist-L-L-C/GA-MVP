// src/pages/Contact.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';

const Contact = () => {
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
          <ContactForm onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required />
            </FormGroup>
            <FormGroup>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </FormGroup>
            <FormGroup>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" required></textarea>
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
      </motion.div>
    </ContactContainer>
  );
};

export default Contact;