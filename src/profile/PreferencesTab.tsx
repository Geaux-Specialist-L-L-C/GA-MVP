// File: /src/components/profile/PreferencesTab.tsx
// Description: User preferences tab for customizing platform settings
// Author: evopimp
// Created: 2025-03-03 08:31:52

import React, { useState } from "react";
import { UserProfile } from "@/types/user";
import { updateUserPreferences } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/styles/ThemeProvider";

interface PreferencesTabProps {
  profile: UserProfile | null;
  isLoading: boolean;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({ profile, isLoading }) => {
  const { user } = useAuth();
  const { mode, setMode } = useTheme();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [preferences, setPreferences] = useState({
    emailNotifications: profile?.preferences?.emailNotifications ?? true,
    contentRecommendations: profile?.preferences?.contentRecommendations ?? true,
    studyReminders: profile?.preferences?.studyReminders ?? true,
    publicProfile: profile?.preferences?.publicProfile ?? false,
    colorMode: mode
  });
  
  const handleToggleChange = (name: string) => {
    setPreferences(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };
  
  const handleModeChange = (newMode: "light" | "dark") => {
    setPreferences(prev => ({
      ...prev,
      colorMode: newMode
    }));
    setMode(newMode);
  };
  
  const handleSavePreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateUserPreferences(user.uid, {
        emailNotifications: preferences.emailNotifications,
        contentRecommendations: preferences.contentRecommendations,
        studyReminders: preferences.studyReminders,
        publicProfile: preferences.publicProfile,
        colorMode: preferences.colorMode
      });
      
      setSuccess("Your preferences have been saved successfully.");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Failed to save preferences. Please try again.");
      console.error("Error saving preferences:", err);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded w-full mb-6"></div>
        
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded w-full mb-6"></div>
        
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-700">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive email updates about your courses and learning progress</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={preferences.emailNotifications}
                onChange={() => handleToggleChange("emailNotifications")}
                className="sr-only"
              />
              <label 
                htmlFor="emailNotifications" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${preferences.emailNotifications ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`dot block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-700">Content Recommendations</h4>
              <p className="text-sm text-gray-500">Receive personalized recommendations based on your learning style</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox"
                id="contentRecommendations"
                name="contentRecommendations"
                checked={preferences.contentRecommendations}
                onChange={() => handleToggleChange("contentRecommendations")}
                className="sr-only"
              />
              <label 
                htmlFor="contentRecommendations" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${preferences.contentRecommendations ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`dot block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${preferences.contentRecommendations ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-700">Study Reminders</h4>
              <p className="text-sm text-gray-500">Receive reminders to help maintain your learning schedule</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox"
                id="studyReminders"
                name="studyReminders"
                checked={preferences.studyReminders}
                onChange={() => handleToggleChange("studyReminders")}
                className="sr-only"
              />
              <label 
                htmlFor="studyReminders" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${preferences.studyReminders ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`dot block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${preferences.studyReminders ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-700">Public Profile</h4>
              <p className="text-sm text-gray-500">Allow other users to view your profile and learning progress</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input 
                type="checkbox"
                id="publicProfile"
                name="publicProfile"
                checked={preferences.publicProfile}
                onChange={() => handleToggleChange("publicProfile")}
                className="sr-only"
              />
              <label 
                htmlFor="publicProfile" 
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${preferences.publicProfile ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`dot block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${preferences.publicProfile ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleModeChange("light")}
            className={`p-4 border rounded-md flex flex-col items-center ${preferences.colorMode === 'light' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 mb-2 ${preferences.colorMode === 'light' ? 'text-primary-600' : 'text-gray-500'}`}>
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
            <span className={`font-medium ${preferences.colorMode === 'light' ? 'text-primary-600' : 'text-gray-500'}`}>Light Mode</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleModeChange("dark")}
            className={`p-4 border rounded-md flex flex-col items-center ${preferences.colorMode === 'dark' ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 mb-2 ${preferences.colorMode === 'dark' ? 'text-primary-600' : 'text-gray-500'}`}>
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
            <span className={`font-medium ${preferences.colorMode === 'dark' ? 'text-primary-600' : 'text-gray-500'}`}>Dark Mode</span>
          </button>
        </div>
      </div>
      
      <div className="pt-6 flex justify-center">
        <button
          type="button"
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};

export default PreferencesTab;