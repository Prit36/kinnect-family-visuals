
/**
 * Utility functions for the Family Tree application
 */

import { format, differenceInYears, parseISO, isValid } from 'date-fns';
import { Person, Gender, ExportData } from '../types';

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Format a person's lifespan
 */
export const formatLifespan = (person: Person): string => {
  const birth = person.birthDate ? new Date(person.birthDate).getFullYear() : '?';
  
  if (!person.isAlive && person.deathDate) {
    const death = new Date(person.deathDate).getFullYear();
    return `${birth} - ${death}`;
  }
  
  return person.isAlive ? `${birth} - Present` : `${birth} - ?`;
};

/**
 * Calculate age from birth and death dates
 */
export const calculateAge = (birthDate: string, deathDate?: string): number | null => {
  if (!birthDate) return null;
  
  const birth = parseISO(birthDate);
  if (!isValid(birth)) return null;
  
  const endDate = deathDate ? parseISO(deathDate) : new Date();
  if (deathDate && !isValid(endDate)) return null;
  
  return differenceInYears(endDate, birth);
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Get avatar background color based on gender
 */
export const getAvatarBackgroundColor = (person: Person): string => {
  switch (person.gender) {
    case 'male':
      return 'bg-blue-500';
    case 'female':
      return 'bg-pink-500';
    default:
      return 'bg-purple-500';
  }
};

/**
 * Get status color based on alive status
 */
export const getStatusColor = (isAlive: boolean): string => {
  return isAlive ? 'bg-green-500' : 'bg-gray-500';
};

/**
 * Get gender color for charts
 */
export const getGenderColor = (gender: Gender): string => {
  switch (gender) {
    case 'male':
      return '#3b82f6'; // blue-500
    case 'female':
      return '#ec4899'; // pink-500
    default:
      return '#8b5cf6'; // purple-500
  }
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Create shareable URL with data
 */
export const createShareableUrl = (data: ExportData): string => {
  const encodedData = encodeURIComponent(JSON.stringify(data));
  return `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
};

/**
 * Extract shared data from URL
 */
export const extractSharedDataFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('data');
};

/**
 * Clean URL by removing query parameters
 */
export const cleanUrl = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
