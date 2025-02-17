import React, { useState } from 'react';
import styled from 'styled-components';
import FormGroup from '../molecules/FormGroup';

interface AssessmentFlowProps {
  currentStep: number;
  progress: number;
  nextStep: () => void;
  prevStep: () => void;
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

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({
  currentStep,
  progress,
  nextStep,
  prevStep,
  onSubmit,
  formFields,
  initialValues,
  submitButtonText,
  errorMessage,
  isLoading
}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <FlowContainer>
      <ProgressBar progress={progress} />
      <FormContainer onSubmit={handleSubmit}>
        {formFields.map((field, index) => (
          <FormGroup
            key={index}
            label={field.label}
            inputs={[{
              placeholder: field.placeholder,
              value: values[field.name],
              onChange: handleChange(field.name),
              error: field.error
            }]}
          />
        ))}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <ButtonContainer>
          <Button type="button" onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : submitButtonText}
          </Button>
          <Button type="button" onClick={nextStep} disabled={currentStep === formFields.length - 1}>
            Next
          </Button>
        </ButtonContainer>
      </FormContainer>
    </FlowContainer>
  );
};

const FlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 8px;
  background: #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: #4a90e2;
    width: ${({ progress }) => progress}%;
    transition: width 0.3s;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #357abd;
  }
`;

export default AssessmentFlow;
