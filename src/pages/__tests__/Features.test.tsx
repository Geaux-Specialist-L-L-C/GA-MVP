// File: /src/pages/__tests__/Features.test.tsx
// Description: Unit test for Features page component.

import { render, screen } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import Features from "../Features";

const mockTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2'
    },
    background: {
      paper: '#ffffff'
    }
  }
});

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <MUIThemeProvider theme={mockTheme}>
      <StyledThemeProvider theme={mockTheme}>
        {ui}
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

test("renders Features component with correct content", () => {
  renderWithProviders(<Features />);
  expect(screen.getByText("Features")).toBeInTheDocument();
  expect(screen.getByText("AI-powered learning style assessment")).toBeInTheDocument();
  expect(screen.getByText("Personalized learning paths")).toBeInTheDocument();
  expect(screen.getByText("Real-time progress tracking")).toBeInTheDocument();
  expect(screen.getByText("Interactive dashboard")).toBeInTheDocument();
});