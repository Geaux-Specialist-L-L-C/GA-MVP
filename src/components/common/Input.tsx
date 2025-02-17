import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChange, error, ...props }) => {
  return (
    <StyledInput
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      {...props}
    />
  );
};

const StyledInput = styled.input<{ error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ error }) => (error ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? '#dc3545' : '#4a90e2')};
    box-shadow: 0 0 0 2px ${({ error }) => (error ? 'rgba(220, 53, 69, 0.2)' : 'rgba(74, 144, 226, 0.2)')};
  }
`;

export default Input;
