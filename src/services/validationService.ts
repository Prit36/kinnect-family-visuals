/**
 * Validation service for form data and business rules
 */

import { Person, PersonFormData } from '../types';
import { FORM_VALIDATION, ERROR_MESSAGES } from '../constants';
import { isValidEmail, isValidPhone, isValidUrl } from '../utils';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * Validate person form data
   */
  static validatePersonForm(data: Partial<PersonFormData>): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!data.name?.trim()) {
      errors.push(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD);
    }

    // Name validation
    if (data.name) {
      if (data.name.length < FORM_VALIDATION.NAME.MIN_LENGTH) {
        errors.push(ERROR_MESSAGES.VALIDATION.NAME_TOO_SHORT);
      }
      if (data.name.length > FORM_VALIDATION.NAME.MAX_LENGTH) {
        errors.push(ERROR_MESSAGES.VALIDATION.NAME_TOO_LONG);
      }
    }

    // Biography validation
    if (data.biography && data.biography.length > FORM_VALIDATION.BIOGRAPHY.MAX_LENGTH) {
      errors.push(ERROR_MESSAGES.VALIDATION.BIOGRAPHY_TOO_LONG);
    }

    // Date validation
    if (data.birthDate && data.deathDate) {
      const birthDate = new Date(data.birthDate);
      const deathDate = new Date(data.deathDate);
      if (birthDate > deathDate) {
        errors.push(ERROR_MESSAGES.VALIDATION.INVALID_DATE_RANGE);
      }
    }

    // Email validation
    if (data.email && !isValidEmail(data.email)) {
      errors.push(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
    }

    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
      errors.push(ERROR_MESSAGES.VALIDATION.INVALID_PHONE);
    }

    // URL validation
    if (data.website && !isValidUrl(data.website)) {
      errors.push(ERROR_MESSAGES.VALIDATION.INVALID_URL);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate image URL
   */
  static validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(file: File): ValidationResult {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be an image (JPEG, PNG, GIF, or WebP)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate import data structure
   */
  static validateImportData(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data) {
      errors.push('No data provided');
      return { isValid: false, errors };
    }

    if (!Array.isArray(data.people)) {
      errors.push('Invalid people data structure');
    }

    if (!Array.isArray(data.relationships)) {
      errors.push('Invalid relationships data structure');
    }

    if (!data.metadata || typeof data.metadata.version !== 'string') {
      errors.push('Invalid metadata structure');
    }

    // Validate each person
    if (Array.isArray(data.people)) {
      data.people.forEach((person: any, index: number) => {
        if (!person.id || !person.name) {
          errors.push(`Person at index ${index} is missing required fields`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}