// File: /src/theme/theme.ts
// Description: Unified theme configuration for MUI and styled-components
// Author: GitHub Copilot
// Updated: 2024-02-12

import { createTheme } from '@mui/material/styles';
import type { DefaultTheme } from 'styled-components';

export type ThemeMode = 'light' | 'dark';

const basePalette = {
  primary: {
    main: '#4654F6',
    dark: '#2F3AC4',
    light: '#7A86FF'
  },
  secondary: {
    main: '#E1B354',
    dark: '#B98C33',
    light: '#F2D28A'
  },
  success: {
    main: '#22C55E',
    dark: '#16A34A',
    light: '#BBF7D0'
  },
  warning: {
    main: '#F59E0B',
    dark: '#D97706',
    light: '#FDE68A'
  },
  error: {
    main: '#EF4444',
    dark: '#DC2626',
    light: '#FECACA'
  },
  info: {
    main: '#38BDF8',
    dark: '#0EA5E9',
    light: '#BAE6FD'
  }
};

const getPalette = (mode: ThemeMode) => ({
  mode,
  ...basePalette,
  background: mode === 'dark'
    ? {
        default: '#0B1020',
        paper: '#121A2F'
      }
    : {
        default: '#F5F7FF',
        paper: '#FFFFFF'
      },
  text: mode === 'dark'
    ? {
        primary: '#F8FAFF',
        secondary: '#B8C0E0'
      }
    : {
        primary: '#101326',
        secondary: '#4B5563'
      },
  divider: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)'
});

export const getMuiTheme = (mode: ThemeMode) =>
  createTheme({
    palette: getPalette(mode),
    typography: {
      fontFamily: 'Manrope, Inter, system-ui, sans-serif',
      h1: {
        fontSize: 'clamp(2.5rem, 3vw, 3.5rem)',
        fontWeight: 700
      },
      h2: {
        fontSize: 'clamp(2rem, 2.4vw, 2.75rem)',
        fontWeight: 700
      },
      h3: {
        fontSize: 'clamp(1.5rem, 2vw, 2rem)',
        fontWeight: 600
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600
      },
      h6: {
        fontSize: '1.1rem',
        fontWeight: 600
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7
      },
      body2: {
        fontSize: '0.95rem',
        lineHeight: 1.6
      }
    },
    breakpoints: {
      values: {
        xs: 320,
        sm: 768,
        md: 1024,
        lg: 1200,
        xl: 1536
      }
    },
    spacing: 4
  });

const createSpacing = () => {
  const spacingFn = (value: number): string => `${0.25 * value}rem`;
  return Object.assign(spacingFn, {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem'
  });
};

export const getStyledTheme = (mode: ThemeMode): DefaultTheme => {
  const muiTheme = getMuiTheme(mode);

  return {
    ...muiTheme,
    breakpoints: {
      ...muiTheme.breakpoints,
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      large: '1440px'
    },
    spacing: createSpacing(),
    colors: {
      border: mode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(15,23,42,0.12)',
      text: muiTheme.palette.text.primary,
      muted: muiTheme.palette.text.secondary,
      background: {
        hover: mode === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.04)',
        subtle: mode === 'dark' ? '#0F172A' : '#EEF2FF'
      },
      accent: basePalette.secondary.main,
      error: {
        main: muiTheme.palette.error.main,
        light: muiTheme.palette.error.light
      }
    },
    borderRadius: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      pill: '999px'
    },
    shadows: {
      sm: '0 10px 30px rgba(15, 23, 42, 0.08)',
      md: '0 24px 60px rgba(15, 23, 42, 0.12)',
      glow: mode === 'dark'
        ? '0 0 40px rgba(122, 134, 255, 0.35)'
        : '0 0 40px rgba(70, 84, 246, 0.25)'
    },
    gradients: {
      hero: mode === 'dark'
        ? 'radial-gradient(circle at top, rgba(122, 134, 255, 0.25), transparent 55%), linear-gradient(135deg, #0B1020 0%, #121A2F 60%, #1B2240 100%)'
        : 'radial-gradient(circle at top, rgba(70, 84, 246, 0.18), transparent 55%), linear-gradient(135deg, #F5F7FF 0%, #FFFFFF 60%, #EEF2FF 100%)',
      card: mode === 'dark'
        ? 'linear-gradient(135deg, rgba(18,26,47,0.9), rgba(24,33,62,0.9))'
        : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,255,0.9))'
    }
  };
};
