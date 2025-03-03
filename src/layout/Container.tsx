// File: /src/components/layout/Container.tsx
// Description: Container component for consistent content width
// Author: evopimp
// Created: 2025-03-03

import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = "", 
  size = "lg" 
}) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };
  
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;