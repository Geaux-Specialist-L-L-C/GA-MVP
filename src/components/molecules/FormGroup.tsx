import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import Input from '../common/Input';

interface FormGroupProps {
  label: string;
  helperText?: string;
  errorMessage?: string;
  inputs: Array<{
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
  }>;
  onSubmit?: () => void;
  submitButtonText?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  helperText,
  errorMessage,
  inputs,
  onSubmit,
  submitButtonText
}) => {
  return (
    <FormGroupContainer>
      <Label>{label}</Label>
      {helperText && <HelperText>{helperText}</HelperText>}
      {inputs.map((input, index) => (
        <Input
          key={index}
          placeholder={input.placeholder}
          value={input.value}
          onChange={input.onChange}
          error={input.error}
        />
      ))}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {onSubmit && (
        <Button onClick={onSubmit}>
          {submitButtonText || 'Submit'}
        </Button>
      )}
    </FormGroupContainer>
  );
};

const FormGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-color);
`;

const HelperText = styled.span`
  font-size: 0.875rem;
  color: var(--text-color-light);
`;

const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: var(--error-color);
`;

export default FormGroup;
