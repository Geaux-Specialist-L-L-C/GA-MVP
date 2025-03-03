// File: /src/utils/formatters.ts
// Description: Utility functions for formatting data
// Author: evopimp
// Created: 2025-03-03 06:23:10

/**
 * Format a date to display time (e.g., "10:30 AM")
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Format a date to display date and time (e.g., "Mar 3, 2025, 10:30 AM")
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString([], { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });
};