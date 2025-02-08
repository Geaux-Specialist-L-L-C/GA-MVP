import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C29A47', // Primary gold
    },
    secondary: {
      main: '#8C6B4D', // Deep gold accent
    },
    background: {
      default: '#F5F3F0', // Neutral background
      paper: '#FFF8E7',   // Highlight background
    },
    text: {
      primary: '#000000', // Black
    },
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    large: '1200px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '3rem',
  },
});

export default theme;
