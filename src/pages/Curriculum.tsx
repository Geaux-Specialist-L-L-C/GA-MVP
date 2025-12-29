// File: /src/pages/Curriculum.tsx
// Description: Curriculum page component outlining the learning curriculum.
// Author: GitHub Copilot
// Created: 2023-10-10

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import CourseCard from "../components/CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  type: "Video Animated" | "Quiz" | "Mind Map";
  category: string;
  image?: string;
}

const Curriculum: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<'elementary' | 'middle' | 'high'>('middle');
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Login error:', error);
    }
  };

  const subjects: Course[] = [
    {
      id: '1',
      title: 'Mathematics',
      description: 'Core mathematics curriculum covering algebra, geometry, and more.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'math'
    },
    {
      id: '2',
      title: 'Science',
      description: 'Comprehensive science program including biology, chemistry, and physics.',
      level: selectedGrade,
      duration: '9 months',
      type: 'Video Animated',
      category: 'science'
    }
    // Add more courses as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Curriculum</h1>
      <p className="mt-4">Our curriculum is designed to adapt to your learning style and pace.</p>

      <div className="flex justify-center gap-4 mt-8">
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'elementary' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('elementary')}
        >
          Elementary School
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'middle' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('middle')}
        >
          Middle School
        </button>
        <button 
          className={`px-4 py-2 rounded ${selectedGrade === 'high' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} 
          onClick={() => setSelectedGrade('high')}
        >
          High School
        </button>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-2 rounded mt-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {subjects.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      <div className="text-center mt-16 p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Ready to Start Learning?</h2>
        <p className="mt-4">Join our platform to access the full curriculum and personalized learning paths.</p>
        <button 
          className="flex items-center gap-2 px-4 py-2 border rounded mt-4" 
          onClick={handleLogin}
        >
          <FcGoogle />
          <span>Sign in with Google to Get Started</span>
        </button>
      </div>
    </div>
  );
};

export default Curriculum;
