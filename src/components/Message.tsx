import React from 'react';
import styled from 'styled-components';

interface MessageProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ sender, children }) => {
  return (
    <MessageContainer $sender={sender}>
      {children}
    </MessageContainer>
  );
};

const MessageContainer = styled.div<{ $sender: 'user' | 'bot' }>`
  margin: var(--spacing-xs) 0;
  padding: var(--spacing-sm);
  max-width: 80%;
  background: ${({ $sender }) => ($sender === 'user' ? "var(--accent-color)" : "var(--white)")};
  color: ${({ $sender }) => ($sender === 'user' ? "var(--white)" : "var(--text-color)")};
  border-radius: var(--border-radius);
  align-self: ${({ $sender }) => ($sender === 'user' ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export default Message;