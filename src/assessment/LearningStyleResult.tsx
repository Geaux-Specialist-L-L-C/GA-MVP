// File: /src/components/assessment/LearningStyleResult.tsx
// Description: Component to display learning style assessment results
// Author: evopimp
// Created: 2025-03-03 06:23:10

import React from "react";
import { LearningStyleResult as LearningStyleResultType, LearningStyle } from "@/types/chat";

interface LearningStyleResultProps {
  result: LearningStyleResultType;
}

const LearningStyleResult: React.FC<LearningStyleResultProps> = ({ result }) => {
  const { primaryStyle, scores, recommendations } = result;
  
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
  
  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case LearningStyle.VISUAL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary-500">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          </svg>
        );
      case LearningStyle.AUDITORY:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary-500">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
        );
      case LearningStyle.READING:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary-500">
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
        );
      case LearningStyle.KINESTHETIC:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary-500">
            <path d="M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z" />
          </svg>
        );
      case LearningStyle.MULTIMODAL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary-500">
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Your Learning Style Results</h2>
      
      <div className="flex flex-col items-center mb-8">
        {getStyleIcon(primaryStyle)}
        <h3 className="text-xl font-semibold mt-4 text-primary-600">{getStyleName(primaryStyle)}</h3>
        <p className="text-center mt-2 text-gray-700">{getStyleDescription(primaryStyle)}</p>
      </div>
      
      <div className="w-full mb-8">
        <h4 className="text-lg font-semibold mb-3">Your VARK Score Breakdown</h4>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Visual</span>
              <span className="text-sm font-medium">{scores.visual}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${scores.visual * 10}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Auditory</span>
              <span className="text-sm font-medium">{scores.auditory}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${scores.auditory * 10}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Reading/Writing</span>
              <span className="text-sm font-medium">{scores.reading}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${scores.reading * 10}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Kinesthetic</span>
              <span className="text-sm font-medium">{scores.kinesthetic}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${scores.kinesthetic * 10}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <h4 className="text-lg font-semibold mb-3">Recommendations For Your Learning Style</h4>
        <ul className="list-disc pl-5 space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="text-gray-700">{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LearningStyleResult;