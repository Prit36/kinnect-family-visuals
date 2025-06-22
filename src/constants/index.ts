/**
 * Application constants and configuration
 */

import { Gender, MaritalStatus, RelationshipType, LayoutType } from '../types';

// Layout Constants
export const LAYOUT_CONFIG = {
  NODE_WIDTH: 288,
  NODE_HEIGHT: 200,
  SPACING: {
    HORIZONTAL: 100,
    VERTICAL: 80
  }
} as const;

// Animation Constants
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5
  },
  EASING: {
    EASE_IN_OUT: 'easeInOut',
    EASE_OUT: 'easeOut'
  }
} as const;

// Form Constants
export const FORM_VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  BIOGRAPHY: {
    MAX_LENGTH: 1000
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  URL: {
    PATTERN: /^https?:\/\/.+/
  }
} as const;

// Options for dropdowns
export const GENDER_OPTIONS = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' },
  { value: Gender.OTHER, label: 'Other' }
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: MaritalStatus.SINGLE, label: 'Single' },
  { value: MaritalStatus.MARRIED, label: 'Married' },
  { value: MaritalStatus.DIVORCED, label: 'Divorced' },
  { value: MaritalStatus.WIDOWED, label: 'Widowed' }
] as const;

export const RELATIONSHIP_TYPE_OPTIONS = [
  { value: RelationshipType.PARENT, label: 'Parent' },
  { value: RelationshipType.SPOUSE, label: 'Spouse' },
  { value: RelationshipType.CHILD, label: 'Child' }
] as const;

export const LAYOUT_OPTIONS = [
  { value: LayoutType.HIERARCHICAL, label: 'Hierarchical' },
  { value: LayoutType.CIRCULAR, label: 'Circular' },
  { value: LayoutType.GRID, label: 'Grid' },
  { value: LayoutType.RADIAL, label: 'Radial' }
] as const;

// Theme Constants
export const THEME_CONFIG = {
  COLORS: {
    GENDER: {
      [Gender.MALE]: '#3b82f6',
      [Gender.FEMALE]: '#ec4899',
      [Gender.OTHER]: '#8b5cf6'
    },
    STATUS: {
      LIVING: '#10b981',
      DECEASED: '#6b7280'
    }
  },
  GRADIENTS: {
    PRIMARY: 'from-blue-500 to-purple-600',
    SECONDARY: 'from-green-400 to-blue-500'
  }
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  DARK_MODE: 'family-tree-dark-mode',
  LAYOUT_PREFERENCE: 'family-tree-layout',
  VIEW_MODE: 'family-tree-view-mode'
} as const;

// API Constants
export const API_CONFIG = {
  VERSION: '1.0.0',
  ENDPOINTS: {
    EXPORT: '/api/export',
    IMPORT: '/api/import'
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_URL: 'Please enter a valid URL',
    NAME_TOO_SHORT: `Name must be at least ${FORM_VALIDATION.NAME.MIN_LENGTH} characters`,
    NAME_TOO_LONG: `Name must be less than ${FORM_VALIDATION.NAME.MAX_LENGTH} characters`,
    BIOGRAPHY_TOO_LONG: `Biography must be less than ${FORM_VALIDATION.BIOGRAPHY.MAX_LENGTH} characters`,
    INVALID_DATE_RANGE: 'Birth date cannot be after death date'
  },
  IMPORT: {
    INVALID_FORMAT: 'Invalid file format. Please select a valid JSON file.',
    CORRUPTED_DATA: 'The file appears to be corrupted or incomplete.',
    VERSION_MISMATCH: 'This file was created with an incompatible version.'
  },
  GENERAL: {
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.'
  }
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PERSON_ADDED: 'Family member added successfully',
  PERSON_UPDATED: 'Family member updated successfully',
  PERSON_REMOVED: 'Family member removed successfully',
  DATA_EXPORTED: 'Family tree data exported successfully',
  DATA_IMPORTED: 'Family tree data imported successfully',
  LINK_COPIED: 'Shareable link copied to clipboard'
} as const;