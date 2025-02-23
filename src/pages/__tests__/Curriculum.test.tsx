// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import React from 'react';
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from "../../test/testUtils";
import Curriculum from "../Curriculum";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLoginWithGoogle = jest.fn();
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    loginWithGoogle: mockLoginWithGoogle,
    loading: false
  })
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main curriculum content", () => {
    renderWithProviders(<Curriculum />);
    
    // Header content
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    
    // Grade selector buttons
    expect(screen.getByRole('button', { name: /elementary school/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /middle school/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /high school/i })).toBeInTheDocument();
    
    // Course cards
    expect(screen.getByText(/mathematics/i)).toBeInTheDocument();
    expect(screen.getByText(/science/i)).toBeInTheDocument();
  });

  it("changes grade selection when clicking grade buttons", async () => {
    renderWithProviders(<Curriculum />);
    
    const elementaryButton = screen.getByRole('button', { name: /elementary school/i });
    await userEvent.click(elementaryButton);
    
    // You might want to check for specific content changes based on grade selection
    // This would depend on your implementation details
  });

  it("handles Google login flow correctly", async () => {
    renderWithProviders(<Curriculum />);
    
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    await userEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it("handles login error correctly", async () => {
    mockLoginWithGoogle.mockRejectedValueOnce(new Error("Failed to login"));
    renderWithProviders(<Curriculum />);
    
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    await userEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to sign in with Google/i)).toBeInTheDocument();
    });
  });

  it("shows loading spinner when authentication is in progress", () => {
    jest.mock('../contexts/AuthContext', () => ({
      useAuth: () => ({
        loginWithGoogle: mockLoginWithGoogle,
        loading: true
      })
    }));
    
    renderWithProviders(<Curriculum />);
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });
});