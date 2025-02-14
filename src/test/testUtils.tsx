// File: /src/test/testUtils.tsx
// Description: Common test utilities and setup
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import '@testing-library/jest-dom';

// Ensure correct breakpoint type
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Create a proper MUI theme with all required properties
const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    },
    error: {
      main: '#f44336'
    },
    warning: {
      main: '#ff9800'
    },
    info: {
      main: '#2196f3'
    },
    success: {
      main: '#4caf50'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    common: {
      black: '#000000',
      white: '#ffffff'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
});

// Create our mock theme by extending the MUI theme
export const mockMuiTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    keys: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    },
    up: jest.fn(),
    down: jest.fn(),
    between: jest.fn(),
    only: jest.fn(),
    not: jest.fn()
  }
};

// Create spacing function with required properties
const spacing = Object.assign(
  (value: number) => `${value * 8}px`,
  { xs: '8px', sm: '16px', md: '24px', lg: '32px', xl: '40px' }
);

// Styled components theme that extends MUI theme
export const mockStyledTheme = {
  ...mockMuiTheme,
  breakpoints: {
    ...mockMuiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing
};

// Mock auth functions
export const mockLoginWithGoogle = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = false, ...options }: RenderWithProvidersOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
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
          {withRouter ? <MemoryRouter>{children}</MemoryRouter> : children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};