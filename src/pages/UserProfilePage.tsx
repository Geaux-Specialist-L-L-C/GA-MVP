// File: /src/pages/UserProfilePage.tsx
// Description: User profile page showing personal information and learning preferences
// Author: evopimp
// Created: 2025-03-03 08:26:07

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import PersonalInfoTab from "@/components/profile/PersonalInfoTab";
import LearningStyleTab from "@/components/profile/LearningStyleTab";
import PreferencesTab from "@/components/profile/PreferencesTab";
import { getLatestAssessmentResult } from "@/services/learningStyleService";
import { getUserProfile } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";
import { LearningStyleResult, UserProfile } from "@/types/user";

type TabType = "personal" | "learning-style" | "preferences";

const UserProfilePage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyleResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Fetch user profile data
          const profileData = await getUserProfile(user.uid);
          setProfile(profileData);
          
          // Fetch learning style assessment results
          const learningStyleData = await getLatestAssessmentResult(user.uid);
          setLearningStyle(learningStyleData);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login?redirect=/profile" replace />;
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab profile={profile} isLoading={isLoading} />;
      case "learning-style":
        return <LearningStyleTab learningStyle={learningStyle} isLoading={isLoading} />;
      case "preferences":
        return <PreferencesTab profile={profile} isLoading={isLoading} />;
      default:
        return <PersonalInfoTab profile={profile} isLoading={isLoading} />;
    }
  };

  return (
    <Layout>
      <Section background="light" padding="md">
        <Container>
          <ProfileHeader 
            profile={profile} 
            learningStyle={learningStyle} 
            isLoading={isLoading} 
          />
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <ProfileTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
            
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
};

export default UserProfilePage;