/**
 * Image upload component with preview
 */

import React, { useRef } from 'react';
import { Upload, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconButton } from '../atoms/IconButton';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Profile Picture',
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    imagePreview,
    isUploading,
    uploadError,
    handleFileUpload,
    handleUrlChange,
    clearImage,
  } = useImageUpload({
    onImageChange: onChange,
    initialImage: value,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-4 mt-2">
        <div className="relative w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
          {isUploading ? (
            <LoadingSpinner size="md" />
          ) : imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0">
                <IconButton
                  icon={<X size={12} />}
                  onClick={clearImage}
                  size="sm"
                  variant="destructive"
                  className="h-5 w-5"
                />
              </div>
            </>
          ) : (
            <User size={32} className="text-gray-500" />
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={isUploading}
          >
            <Upload size={16} className="mr-2" />
            Upload Image
          </Button>
          
          <Input
            placeholder="Or enter image URL"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="text-sm"
            disabled={isUploading}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
      
      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {uploadError}
        </p>
      )}
    </div>
  );
};