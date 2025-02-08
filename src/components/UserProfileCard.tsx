import React from 'react';
import Card from '../common/Card';

interface UserProfileCardProps {
  username: string;
  role: string;
  avatar?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ username, role, avatar }) => {
  return (
    <Card
      title="User Profile"
      icon={avatar}
      className="user-profile-card"
    >
      <div className="user-info">
        <label>Username:</label>
        <p>{username}</p>
      </div>
      <div className="user-info">
        <label>Role:</label>
        <p>{role}</p>
      </div>
    </Card>
  );
};

export default UserProfileCard;