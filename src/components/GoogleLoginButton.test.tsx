/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GoogleLoginButton from './GoogleLoginButton';

describe('GoogleLoginButton', () => {
  it('renders the button with correct text', () => {
    const mockHandleGoogleLogin = jest.fn();
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    
    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button).toBeInTheDocument();
  });

  it('calls handleGoogleLogin when clicked', async () => {
    const mockHandleGoogleLogin = jest.fn();
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} />);
    
    const button = screen.getByRole('button', { name: /sign in with google/i });
    await userEvent.click(button);
    
    expect(mockHandleGoogleLogin).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error prop is provided', () => {
    const mockHandleGoogleLogin = jest.fn();
    const errorMessage = 'Failed to sign in';
    
    render(<GoogleLoginButton handleGoogleLogin={mockHandleGoogleLogin} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});