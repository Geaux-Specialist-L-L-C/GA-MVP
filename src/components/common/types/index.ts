// src/components/SomeComponent.tsx

import React from 'react';

// Reusable component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

// Example component with proper types
export interface SomeComponentProps extends BaseComponentProps {
  title?: string;
}

// Use arrow function with explicit return for better type inference
export const SomeComponent: React.FC<SomeComponentProps> = ({ title = 'Hello, World!', className, id }): JSX.Element => {
  return React.createElement('div', { className, id },
    React.createElement('h1', null, title)
  );
};

// Example utility function with explicit return type
export const exampleFunction = (input: string): string => input.toUpperCase();