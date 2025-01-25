import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentProgressTracker from './components/StudentProgressTracker';
import LearningStyleInsights from './components/LearningStyleInsights';
import CurriculumApproval from './components/CurriculumApproval';
import NotificationCenter from './components/NotificationCenter';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Fetch student data and parent profile
    // This would be replaced with your actual data fetching logic
  }, [user]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.displayName || 'Parent'}</h1>
        <NotificationCenter />
      </header>

      <nav className="dashboard-nav">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'progress' ? 'active' : ''}
          onClick={() => setActiveTab('progress')}
        >
          Student Progress
        </button>
        <button
          className={activeTab === 'learning-styles' ? 'active' : ''}
          onClick={() => setActiveTab('learning-styles')}
        >
          Learning Styles
        </button>
        <button
          className={activeTab === 'curriculum' ? 'active' : ''}
          onClick={() => setActiveTab('curriculum')}
        >
          Curriculum
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <ParentProfile />
            <QuickStats />
          </div>
        )}
        
        {activeTab === 'progress' && (
          <StudentProgressTracker studentData={studentData} />
        )}
        
        {activeTab === 'learning-styles' && (
          <LearningStyleInsights studentData={studentData} />
        )}
        
        {activeTab === 'curriculum' && (
          <CurriculumApproval studentData={studentData} />
        )}
      </main>
    </div>
  );
};

// Quick Stats component for overview
const QuickStats = () => {
  return (
    <div className="quick-stats">
      <div className="stat-card">
        <h3>Overall Progress</h3>
        <div className="progress-circle">75%</div>
      </div>
      <div className="stat-card">
        <h3>Active Courses</h3>
        <div className="count">4</div>
      </div>
      <div className="stat-card">
        <h3>Learning Style</h3>
        <div className="style-info">Visual-Kinesthetic</div>
      </div>
    </div>
  );
};

export default ParentDashboard;