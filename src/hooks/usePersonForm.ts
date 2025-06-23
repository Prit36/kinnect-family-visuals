/**
 * Hook for managing person form state and validation
 */

import { useState, useCallback } from 'react';
import { PersonFormData, RelationshipType, Gender, MaritalStatus } from '../types';
import { ValidationService } from '../services/validationService';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '../constants';

interface UsePersonFormProps {
  initialData?: Partial<PersonFormData>;
  onSubmit: (data: PersonFormData) => void;
  onCancel: () => void;
}

export const usePersonForm = ({ initialData, onSubmit, onCancel }: UsePersonFormProps) => {
  const [formData, setFormData] = useState<PersonFormData>({
    name: initialData?.name || '',
    nickname: initialData?.nickname || '',
    gender: (initialData?.gender as Gender) || 'male',
    birthDate: initialData?.birthDate || '',
    deathDate: initialData?.deathDate || '',
    birthPlace: initialData?.birthPlace || '',
    occupation: initialData?.occupation || '',
    maritalStatus: (initialData?.maritalStatus as MaritalStatus) || undefined,
    isAlive: initialData?.isAlive !== undefined ? initialData.isAlive : true,
    image: initialData?.image || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    biography: initialData?.biography || '',
    selectedPerson: initialData?.selectedPerson || '',
    relationshipType: (initialData?.relationshipType as RelationshipType) || undefined,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');

  const updateField = useCallback(<K extends keyof PersonFormData>(
    field: K, 
    value: PersonFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [errors.length]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      updateField('image', result);
    };
    reader.readAsDataURL(file);
  }, [updateField]);

  const handleImageUrlChange = useCallback((url: string) => {
    updateField('image', url);
    if (url) {
      setImagePreview(url);
    }
  }, [updateField]);

  const validateForm = useCallback(() => {
    const validation = ValidationService.validatePersonForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  const handleCancel = useCallback(() => {
    setFormData({
      name: '',
      nickname: '',
      gender: 'male' as Gender,
      birthDate: '',
      deathDate: '',
      birthPlace: '',
      occupation: '',
      maritalStatus: undefined,
      isAlive: true,
      image: '',
      phone: '',
      email: '',
      website: '',
      biography: '',
      selectedPerson: '',
      relationshipType: undefined,
    });
    setErrors([]);
    setImagePreview('');
    onCancel();
  }, [onCancel]);

  const resetForm = useCallback(() => {
    setFormData({
      name: initialData?.name || '',
      nickname: initialData?.nickname || '',
      gender: (initialData?.gender as Gender) || 'male',
      birthDate: initialData?.birthDate || '',
      deathDate: initialData?.deathDate || '',
      birthPlace: initialData?.birthPlace || '',
      occupation: initialData?.occupation || '',
      maritalStatus: (initialData?.maritalStatus as MaritalStatus) || undefined,
      isAlive: initialData?.isAlive !== undefined ? initialData.isAlive : true,
      image: initialData?.image || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      website: initialData?.website || '',
      biography: initialData?.biography || '',
      selectedPerson: initialData?.selectedPerson || '',
      relationshipType: (initialData?.relationshipType as RelationshipType) || undefined,
    });
    setErrors([]);
    setImagePreview(initialData?.image || '');
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    imagePreview,
    updateField,
    handleImageUpload,
    handleImageUrlChange,
    handleSubmit,
    handleCancel,
    resetForm,
    validateForm,
    
    // Helper data
    genderOptions: GENDER_OPTIONS,
    maritalStatusOptions: MARITAL_STATUS_OPTIONS,
  };
};
