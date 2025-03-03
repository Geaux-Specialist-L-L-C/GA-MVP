// File: /src/components/profile/LearningStyleBadge.tsx
// Description: Badge showing the user's primary learning style
// Author: evopimp
// Created: 2025-03-03 08:26:07

import React from "react";
import { LearningStyle } from "@/types/chat";

interface LearningStyleBadgeProps {
  learningStyle: LearningStyle;
  size?: "small" | "medium" | "large";
}

const LearningStyleBadge: React.FC<LearningStyleBadgeProps> = ({ 
  learningStyle,
  size = "medium" 
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
  
  const getStyleColor = (style: LearningStyle): string => {
    switch (style) {
      case LearningStyle.VISUAL:
        return "bg-blue-100 text-blue-800";
      case LearningStyle.AUDITORY:
        return "bg-green-100 text-green-800";
      case LearningStyle.READING:
        return "bg-purple-100 text-purple-800";
      case LearningStyle.KINESTHETIC:
        return "bg-orange-100 text-orange-800";
      case LearningStyle.MULTIMODAL:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case LearningStyle.VISUAL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          </svg>
        );
      case LearningStyle.AUDITORY:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          </svg>
        );
      case LearningStyle.READING:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
        );
      case LearningStyle.KINESTHETIC:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  const sizeClasses = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base"
  };
  
  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} font-medium rounded-full ${getStyleColor(learningStyle)}`}>
      {getStyleIcon(learningStyle)}
      {getStyleName(learningStyle)}
    </span>
  );
};

export default LearningStyleBadge;