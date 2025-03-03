// File: /src/components/profile/PersonalInfoTab.tsx
// Description: Personal information tab content for the user profile
// Author: evopimp
// Created: 2025-03-03 08:29:29

import React, { useState } from "react";
import { UserProfile } from "@/types/user";
import { updateUserProfile } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";

interface PersonalInfoTabProps {
  profile: UserProfile | null;
  isLoading: boolean;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ profile, isLoading }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: profile?.name || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    occupation: profile?.occupation || "",
    education: profile?.education || "",
    website: profile?.website || "",
    avatarUrl: profile?.avatarUrl || ""
  });
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await updateUserProfile(user.uid, formData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
        
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
              Education
            </label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
          Edit Profile
        </button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Name</h4>
            <p className="mt-1">{profile?.name || "Not provided"}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="mt-1">{profile?.email || "Not provided"}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Location</h4>
            <p className="mt-1">{profile?.location || "Not provided"}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Occupation</h4>
            <p className="mt-1">{profile?.occupation || "Not provided"}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Education</h4>
            <p className="mt-1">{profile?.education || "Not provided"}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Website</h4>
            <p className="mt-1">
              {profile?.website ? (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                  {profile.website}
                </a>
              ) : (
                "Not provided"
              )}
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900">Bio</h3>
        <p className="mt-3 text-gray-700 whitespace-pre-line">
          {profile?.bio || "No bio information provided. Click 'Edit Profile' to add a bio."}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoTab;