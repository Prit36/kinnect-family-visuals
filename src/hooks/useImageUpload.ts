/**
 * Hook for handling image uploads and validation
 */

import { useState, useCallback } from 'react';
import { ValidationService } from '../services/validationService';

interface UseImageUploadProps {
  onImageChange: (imageUrl: string) => void;
  initialImage?: string;
}

export const useImageUpload = ({ onImageChange, initialImage = '' }: UseImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file
      const validation = ValidationService.validateFileUpload(file);
      if (!validation.isValid) {
        setUploadError(validation.errors[0]);
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        onImageChange(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError('Failed to upload image');
      setIsUploading(false);
    }
  }, [onImageChange]);

  const handleUrlChange = useCallback(async (url: string) => {
    if (!url) {
      setImagePreview('');
      onImageChange('');
      setUploadError(null);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate URL format
      if (!/^https?:\/\/.+/.test(url)) {
        setUploadError('Please enter a valid URL');
        setIsUploading(false);
        return;
      }

      // Validate that URL points to an image
      const isValidImage = await ValidationService.validateImageUrl(url);
      if (!isValidImage) {
        setUploadError('URL does not point to a valid image');
        setIsUploading(false);
        return;
      }

      setImagePreview(url);
      onImageChange(url);
      setIsUploading(false);
    } catch (error) {
      setUploadError('Failed to load image from URL');
      setIsUploading(false);
    }
  }, [onImageChange]);

  const clearImage = useCallback(() => {
    setImagePreview('');
    onImageChange('');
    setUploadError(null);
  }, [onImageChange]);

  return {
    imagePreview,
    isUploading,
    uploadError,
    handleFileUpload,
    handleUrlChange,
    clearImage,
  };
};