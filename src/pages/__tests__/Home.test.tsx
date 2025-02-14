// File: /src/pages/__tests__/Home.test.tsx
// Description: Unit test for Home page component.

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Home from "../Home";

const mockNavigate = jest.fn();
const mockLoginWithGoogle = jest.fn().mockResolvedValue(undefined);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock themes setup
const mockMuiTheme = {
  palette: {
    primary: {
      main: '#1976d2'
    }
  }
};

const spacing = Object.assign(
  (value: number) => `${value * 8}px`,
  { xs: '8px', sm: '16px', md: '24px', lg: '32px', xl: '40px' }
);

const mockStyledTheme = {
  ...mockMuiTheme,
  palette: {
    ...mockMuiTheme.palette,
  },
  breakpoints: {
    ...mockMuiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={{ 
          loginWithGoogle: mockLoginWithGoogle,
          user: null,
          currentUser: null,
          loading: false,
          isAuthReady: true,
          error: null,
          login: jest.fn(),
          signOut: jest.fn(),
          signIn: jest.fn(),
          clearError: jest.fn()
        }}>
          <MemoryRouter>
            {ui}
          </MemoryRouter>
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Home component with correct content", () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: /welcome to geaux academy/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /empowering personalized learning through ai/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ready to start your learning journey\?/i })).toBeInTheDocument();
  });

  test("handles Google login", async () => {
    renderWithProviders(<Home />);
    const loginButton = screen.getByRole('button', { name: /sign in with google/i });
    
    fireEvent.click(loginButton);
    
    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});