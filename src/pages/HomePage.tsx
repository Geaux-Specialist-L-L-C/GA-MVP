// File: /src/pages/HomePage.tsx
// Description: Home page component demonstrating the use of core UI components
// Author: evopimp
// Created: 2025-03-03 06:02:22

import React from "react";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Grid from "@/components/layout/Grid";
import ThemeToggle from "@/components/ui/ThemeToggle";

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Section background="primary" padding="xl">
        <Container>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Geaux Academy
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mb-8">
              Unlock your learning potential with personalized education 
              tailored to your unique learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-md font-medium transition-colors">
                Get Started
              </button>
              <button className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md font-medium transition-colors">
                Learn More
              </button>
            </div>
            <div className="mt-8 absolute top-4 right-4">
              <ThemeToggle />
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section background="light" padding="lg">
        <Container>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Features</h2>
          <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap="lg">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                Adaptive learning paths tailored to your individual learning style and progress.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Content</h3>
              <p className="text-gray-600">
                Engaging and interactive learning materials that make education enjoyable.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Comprehensive analytics and insights to monitor your learning journey.
              </p>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Call to Action Section */}
      <Section background="secondary" padding="lg">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg mb-8">
              Join thousands of students who are discovering their potential with Geaux Academy's personalized learning experience.
            </p>
            <button className="px-8 py-3 bg-white text-secondary-600 hover:bg-gray-100 rounded-md font-medium transition-colors">
              Create Your Account
            </button>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default HomePage;