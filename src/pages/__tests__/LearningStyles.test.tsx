// File: /src/pages/__tests__/LearningStyles.test.tsx
// Description: Unit test for Learning Styles page component.
import { render, screen } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import LearningStyles from "../LearningStyles";

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

describe('LearningStyles Component', () => {
  test("renders Learning Styles component with correct content", () => {
    renderWithProviders(<LearningStyles />);
    expect(screen.getByText("Learning Styles")).toBeInTheDocument();
    expect(screen.getByText("Discover your preferred learning style and how Geaux Academy can help you learn more effectively.")).toBeInTheDocument();
  });
});