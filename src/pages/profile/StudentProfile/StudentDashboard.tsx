import React, { useState, useEffect } from 'react';
import useAuth from '../../../contexts/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChartLine, FaBook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { getStudentProfile } from '../../../services/profileService';
import type { Student } from '../../../types/student';

// Remove or comment out the Vue component import until it's available
// import LearningStyleInsights from '../../../vue-components/LearningStyleInsights';

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

const ProgressItem = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
`;
            {studentData?.progress && Array.isArray(studentData.progress) && studentData.progress.length > 0 ? (
              studentData.progress.map((item, index) => (
                <ProgressItem key={index}>
                  {typeof item === 'string' ? item : `${item.type}: ${item.value}`}
                </ProgressItem>
              ))
            ) : (
              <p>No progress data available.</p>
            )}
          </Card>

          <Card>
            <h3><FaBook /> Recent Activities</h3>
            <ActivityList>

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  padding: 2rem;
`;

const GoogleLoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-blue-500;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  margin-top: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
  color: #dc2626;
  background-color: #fee2e2;
`;

interface StudentData extends Student {
  recentActivities?: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
  }>;
}

const StudentDashboard: React.FC = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      const fetchData = async (): Promise<void> => {
        try {
          const studentProfile = await getStudentProfile(currentUser.uid);
          if (studentProfile && studentProfile.id) {
            setStudentData({
              ...studentProfile,
              recentActivities: [],
              id: studentProfile.id,
              name: studentProfile.name,
              parentId: studentProfile.parentId,
              hasTakenAssessment: studentProfile.hasTakenAssessment
            });
          }
        } catch (err) {
          console.error('Error fetching student profile:', err);
          setError('Failed to load student data');
        }
      };
      fetchData();
    }
  }, [currentUser]);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setError('');
      await loginWithGoogle();
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

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
            {studentData ? (
              // <LearningStyleInsights learningStyle={studentData.learningStyle} />
              <p>{studentData.learningStyle || "No learning style data available."}</p>
            ) : (
              <p>Loading...</p>
            )}
          </Card>

          <Card>
            <h3><FaChartLine /> Progress</h3>
            <ProgressTracker>
              {studentData ? (
                <div>
                  {Array.isArray(studentData.progress) ? (studentData.progress && studentData.progress.length > 0 ? (
                    studentData.progress.map((item, index) => (rogress.map((item) => (
                      <ProgressItem key={index}>      <p key={item.id}>{item.name} - {item.date}</p>
                    ))
                  ) : (
                    <p>No progress data available.</p>
                  )}
                </div>
              ) : (
                        {typeof item === 'string' ? item : `${item.type}: ${item.value}`}/p>
                  ) : (    ))                      </ProgressItem>
                    <p>No progress data available.</p>
                  )}
              ) : (
                <p>Loading...</p>
              )}aBook /> Recent Activities</h3>
          <Card>er>tyList>
            <h3><FaBook /> Recent Activities</h3>recentActivities.length > 0 ? (
            <ActivityList>ata.recentActivities.map((activity, index) => (
              {studentData?.recentActivities && studentData.recentActivities.length > 0 ? (                  <p key={index}>{activity.name}</p>
                studentData.recentActivities.map((activity, index) => (
                  <ActivityItem key={activity.id || index}>
                    <ActivityIcon />
                    <ActivityContent>
                      <ActivityName>{activity.name}</ActivityName>
                      <ActivityDate>{activity.date}</ActivityDate></Card>
                    </ActivityContent>
                  </ActivityItem>
                ))(
              ) : (      <GoogleLoginButton onClick={handleGoogleLogin}>
                <EmptyState>No recent activities</EmptyState>          <FcGoogle className="text-xl" />
              )}            Sign in with Google
            </ActivityList>
          </Card>
        </DashboardGrid> <ErrorMessage>{error}</ErrorMessage>}
iv>
        {!currentUser && (  </DashboardContainer>
          <GoogleLoginButton onClick={handleGoogleLogin}>  );
            <FcGoogle className="text-xl" />
            Sign in with Google
          </GoogleLoginButton>er = styled.div`
        )}  max-width: 1200px;
        {error && <ErrorMessage>{error}</ErrorMessage>}in: 0 auto;
      </motion.div>
    </DashboardContainer>
  );
};st Header = styled.header`
  text-align: center;
const DashboardContainer = styled.div`gin-bottom: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem; font-size: 2.5rem;
`;  color: var(--primary-color);
    margin-bottom: 1rem;
const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
e: 1.2rem;
  h1 {  color: var(--text-color);
    font-size: 2.5rem;  }
    color: var(--primary-color);
    margin-bottom: 1rem;
  }rid = styled.div`

  p {inmax(300px, 1fr));
    font-size: 1.2rem;  gap: 2rem;
    color: var(--text-color);
  }
`;
ite;
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); rgba(0, 0, 0, 0.1);
  gap: 2rem;
`;h3 {
    display: flex;
const Card = styled.div`
  background: white;m;
  padding: 2rem;mary-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);m;

  h3 {
    display: flex;
    align-items: center;iv`
    gap: 0.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }
`;

const ProgressTracker = styled.div`
  width: 100%;
  min-height: 200px;0px;
  background: var(--background-light);ckground-light);
  border-radius: 8px;
  padding: 1rem;m;
`;

const ProgressItem = styled.div`= styled.button`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;x;
  &:last-child {ter;
    border-bottom: none; center;
  }
`;  padding: 0.75rem;
px solid #e2e8f0;
const ActivityList = styled.div`
  display: flex;ackground-color: white;
  flex-direction: column;  color: #333;
  gap: 1rem;: 1rem;
`;
background-color 0.2s;
const ActivityItem = styled.div`
  display: flex;
  align-items: center; background-color: #f8fafc;
  gap: 1rem;}
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
`;
x;
const ActivityIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: var(--primary-color);
  border-radius: 50%;nst ErrorMessage = styled.div`
`;  background-color: #fee2e2;

const ActivityContent = styled.div`  padding: 0.75rem;

























































export default StudentDashboard;`;  text-align: center;  font-size: 0.875rem;  margin-top: 1rem;  border-radius: 4px;  padding: 0.75rem;  color: #dc2626;  background-color: #fee2e2;const ErrorMessage = styled.div``;  }    ring-blue-500;    ring-offset: 2px;    ring: 2px;    outline: none;  &:focus {  }    background-color: #f8fafc;  &:hover {  transition: background-color 0.2s;  cursor: pointer;  font-size: 1rem;  color: #333;  background-color: white;  border-radius: 0.5rem;  border: 1px solid #e2e8f0;  padding: 0.75rem;  gap: 0.5rem;  justify-content: center;  align-items: center;  display: flex;  width: 100%;const GoogleLoginButton = styled.button``;  padding: 2rem;  color: #64748b;  text-align: center;const EmptyState = styled.div``;  color: #64748b;  font-size: 0.875rem;const ActivityDate = styled.div``;  font-weight: 500;const ActivityName = styled.div``;  flex: 1;  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
`;

export default StudentDashboard;
