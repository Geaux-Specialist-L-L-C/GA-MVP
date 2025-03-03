// File: /src/components/profile/LearningStyleTab.tsx
// Description: Learning style tab content showing assessment results
// Author: evopimp
// Created: 2025-03-03 08:29:29

import React from "react";
import { Link } from "react-router-dom";
import { LearningStyleResult, LearningStyle } from "@/types/chat";

interface LearningStyleTabProps {
  learningStyle: LearningStyleResult | null;
  isLoading: boolean;
}

const LearningStyleTab: React.FC<LearningStyleTabProps> = ({ 
  learningStyle, 
  isLoading 
}) => {
  const getStyleName = (style: LearningStyle): string => {
    switch (style) {
      case LearningStyle.VISUAL:
        return "Visual Learner";
      case LearningStyle.AUDITORY:
        return "Auditory Learner";
      case LearningStyle.READING:
        return "Reading/Writing Learner";
      case LearningStyle.KINESTHETIC:
        return "Kinesthetic Learner";
      case LearningStyle.MULTIMODAL:
        return "Multimodal Learner";
      default:
        return "Learner";
    }
  };
  
  const getStyleDescription = (style: LearningStyle): string => {
    switch (style) {
      case LearningStyle.VISUAL:
        return "You learn best through visual aids like charts, graphs, and images. You prefer to see information to understand it fully.";
      case LearningStyle.AUDITORY:
        return "You learn best through listening and speaking. Discussions, lectures, and audio materials are most effective for you.";
      case LearningStyle.READING:
        return "You learn best through reading and writing. Text-based materials and note-taking are most effective for you.";
      case LearningStyle.KINESTHETIC:
        return "You learn best through hands-on activities and physical experiences. Practice and application help you understand concepts.";
      case LearningStyle.MULTIMODAL:
        return "You have a balanced learning style that incorporates multiple approaches. You can adapt to different teaching methods.";
      default:
        return "";
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-20 bg-gray-200 rounded w-full mb-6"></div>
        
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
        
        <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
      </div>
    );
  }
  
  if (!learningStyle) {
    return (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Learning Style Assessment Found</h3>
        <p className="text-gray-600 mb-6">
          You haven't completed a learning style assessment yet. Complete an assessment to discover 
          your unique learning style and get personalized recommendations.
        </p>
        <Link 
          to="/assessment"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Take Assessment
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <div className="inline-block p-4 rounded-full bg-primary-100 text-primary-600 mb-4">
          {(() => {
            switch (learningStyle.primaryStyle as LearningStyle) {
              case LearningStyle.VISUAL:
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                  </svg>
                );
              case LearningStyle.AUDITORY:
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  </svg>
                );
              case LearningStyle.READING:
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                );
              case LearningStyle.KINESTHETIC:
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                    <path d="M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z" />
                  </svg>
                );
              default:
                return (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                  </svg>
                );
            }
          })()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {getStyleName(learningStyle.primaryStyle as LearningStyle)}
        </h2>
        <p className="mt-2 max-w-2xl mx-auto text-gray-600">
          {getStyleDescription(learningStyle.primaryStyle as LearningStyle)}
        </p>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Your VARK Score Breakdown</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Visual</span>
              <span className="text-sm font-medium">{learningStyle.scores.visual}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${learningStyle.scores.visual * 10}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Auditory</span>
              <span className="text-sm font-medium">{learningStyle.scores.auditory}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${learningStyle.scores.auditory * 10}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Reading/Writing</span>
              <span className="text-sm font-medium">{learningStyle.scores.reading}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${learningStyle.scores.reading * 10}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Kinesthetic</span>
              <span className="text-sm font-medium">{learningStyle.scores.kinesthetic}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${learningStyle.scores.kinesthetic * 10}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Learning Recommendations</h3>
        
        <ul className="space-y-2 pl-5 list-disc text-gray-700">
          {learningStyle.recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8 text-center pt-4 border-t border-gray-200">
        <Link 
          to="/assessment"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Retake Assessment
        </Link>
      </div>
    </div>
  );
};

export default LearningStyleTab;