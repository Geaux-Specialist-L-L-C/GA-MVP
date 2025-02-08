import React from 'react';
import styled from 'styled-components';

const NotificationCenter: React.FC = () => {
  return (
    <NotificationContainer>
      <h3>Notifications</h3>
      <NotificationList>
        {/* Placeholder for notifications */}
        <NotificationItem>
          <span>No new notifications</span>
        </NotificationItem>
      </NotificationList>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NotificationList = styled.div`
  margin-top: 15px;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

export default NotificationCenter;