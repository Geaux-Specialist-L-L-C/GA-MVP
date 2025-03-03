// File: /src/App.tsx
// Description: Main application component with routing
// Author: evopimp
// Created: 2025-03-03 08:31:52

import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import UserProfilePage from "@/pages/UserProfilePage";
import LearningStyleAssessment from "@/pages/LearningStyleAssessment";
import { AuthProvider } from "@/hooks/useAuth";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/assessment" element={<LearningStyleAssessment />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;