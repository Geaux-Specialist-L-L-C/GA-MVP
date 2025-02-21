// File: /home/wicked/GA-MVP/src/components/Theme.tsx
// Description: Theme implementation component for the application.
// Author: GitHub Copilot
// Created: [Date]

import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';

const lightTheme = {
  background: '#ffffff',
  color: '#000000',
};

const darkTheme = {
  background: '#000000',
  color: '#ffffff',
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const Theme: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Theme;
