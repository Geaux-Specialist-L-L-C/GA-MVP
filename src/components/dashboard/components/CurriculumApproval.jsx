
import React, { useState } from 'react';

export const CurriculumApproval = ({ studentData }) => {
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      courseName: 'Mathematics 101',
      level: 'Elementary',
      status: 'pending',
      requestDate: '2024-01-15'
    },
    {
      id: 2,
      courseName: 'Science Basics',
      level: 'Elementary',
      status: 'pending',
      requestDate: '2024-01-16'
    }
  ]);

  const handleApproval = (courseId, approved) => {
    setPendingApprovals(prevApprovals => 
      prevApprovals.map(course => 
        course.id === courseId 
          ? { ...course, status: approved ? 'approved' : 'rejected' }
          : course
      )
    );
  };

  return (
    <div className="curriculum-approval">
      <h2>Curriculum Approval</h2>
      
      <div className="approval-requests">
        {pendingApprovals.map(course => (
          <div key={course.id} className="approval-card">
            <div className="course-info">
              <h3>{course.courseName}</h3>
              <p>Level: {course.level}</p>
              <p>Requested: {new Date(course.requestDate).toLocaleDateString()}</p>
            </div>
            
            {course.status === 'pending' && (
              <div className="approval-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApproval(course.id, true)}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleApproval(course.id, false)}
                >
                  Reject
                </button>
              </div>
            )}
            
            {course.status !== 'pending' && (
              <div className={`status ${course.status}`}>
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};