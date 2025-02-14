// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Curriculum from "../Curriculum";

const mockLoginWithGoogle = jest.fn();

// Create a proper MUI theme for testing
const mockMuiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    }
  }
});

// Create spacing function with required properties
const spacing = Object.assign(
  (value: number) => `${value * 8}px`,
  { xs: '8px', sm: '16px', md: '24px', lg: '32px', xl: '40px' }
);

// Mock styled-components theme
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
          {ui}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

describe('Curriculum Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Curriculum component with correct content", () => {
    renderWithProviders(<Curriculum />);
    expect(screen.getByRole('heading', { name: /curriculum/i })).toBeInTheDocument();
    expect(screen.getByText(/Our curriculum is designed to adapt to your learning style and pace./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google to get started/i })).toBeInTheDocument();
  });
});