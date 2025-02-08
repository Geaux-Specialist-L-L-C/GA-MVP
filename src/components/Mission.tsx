import styled from 'styled-components';
import React from 'react';

const MissionContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MissionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #444;
`;

interface MissionProps {
  text: string;
}

export const Mission: React.FC<MissionProps> = ({ text }) => {
  return (
    <MissionContainer>
      <MissionText>{text}</MissionText>
    </MissionContainer>
  );
};

export default Mission;
