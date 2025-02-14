// File: /src/pages/__tests__/Contact.test.tsx
// Description: Unit test for Contact page component.

import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Contact from "../Contact";

const mockLoginWithGoogle = jest.fn();

// Create MUI theme for testing
const mockMuiTheme = {
  palette: {
    primary: {
      main: '#1976d2'
    }
  }
};

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

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Contact component with correct content", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByText(/Feel free to reach out to us with any questions or feedback./i)).toBeInTheDocument();
  });
});