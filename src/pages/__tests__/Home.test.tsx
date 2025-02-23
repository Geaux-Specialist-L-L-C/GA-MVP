import { screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from "../../test/testUtils";
import Home from "../Home";

interface MockAuthState {
  loginWithGoogle: jest.Mock;
  loading: boolean;
}

const mockNavigate = jest.fn();
const mockLoginWithGoogle = jest.fn();
const mockUseAuth = jest.fn<MockAuthState, []>();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      loginWithGoogle: mockLoginWithGoogle,
      loading: false
    });
  });

  const renderComponent = (): React.ReactElement => (
    <Home />
  );

  it("renders Home component with correct content", () => {
    renderWithProviders(renderComponent());
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering personalized learning through ai/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  it("handles Google login successfully", async () => {
    renderWithProviders(renderComponent());
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    await userEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows loading state during authentication", () => {
    mockUseAuth.mockReturnValueOnce({
      loginWithGoogle: mockLoginWithGoogle,
      loading: true
    });
    
    renderWithProviders(renderComponent());
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("handles login errors appropriately", async () => {
    mockLoginWithGoogle.mockRejectedValueOnce(new Error("Failed to login"));
    renderWithProviders(renderComponent());
    
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    await userEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to sign in with Google/i)).toBeInTheDocument();
    });
  });
});
