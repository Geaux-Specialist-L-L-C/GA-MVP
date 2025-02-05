
import React from 'react';
import './UserProfileCard.css'; // or your preferred styling method

function UserProfileCard() {
  // Sample user object
  const user = {
    username: 'JaneDoe123',
    role: 'Parent',
  };

  return (
    <div className="user-profile-card">
      <h2>User Profile</h2>
      <div className="user-info">
        <label>Username:</label>
        <p>{user.username}</p>
      </div>
      <div className="user-info">
        <label>Role:</label>
        <p>{user.role}</p>
      </div>
      {/* Future: place a placeholder avatar or user-uploaded photo here */}
    </div>
  );
}


