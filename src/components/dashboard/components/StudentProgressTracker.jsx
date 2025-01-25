
import React from 'react';
import { Line } from 'react-chartjs-2';

const StudentProgressTracker = ({ studentData }) => {
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Completion Rate',
        data: [25, 45, 60, 75],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="progress-tracker">
      <h2>Student Progress</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Overall Completion</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: '75%' }}>75%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Time Spent Learning</h3>
          <p>12.5 hours this week</p>
        </div>
        
        <div className="metric-card">
          <h3>Average Accuracy</h3>
          <p>85%</p>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} />
      </div>
      
      <div className="subject-progress">
        <h3>Progress by Subject</h3>
        {/* Add subject-specific progress bars */}
      </div>
    </div>
  );
};

export default StudentProgressTracker;