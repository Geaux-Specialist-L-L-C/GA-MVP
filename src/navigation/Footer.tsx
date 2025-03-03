// File: /src/components/navigation/Footer.tsx
// Description: Footer component for the application
// Author: evopimp
// Created: 2025-03-03 06:02:22

import React from "react";
import { Link } from "react-router-dom";
import Container from "@/components/layout/Container";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-900 text-white py-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Geaux Academy Logo" className="h-8 w-auto" />
              <span className="text-lg font-bold">Geaux Academy</span>
            </Link>
            <p className="mt-4 text-gray-300">
              Personalized learning paths designed for your unique learning style.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="text-gray-300 hover:text-white transition-colors">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {currentYear} Geaux Academy. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;