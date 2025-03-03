// File: /src/styles/ThemeProvider.tsx
// Description: Theme provider component for application-wide theming
// Author: evopimp
// Created: 2025-03-03

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ThemeMode, ThemeConfig, lightTheme, darkTheme } from "@/styles/theme";
import GlobalStyles from "@/styles/GlobalStyles";

interface ThemeContextType {
  theme: ThemeConfig;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: "light",
  toggleTheme: () => {},
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = "light",
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const theme = mode === "light" ? lightTheme : darkTheme;

  // Check for user's preferred color scheme or saved preference
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as ThemeMode | null;
    
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode("dark");
    }
    
    // Add listener for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    // Update the data-theme attribute on the document for CSS selectors
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setMode }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;