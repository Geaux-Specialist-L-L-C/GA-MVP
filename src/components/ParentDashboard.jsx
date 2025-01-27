import { useState, useEffect } from 'react';
import StudentProgressTracker from './dashboard/components/StudentProgressTracker';
import NotificationCenter from './dashboard/components/NotificationCenter';
import LearningStyleInsights from './dashboard/components/LearningStyleInsights';
import CurriculumApproval from './dashboard/components/CurriculumApproval';
import styled from 'styled-components';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Fetch student data
    const fetchData = async () => {
      // Add data fetching logic
    };
    fetchData();
  }, []);

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Parent Dashboard</h1>
      </DashboardHeader>

      <DashboardNav>
        <NavButton 
          isActive={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </NavButton>
        <NavButton 
          isActive={activeTab === 'progress'}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </NavButton>
        <NavButton 
          isActive={activeTab === 'curriculum'}
          onClick={() => setActiveTab('curriculum')}
        >
          Curriculum
        </NavButton>
        <NavButton 
          isActive={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </NavButton>
      </DashboardNav>

      <DashboardContent>
        {activeTab === 'overview' && (
          <>
            <StudentProgressTracker studentData={studentData} />
            <NotificationCenter />
          </>
        )}
        {activeTab === 'progress' && (
          <StudentProgressTracker studentData={studentData} />
        )}
        {activeTab === 'curriculum' && (
          <CurriculumApproval studentData={studentData} />
        )}
        {activeTab === 'insights' && (
          <LearningStyleInsights studentData={studentData} />
        )}
      </DashboardContent>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    color: var(--primary-color);
  }
`;

const DashboardNav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.isActive ? 'var(--primary-color)' : 'white'};
  color: ${props => props.isActive ? 'white' : 'var(--primary-color)'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.isActive ? 'var(--primary-color)' : 'var(--light-bg)'};
  }
`;

const DashboardContent = styled.div`
  display: grid;
  gap: 2rem;
`;

export default ParentDashboard;