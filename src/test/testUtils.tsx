// File: /src/test/testUtils.tsx
// Description: Shared test utilities and providers with correctly typed theme objects

import React, { Fragment } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider, createTheme, Theme as MUITheme } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { Breakpoint } from '@mui/material/styles';
import { AuthContext } from "../contexts/AuthContext";

const mockLoginWithGoogle = jest.fn();

// Create an array of 25 shadow values
const shadowValues: ["none", ...string[]] = [
  "none",
  ...Array(24).fill("0px 2px 4px rgba(0,0,0,0.2)")
];

export const mockMuiTheme: MUITheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2'
    },
    background: {
      paper: '#ffffff',
      default: '#ffffff'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    },
    keys: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    up: jest.fn(),
    down: jest.fn(),
    between: jest.fn(),
    only: jest.fn(),
    not: jest.fn()
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  unstable_sx: {},
  unstable_sxConfig: {},
  mixins: {},
  shadows: shadowValues,
  shape: {},
  transitions: {},
  zIndex: {},
  components: {},
  direction: 'ltr',
  applyStyles: {},
  containerQueries: {}
});

const spacing = Object.assign(
  (value: number) => `${value * 8}px`,
  { xs: '8px', sm: '16px', md: '24px', lg: '32px', xl: '40px' }
);

export const mockStyledTheme = {
  ...mockMuiTheme,
  spacing,
  breakpoints: {
    ...mockMuiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  }
};

type ProvidersProps = {
  children: React.ReactNode;
  withRouter?: boolean | undefined;
};

const AllTheProviders = ({ children, withRouter }: ProvidersProps) => {
  const Wrapper = withRouter ? MemoryRouter : Fragment;
  return (
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
          <Wrapper>
            {children}
          </Wrapper>
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { withRouter?: boolean }
) => {
  const { withRouter, ...renderOptions } = options || {};
  return render(ui, { 
    wrapper: (props) => <AllTheProviders {...props} withRouter={withRouter} />,
    ...renderOptions 
  });
};

export { mockLoginWithGoogle };