// File: /src/test/testUtils.tsx
// Description: Common test utilities and setup
import { render } from "@testing-library/react";
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const mockTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
});

const styledTheme = {
  ...mockTheme,
  // Additional styled-components specific theme properties
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  large: '1440px'
};

export const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <MUIThemeProvider theme={mockTheme}>
      <StyledThemeProvider theme={styledTheme}>
        {ui}
      </StyledThemeProvider>
    </MUIThemeProvider>
  );
};

export { mockTheme, styledTheme };