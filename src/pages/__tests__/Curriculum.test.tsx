// File: /src/pages/__tests__/Curriculum.test.tsx
// Description: Unit test for Curriculum page component.

import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { Breakpoint } from '@mui/material';
import Curriculum from "../Curriculum";

const mockLoginWithGoogle = jest.fn();

// Mock MUI theme for testing
const mockMuiTheme = {
  palette: {
    primary: {
      main: '#1976d2'
    }
  },
  spacing: (factor: number) => `${0.25 * factor}rem`
};

// Mock styled-components theme with full interface
const mockStyledTheme = {
  breakpoints: mockMuiTheme.breakpoints,
  spacing: mockMuiTheme.spacing,
  palette: {
    common: { black: '#000', white: '#fff' },
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
    success: { main: '#4caf50' },
    grey: { 500: '#9e9e9e' },
    text: { primary: 'rgba(0, 0, 0, 0.87)' },
    background: { default: '#fff' },
    action: { active: 'rgba(0, 0, 0, 0.54)' },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    divider: 'rgba(0, 0, 0, 0.12)'
  }
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

  test("renders Curriculum component", () => {
    renderWithProviders(<Curriculum />);
    // Check for the component's basic structure
    const curriculumElement = screen.getByTestId('curriculum-page');
    expect(curriculumElement).toBeInTheDocument();
  });

  test("displays curriculum heading", () => {
    renderWithProviders(<Curriculum />);
    // Check for heading - if it doesn't exist, this test will fail
    const heading = screen.queryByRole('heading', { name: /curriculum/i });
    expect(heading).toBeInTheDocument();
  });
});