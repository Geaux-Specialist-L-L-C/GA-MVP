import React from 'react';
import styled from 'styled-components';
import FormGroup from '../molecules/FormGroup';
import Button from '../common/Button';

interface AuthFormProps {
  onSubmit: (values: { [key: string]: string }) => void;
  formFields: Array<{
    name: string;
    type: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
  }>;
  initialValues: { [key: string]: string };
  submitButtonText: string;
  errorMessage?: string;
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  formFields,
  initialValues,
  submitButtonText,
  errorMessage,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as { [key: string]: string });
    onSubmit(values);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {formFields.map((field, index) => (
        <FormGroup
          key={index}
          label={field.label}
          inputs={[{
            placeholder: field.placeholder,
            value: field.value,
            onChange: field.onChange,
            error: field.error
          }]}
        />
      ))}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : submitButtonText}
      </Button>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.9rem;
`;

export default AuthForm;
