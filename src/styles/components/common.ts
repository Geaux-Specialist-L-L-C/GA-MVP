import styled from 'styled-components';
import { motion as m } from 'framer-motion';
import { DefaultTheme } from 'styled-components';

interface ThemeProps {
  theme: DefaultTheme;
}

interface ButtonProps extends ThemeProps {
  $variant?: 'primary' | 'secondary';
}

export const Container = styled(m.div)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }: ThemeProps) => theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }: ThemeProps) => theme.spacing.xl} 0;
`;

export const Card = styled(m.div)`
  background: ${({ theme }: ThemeProps) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }: ThemeProps) => theme.spacing.lg};
`;

export const Button = styled(m.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }: ThemeProps) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 600;
  background: ${({ theme, $variant }: ButtonProps) => 
    $variant === 'secondary' 
      ? theme.palette.secondary.main 
      : theme.palette.primary.main};
  color: white;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }: ButtonProps) => 
      $variant === 'secondary' 
        ? theme.palette.secondary.dark 
        : theme.palette.primary.dark};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StylesGrid = styled(m.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StyleCard = styled(m.div)`
  padding: 2rem;
  text-align: center;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;