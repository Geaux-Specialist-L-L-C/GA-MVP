import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
      dark: '#9E7D39', // Darker gold for hover states
      light: '#D4B673', // Lighter gold for accents
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
      dark: '#725640', // Darker accent for hover states
      light: '#A68B74', // Lighter accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Secondary text
    },
    error: {
      main: '#E74C3C',
      dark: '#C0392B',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
});

const createSpacing = () => {
  const spacingFn = (value: number) => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  });
};

const styledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px',
  },
  spacing: createSpacing(),
};

export { muiTheme, styledTheme };