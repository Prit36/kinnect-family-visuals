/**
 * Search input component with debouncing
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { IconButton } from '../atoms/IconButton';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search family members...',
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {value && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <IconButton
            icon={<X size={14} />}
            onClick={() => onChange('')}
            size="sm"
            variant="ghost"
            className="h-6 w-6"
          />
        </div>
      )}
    </div>
  );
};