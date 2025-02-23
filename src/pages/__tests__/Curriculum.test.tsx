import React from 'react';
import { screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from "../../test/testUtils"; // ✅ Fixed Import
import Curriculum from "../Curriculum";

interface MockAuthState {
  loginWithGoogle: jest.Mock;
  loading: boolean;
}

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLoginWithGoogle = jest.fn();
const mockUseAuth = jest.fn<MockAuthState, []>();

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      loginWithGoogle: mockLoginWithGoogle,
      loading: false
    });
  });

  it("renders main curriculum content", async () => {
    renderWithProviders(<Curriculum />); // ✅ Fixed Wrapping
    
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /elementary school/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /middle school/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /high school/i })).toBeInTheDocument();
    
    expect(screen.getByText(/mathematics/i)).toBeInTheDocument();
    expect(screen.getByText(/science/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
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

  it("shows loading spinner when authentication is in progress", () => {
    mockUseAuth.mockReturnValueOnce({
      loginWithGoogle: mockLoginWithGoogle,
      loading: true
    });

    renderWithProviders(<Curriculum />);
    
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });
});
