// File: /src/pages/LearningStyleAssessment.tsx
// Description: Learning style assessment page
// Author: evopimp
// Created: 2025-03-03 06:23:10

import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import ChatInterface from "@/components/chat/ChatInterface";
import LearningStyleResult from "@/components/assessment/LearningStyleResult";
import { LearningStyleResult as LearningStyleResultType, LearningStyle } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";

const LearningStyleAssessment: React.FC = () => {
  const [result, setResult] = useState<LearningStyleResultType | null>(null);
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login?redirect=assessment" replace />;
  }
  
  const handleAssessmentComplete = (assessmentResult: LearningStyleResultType) => {
    setResult(assessmentResult);
  };
  
  const handleSaveAndContinue = () => {
    navigate("/dashboard");
  };
  
  return (
    <Layout>
      <Section background="light" padding="lg">
        <Container size="md">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Learning Style Assessment</h1>
            
            {!result ? (
              <>
                <p className="text-lg mb-8 max-w-2xl text-center">
                  Answer a few questions to help us understand your learning style. This will allow us 
                  to personalize your learning experience and recommend the most effective resources for you.
                </p>
                
                <ChatInterface onAssessmentComplete={handleAssessmentComplete} />
              </>
            ) : (
              <div className="w-full max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <LearningStyleResult result={result} />
                  
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleSaveAndContinue}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors"
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default LearningStyleAssessment;