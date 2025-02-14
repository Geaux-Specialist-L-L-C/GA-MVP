// File: /src/pages/__tests__/About.test.tsx
// Description: Unit test for About page component.

import { describe, test, expect, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import About from "../About";

const mockLoginWithGoogle = jest.fn();

// Mock themes setup
const mockMuiTheme = {
  palette: {
    primary: {
      main: '#1976d2'
    },
    mode: 'light'
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    up: jest.fn(),
    down: jest.fn(),
    between: jest.fn(),
    only: jest.fn()
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  unstable_sx: {},
  unstable_sxConfig: {},
  mixins: {},
  shadows: [],
  shape: {},
  transitions: {},
  zIndex: {},
  components: {},
  direction: 'ltr',
  applyStyles: {},
  containerQueries: {}
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
          {ui}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(<About />);
  });

  test("renders About component with correct content", () => {
    expect(screen.getByRole('heading', { name: /about geaux academy/i })).toBeInTheDocument();
    expect(screen.getByText(/Geaux Academy is an interactive learning platform that adapts to individual learning styles through AI-powered assessments and personalized content delivery./i)).toBeInTheDocument();
  });

  test("renders navigation elements", () => {
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});