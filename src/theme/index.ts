// File: /src/theme/index.ts
// Description: Theme configuration and types
// Author: GitHub Copilot
// Created: 2024-02-20

import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      text: {
        primary: string;
        secondary: string;
      };
      background: {
        default: string;
        secondary: string;
        hover: string;
      };
      border: string;
      error: {
        main: string;
        light: string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      default: string;
      sm: string;
      md: string;
      lg: string;
      full: string;
    };
    typography: {
      size: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      weight: {
        normal: number;
        medium: number;
        bold: number;
      };
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    transitions: {
      default: string;
      fast: string;
      slow: string;
    };
  }
}

export const theme: DefaultTheme = {
  colors: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
    background: {
      default: '#FFFFFF',
      secondary: '#F3F4F6',
      hover: '#F9FAFB',
    },
    border: '#E5E7EB',
    error: {
      main: '#EF4444',
      light: '#FEE2E2',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    default: '0.25rem',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  typography: {
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    weight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  shadows: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    default: '0.2s ease-in-out',
    fast: '0.1s ease-in-out',
    slow: '0.3s ease-in-out',
  },
};