import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Login error:', err);
    }
  };

  return (
    <>
      <Header />
      <ContactContainer>
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
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </FormGroup>
            <SubmitButton type="submit">Send Message</SubmitButton>
          </ContactForm>

          <ContactInfo>
            <InfoCard>
              <h3>Office Hours</h3>
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Weekend: Closed</p>
            </InfoCard>
            <InfoCard>
              <h3>Our Office</h3>
              <p>Location: 123 Main St, Anytown, USA</p>
              <p>Hours: Mon-Fri, 9am-5pm</p>
            </InfoCard>
            <InfoCard>
              <h3>Support</h3>
              <p>Email: support@geauxacademy.com</p>
              <p>Phone: (123) 456-7890</p>
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

        <GoogleLoginContainer>
          <GoogleLoginButton onClick={handleGoogleLogin}>
            <FcGoogle />
            Sign in with Google
          </GoogleLoginButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </GoogleLoginContainer>
      </ContactContainer>
    </>
  );
};

// ... existing styled components ...

export default Contact;