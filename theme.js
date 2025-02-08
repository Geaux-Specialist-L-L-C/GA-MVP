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
});

export default theme;