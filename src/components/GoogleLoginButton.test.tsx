/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GoogleLoginButton from './GoogleLoginButton';

describe('GoogleLoginButton', () => {
  const mockHandleGoogleLogin = jest.fn();
  const mockDismissError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in button with correct text', () => {
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} loading={true} />);
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Test error message';
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls handleGoogleLogin when button is clicked', () => {
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    expect(mockHandleGoogleLogin).toHaveBeenCalledTimes(1);
  });

  it('disables button when loading is true', () => {
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onDismissError when dismiss button is clicked', () => {
    const errorMessage = 'Test error message';
    render(
      <GoogleLoginButton 
        handleGoogleLogin={mockHandleGoogleLogin} 
        error={errorMessage}
        onDismissError={mockDismissError} 
      />
    );
    
    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    fireEvent.click(dismissButton);
    
    expect(mockDismissError).toHaveBeenCalledTimes(1);
  });

  it('renders Google login button', () => {
    render(<GoogleLoginButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});