import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  font-weight: 600;
  background: ${({ theme, $variant }) => 
    $variant === 'secondary' 
      ? theme.palette.secondary.main 
      : theme.palette.primary.main};
  color: white;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }) => 
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