/**
 * Utility functions for the Family Tree application
 */

import { Person, Gender, ExportData } from '../types';
import { FORM_VALIDATION, API_CONFIG } from '../constants';

/**
 * Generate initials from a person's name
 */
export const getInitials = (name: string): string => {
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Calculate age from birth date and optional death date
 */
export const calculateAge = (birthDate: string, deathDate?: string): number | null => {
  if (!birthDate) return null;
  
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  
  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format lifespan display string
 */
export const formatLifespan = (person: Person): string => {
  const birthYear = person.birthDate ? new Date(person.birthDate).getFullYear() : '?';
  
  if (!person.isAlive && person.deathDate) {
    const deathYear = new Date(person.deathDate).getFullYear();
    return `${birthYear} - ${deathYear}`;
  }
  
  return `Born ${birthYear}`;
};

/**
 * Get status ring color based on person's gender and alive status
 */
export const getStatusRingColor = (person: Person): string => {
  if (!person.isAlive) return 'border-gray-500';
  
  switch (person.gender) {
    case Gender.MALE:
      return 'border-blue-500';
    case Gender.FEMALE:
      return 'border-pink-500';
    default:
      return 'border-purple-500';
  }
};

/**
 * Get background color for person avatar
 */
export const getAvatarBackgroundColor = (person: Person): string => {
  if (!person.isAlive) return 'bg-gray-500';
  
  switch (person.gender) {
    case Gender.MALE:
      return 'bg-blue-500';
    case Gender.FEMALE:
      return 'bg-pink-500';
    default:
      return 'bg-purple-500';
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return FORM_VALIDATION.EMAIL.PATTERN.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  return FORM_VALIDATION.PHONE.PATTERN.test(phone);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  return FORM_VALIDATION.URL.PATTERN.test(url);
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Create export data with metadata
 */
export const createExportData = (people: Person[], relationships: any[]): ExportData => {
  return {
    people,
    relationships,
    metadata: {
      version: API_CONFIG.VERSION,
      exportDate: new Date().toISOString(),
      totalMembers: people.length
    }
  };
};

/**
 * Validate import data structure
 */
export const validateImportData = (data: any): boolean => {
  return (
    data &&
    Array.isArray(data.people) &&
    Array.isArray(data.relationships) &&
    data.metadata &&
    typeof data.metadata.version === 'string'
  );
};

/**
 * Debounce function for search input
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
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if two objects are equal (shallow comparison)
 */
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  
  return true;
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate shareable URL with encoded data
 */
export const generateShareableUrl = (data: string): string => {
  const encodedData = encodeURIComponent(data);
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