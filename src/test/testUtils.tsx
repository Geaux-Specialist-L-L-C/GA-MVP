import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextProps } from "../contexts/AuthContext";
import '@testing-library/jest-dom';
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

export const mockLoginWithGoogle = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  mockAuthValue?: Partial<AuthContextProps>;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = true, mockAuthValue = {}, ...options }: RenderWithProvidersOptions = {}
) => {
  const defaultAuthValue: AuthContextProps = {
    currentUser: null,
    isAuthReady: true,
    error: null,
    login: mockLoginWithGoogle,
    logout: jest.fn(),
    clearError: jest.fn(),
    ...mockAuthValue
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={defaultAuthValue}>
          {withRouter ? <MemoryRouter>{children}</MemoryRouter> : children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};