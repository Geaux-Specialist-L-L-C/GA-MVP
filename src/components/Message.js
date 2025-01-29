
import styled from 'styled-components';

export const Message = styled.div`
  margin: 0.5rem 0;
  padding: 0.75rem;
  background: ${(props) => (props.$isUser ? "#e0f7fa" : "#fff")};
  border-radius: 8px;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
`;