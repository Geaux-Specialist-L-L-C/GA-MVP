// File: /src/components/profile/ProfileTabs.tsx
// Description: Navigation tabs for the profile page sections
// Author: evopimp
// Created: 2025-03-03 08:26:07

import React from "react";

type TabType = "personal" | "learning-style" | "preferences";

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "personal" as TabType, label: "Personal Information" },
    { id: "learning-style" as TabType, label: "Learning Style" },
    { id: "preferences" as TabType, label: "Preferences" }
  ];
  
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;