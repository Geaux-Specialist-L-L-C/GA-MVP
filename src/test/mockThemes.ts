import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';
import type { Theme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db'
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350'
    },
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

export const mockMuiTheme = muiTheme;

const spacing = Object.assign(
  ((factor: number) => `${0.25 * factor}rem`) as Theme['spacing'],
  {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  }
);

export const mockStyledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px'
  },
  spacing,
  colors: {
    border: '#e0e0e0',
    text: '#000000',
    background: {
      hover: '#f5f5f5'
    },
    error: {
      main: '#d32f2f',
      light: '#ffebee'
    }
  },
  borderRadius: {
    default: '4px'
  }
};