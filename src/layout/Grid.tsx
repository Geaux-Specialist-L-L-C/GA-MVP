// File: /src/components/layout/Grid.tsx
// Description: Grid layout component with responsive columns
// Author: evopimp
// Created: 2025-03-03

import React from "react";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "sm" | "md" | "lg" | "xl";
}

const Grid: React.FC<GridProps> = ({ 
  children, 
  className = "", 
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  },
  gap = "md"
}) => {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8"
  };
  
  const getColumnsClass = () => {
    const classes = [];
    
    if (columns.sm) {
      classes.push(`grid-cols-${columns.sm}`);
    }
    
    if (columns.md) {
      classes.push(`md:grid-cols-${columns.md}`);
    }
    
    if (columns.lg) {
      classes.push(`lg:grid-cols-${columns.lg}`);
    }
    
    if (columns.xl) {
      classes.push(`xl:grid-cols-${columns.xl}`);
    }
    
    return classes.join(' ');
  };
  
  return (
    <div className={`grid ${getColumnsClass()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default Grid;