// File: /src/styles/theme.ts
// Description: Theme constants and definitions for styling
// Author: evopimp
// Created: 2025-03-03

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

export const lightTheme: ThemeConfig = {
  colors: {
    primary: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9cff',
      500: '#0080ff', // Main primary color
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
    secondary: {
      50: '#fff0e6',
      100: '#ffd6b3',
      200: '#ffbd80',
      300: '#ffa44d',
      400: '#ff8b1a',
      500: '#ff7200', // Main secondary color
      600: '#cc5b00',
      700: '#994400',
      800: '#662e00',
      900: '#331700',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  fonts: {
    sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: '"Merriweather", Georgia, Cambria, "Times New Roman", Times, serif',
    mono: '"Fira Code", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};

export const darkTheme: ThemeConfig = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: {
      50: '#001a33',
      100: '#003366',
      200: '#004d99',
      300: '#0066cc',
      400: '#0080ff',
      500: '#1a9cff', // Main primary color (lighter in dark mode)
      600: '#4db3ff',
      700: '#80caff',
      800: '#b3e0ff',
      900: '#e6f7ff',
    },
    secondary: {
      50: '#331700',
      100: '#662e00',
      200: '#994400',
      300: '#cc5b00',
      400: '#ff7200',
      500: '#ff8b1a', // Main secondary color (lighter in dark mode)
      600: '#ffa44d',
      700: '#ffbd80',
      800: '#ffd6b3',
      900: '#fff0e6',
    },
    gray: {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569',
      400: '#64748b',
      500: '#94a3b8',
      600: '#cbd5e1',
      700: '#e2e8f0',
      800: '#f1f5f9',
      900: '#f8fafc',
    },
  },
};

export default lightTheme;