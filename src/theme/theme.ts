// File: /src/theme/theme.ts
// Description: Unified theme configuration for MUI and styled-components
// Author: GitHub Copilot
// Created: 2024-02-12

import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

// Create the base MUI theme
export const muiTheme = createTheme({
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
      light: '#F9EBEA',
    },
    warning: {
      main: '#F1C40F',
      dark: '#D4AC0D',
      light: '#FEF9E7',
    },
    info: {
      main: '#3498DB',
      dark: '#2980B9',
      light: '#EBF5FB',
    },
    success: {
      main: '#2ECC71',
      dark: '#27AE60',
      light: '#E8F8F5',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 4, // Base spacing unit (4px)
});

// Create spacing utility that returns rem values
const createSpacing = () => {
  const spacingFn = (value: number): string => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  });
};

// Create the styled-components theme that extends MUI theme
export const styledTheme: DefaultTheme = {
  ...muiTheme,
  breakpoints: {
    ...muiTheme.breakpoints,
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
  },
  spacing: createSpacing(),
  colors: {
    border: '#e0e0e0',
    text: muiTheme.palette.text.primary,
    background: {
      hover: '#f5f5f5',
    },
    error: {
      main: muiTheme.palette.error.main,
      light: muiTheme.palette.error.light,
    },
  },
  borderRadius: {
    default: '4px',
  },
};