
import React from 'react';
import { Radar } from 'react-chartjs-2';

const LearningStyleInsights = ({ studentData }) => {
  const varkData = {
    labels: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'],
    datasets: [{
      label: 'Learning Style Profile',
      data: [65, 45, 80, 70],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  };

  return (
    <div className="learning-insights">
      <h2>Learning Style Insights</h2>
      
      <div className="vark-assessment">
        <h3>VARK Assessment Results</h3>
        <div className="chart-container">
          <Radar data={varkData} />
        </div>
      </div>
      
      <div className="learning-recommendations">
        <h3>Personalized Learning Recommendations</h3>
        <ul>
          <li>Use visual aids like diagrams and mind maps</li>
          <li>Incorporate hands-on activities</li>
          <li>Take detailed notes during lessons</li>
        </ul>
      </div>
    </div>
  );
};

export default LearningStyleInsights;