// File: /src/components/profile/ProfileHeader.tsx
// Description: Header component for the user profile page showing user info and avatar
// Author: evopimp
// Created: 2025-03-03 08:26:07

import React from "react";
import { LearningStyleResult, UserProfile } from "@/types/user";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import LearningStyleBadge from "@/components/profile/LearningStyleBadge";
import { LearningStyle } from "@/types/chat";

interface ProfileHeaderProps {
  profile: UserProfile | null;
  learningStyle: LearningStyleResult | null;
  isLoading: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  learningStyle, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="rounded-full bg-gray-300 h-24 w-24 mb-4 sm:mb-0 sm:mr-6"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center">
        <ProfileAvatar 
          src={profile?.avatarUrl} 
          name={profile?.name || "User"} 
          size="large"
        />
        
        <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0 sm:ml-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.name || "New User"}
          </h1>
          
          <p className="text-gray-600 mb-2">
            {profile?.email}
          </p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            {learningStyle && (
              <LearningStyleBadge learningStyle={learningStyle.primaryStyle as LearningStyle} />
            )}
            
            {profile?.role && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            )}
            
            {profile?.joinDate && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Joined {new Date(profile.joinDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;