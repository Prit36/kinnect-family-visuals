
/**
 * Validation service for form data and user inputs
 */

import { PersonFormData } from '../types';
import { isValidEmail, isValidUrl } from '../utils';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * Validate person form data
   */
  static validatePersonForm(data: PersonFormData): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required');
    }

    // Name length validation
    if (data.name && typeof data.name === 'string' && data.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }

    if (data.nickname && typeof data.nickname === 'string' && data.nickname.length > 50) {
      errors.push('Nickname must be less than 50 characters');
    }

    // Birth place validation
    if (data.birthPlace && typeof data.birthPlace === 'string' && data.birthPlace.length > 100) {
      errors.push('Birth place must be less than 100 characters');
    }

    // Date validation
    if (data.birthDate && typeof data.birthDate === 'string' && data.birthDate) {
      const birthDate = new Date(data.birthDate);
      const deathDate = data.deathDate && typeof data.deathDate === 'string' ? new Date(data.deathDate) : null;
      
      if (deathDate && deathDate <= birthDate) {
        errors.push('Death date must be after birth date');
      }
    }

    // Email validation
    if (data.email && typeof data.email === 'string' && !isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    // Website validation
    if (data.website && typeof data.website === 'string' && !isValidUrl(data.website)) {
      errors.push('Please enter a valid website URL');
    }

    // Phone validation (basic)
    if (data.phone && typeof data.phone === 'string' && data.phone.length > 20) {
      errors.push('Phone number must be less than 20 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate search query
   */
  static validateSearchQuery(query: string): ValidationResult {
    const errors: string[] = [];

    if (query.length > 100) {
      errors.push('Search query must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): ValidationResult {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      errors.push('Image file must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Image must be JPEG, PNG, GIF, or WebP format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate file upload (alias for validateImageFile)
   */
  static validateFileUpload(file: File): ValidationResult {
    return this.validateImageFile(file);
  }

  /**
   * Validate image URL
   */
  static async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return contentType ? contentType.startsWith('image/') : false;
    } catch {
      return false;
    }
  }

  /**
   * Validate import data structure
   */
  static validateImportData(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Invalid data format');
      return { isValid: false, errors };
    }

    if (!Array.isArray(data.people)) {
      errors.push('People data must be an array');
    }

    if (!Array.isArray(data.relationships)) {
      errors.push('Relationships data must be an array');
    }

    // Basic structure validation for people
    if (Array.isArray(data.people)) {
      data.people.forEach((person: any, index: number) => {
        if (!person.id || typeof person.id !== 'string') {
          errors.push(`Person at index ${index} must have a valid ID`);
        }
        if (!person.name || typeof person.name !== 'string') {
          errors.push(`Person at index ${index} must have a valid name`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
