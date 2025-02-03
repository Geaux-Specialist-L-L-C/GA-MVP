import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import LearningStyleInsights from '../vue-components/LearningStyleInsights.jsx';
import LearningStyleInsightsWrapper from "../vue-components/LearningStyleInsightsWrapper";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <h1>Student Dashboard</h1>
          <p>Track your progress and learning journey</p>
        </Header>

        <DashboardGrid>
          <Card>
            <h3><FaGraduationCap /> Learning Style</h3>
            <LearningStyleInsights />
          </Card>

          <Card>
            <h3><FaChartLine /> Progress</h3>
            <ProgressTracker>
              {/* Progress visualization here */}
            </ProgressTracker>
          </Card>

          <Card>
            <h3><FaBook /> Recent Activities</h3>
            <ActivityList>
              {/* Activity items here */}
            </ActivityList>
          </Card>
        </DashboardGrid>
      </motion.div>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-color);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }
`;

const ProgressTracker = styled.div`
  width: 100%;
  min-height: 200px;
  background: var(--background-light);
  border-radius: 8px;
  padding: 1rem;
`;

const ActivityList = styled.div`
  width: 100%;
  min-height: 200px;
  background: var(--background-light);
  border-radius: 8px;
  padding: 1rem;
`;

export default StudentDashboard;
