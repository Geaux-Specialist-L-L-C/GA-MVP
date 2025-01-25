import React, { useState } from 'react';

export const NotificationCenter = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'New Assessment Available',
      message: 'A new learning style assessment is ready for your student',
      type: 'info',
      date: new Date().toLocaleDateString()
    },
    {
      id: 2,
      title: 'Progress Update',
      message: 'Your student has completed Math Module 3',
      type: 'success', 
      date: new Date().toLocaleDateString()
    }
  ]);

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h3>Notifications</h3>
      </div>
      <div className="notification-list">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`notification-item ${notification.type}`}
          >
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <small>{notification.date}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
