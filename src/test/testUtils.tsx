import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext, type AuthContextProps } from "../contexts/AuthContext";
import '@testing-library/jest-dom';
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

// Enable React Router v7 future flags
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

export const mockSignIn = jest.fn();
export const mockSignOut = jest.fn();

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  mockAuthValue?: Partial<AuthContextProps>;
}

export const renderWithProviders = (
  ui: React.ReactNode,
  { withRouter = true, mockAuthValue = {}, ...options }: RenderWithProvidersOptions = {}
): RenderResult => {
  const defaultAuthValue: AuthContextProps = {
    user: null,
    session: null,
    signIn: mockSignIn,
    signOut: mockSignOut,
    error: null,
    loading: false,
    ...mockAuthValue
  };

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={defaultAuthValue}>
          {children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );

  if (withRouter) {
    const router = createMemoryRouter(
      [{ path: "*", element: <Providers>{ui}</Providers> }],
      { 
        initialEntries: ['/'],
        future
      }
    );
    return render(<RouterProvider router={router} future={future} />, options);
  }

  return render(<Providers>{ui}</Providers>, options);
};