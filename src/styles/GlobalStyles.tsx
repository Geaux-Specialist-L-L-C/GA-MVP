// File: /src/styles/GlobalStyles.tsx
// Description: Global style definitions for the application
// Author: evopimp
// Created: 2025-03-03

import { createGlobalStyle } from "styled-components";
import { ThemeConfig } from "@/styles/theme";

interface GlobalStylesProps {
  theme: ThemeConfig;
}

const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${({ theme }) => theme.fonts.sans};
    background-color: ${({ theme }) => 
      theme.colors.gray[50]};
    color: ${({ theme }) => 
      theme.colors.gray[900]};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    height: 100%;
    width: 100%;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 1rem;
    font-weight: 700;
    line-height: 1.2;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  h4 {
    font-size: 1.5rem;
  }
  
  h5 {
    font-size: 1.25rem;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  p {
    margin: 0 0 1rem;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary[500]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast} ease-in-out;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
    }
  }
  
  button {
    cursor: pointer;
    font-family: inherit;
  }
  
  /* For dark mode support */
  html[data-theme='dark'] {
    color-scheme: dark;
    
    body {
      background-color: ${({ theme }) => theme.colors.gray[900]};
      color: ${({ theme }) => theme.colors.gray[50]};
    }
  }
`;

export default GlobalStyles;