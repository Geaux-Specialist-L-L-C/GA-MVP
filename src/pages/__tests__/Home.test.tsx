// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";
import Home from "../Home";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockLoginWithGoogle = jest.fn().mockResolvedValue(undefined);

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={{ loginWithGoogle: mockLoginWithGoogle } as any}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithRouter(<Home />);
    expect(screen.getByText("Welcome to Geaux Academy")).toBeInTheDocument();
    expect(screen.getByText("Empowering Personalized Learning through AI")).toBeInTheDocument();
    expect(screen.getByText("Ready to Start Your Learning Journey?")).toBeInTheDocument();
  });

  test("handles Google login", async () => {
    renderWithRouter(<Home />);
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    fireEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});