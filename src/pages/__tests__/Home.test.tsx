// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/testUtils";
import Home from "../Home";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithProviders(<Home />, { withRouter: true });
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering personalized learning through ai/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  test("handles sign in", async () => {
    const mockSignIn = jest.fn();
    renderWithProviders(<Home />, { 
      withRouter: true,
      mockAuthValue: {
        signIn: mockSignIn
      }
    });
    
    const loginButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(loginButton);
    
    expect(mockSignIn).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});