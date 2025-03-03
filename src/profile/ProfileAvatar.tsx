// File: /src/components/profile/ProfileAvatar.tsx
// Description: Avatar component for profile pictures with fallback to initials
// Author: evopimp
// Created: 2025-03-03 08:26:07

import React, { useState } from "react";

interface ProfileAvatarProps {
  src?: string;
  name: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  src, 
  name, 
  size = "medium", 
  className = "" 
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const sizeClasses = {
    small: "w-10 h-10 text-sm",
    medium: "w-16 h-16 text-lg",
    large: "w-24 h-24 text-xl"
  };
  
  if (!src || imageError) {
    // Show initials as fallback
    return (
      <div 
        className={`${sizeClasses[size]} bg-primary-600 text-white rounded-full flex items-center justify-center font-medium ${className}`}
        aria-label={`${name}'s profile`}
      >
        {getInitials(name)}
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={`${name}'s profile`}
      onError={() => setImageError(true)}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`} 
    />
  );
};

export default ProfileAvatar;