import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AuthContextType } from "../types/auth";
import "@testing-library/jest-dom";
import { mockMuiTheme, mockStyledTheme } from "./mockThemes";

// Mock authentication function
export const mockLoginWithGoogle = jest.fn();

// Extend default render options
interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  withRouter?: boolean;
  initialRoute?: string;
  mockAuthValue?: Partial<AuthContextType>;
}

// Default Auth Context value
const getDefaultAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
  currentUser: null,
  loading: false,
  authError: null,
  login: jest.fn(),
  loginWithGoogle: mockLoginWithGoogle,
  signup: jest.fn(),
  logout: jest.fn(),
  setAuthError: jest.fn(),
  ...overrides,
});

// Provider Wrapper for tests
const Providers = ({
  children,
  authOverrides = {},
}: {
  children: React.ReactNode;
  authOverrides?: Partial<AuthContextType>;
}) => {
  const mockAuthValue = getDefaultAuthContext(authOverrides);

  return (
    <MUIThemeProvider theme={mockMuiTheme}>
      <StyledThemeProvider theme={mockStyledTheme}>
        <AuthContext.Provider value={mockAuthValue}>
          {children}
        </AuthContext.Provider>
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

// Function to render components with required providers
export const renderWithProviders = (
  ui: React.ReactNode,
  {
    withRouter = true,
    initialRoute = "/",
    mockAuthValue = {},
    ...options
  }: RenderWithProvidersOptions = {}
): RenderResult => {
  if (withRouter) {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<Providers authOverrides={mockAuthValue}>{ui}</Providers>} />
        </Routes>
      </MemoryRouter>,
      options
    );
  }

  return render(<Providers authOverrides={mockAuthValue}>{ui}</Providers>, options);
};

// Commenting out the unused variable routerFutureFlags to resolve the TS6133 error
// const routerFutureFlags = {
//   someFlag: true,
//   anotherFlag: false,
// };
