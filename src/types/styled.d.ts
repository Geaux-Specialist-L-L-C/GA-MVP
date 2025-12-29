import 'styled-components';
import { Theme } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    breakpoints: Theme['breakpoints'] & {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
    spacing: Theme['spacing'] & {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    colors: {
      border: string;
      text: string;
      muted: string;
      accent: string;
      background: {
        hover: string;
        subtle: string;
      };
      error: {
        main: string;
        light: string;
      };
    };
    borderRadius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      pill: string;
    };
    shadows: {
      sm: string;
      md: string;
      glow: string;
    };
    gradients: {
      hero: string;
      card: string;
    };
  }
}
