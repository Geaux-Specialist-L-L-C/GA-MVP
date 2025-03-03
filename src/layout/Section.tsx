// File: /src/components/layout/Section.tsx
// Description: Section component for page organization
// Author: evopimp
// Created: 2025-03-03

import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "white" | "light" | "dark" | "primary" | "secondary";
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  className = "", 
  id,
  padding = "lg",
  background = "white"
}) => {
  const paddingClasses = {
    none: "py-0",
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
    xl: "py-16"
  };
  
  const backgroundClasses = {
    white: "bg-white",
    light: "bg-gray-50",
    dark: "bg-gray-900 text-white",
    primary: "bg-primary-100",
    secondary: "bg-secondary-100"
  };
  
  return (
    <section 
      id={id}
      className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;