import type { Theme as MUITheme, Breakpoints as MUIBreakpoints } from '@mui/material/styles';

declare module 'styled-components' {
  export interface DefaultTheme extends Omit<MUITheme, 'breakpoints' | 'spacing'> {
    breakpoints: MUIBreakpoints & {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
    spacing: ((value: number) => string) & {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
}