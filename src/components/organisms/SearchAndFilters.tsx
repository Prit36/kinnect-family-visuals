
/**
 * Search and filters component
 */

import React from 'react';
import { SearchInput } from '../molecules/SearchInput';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { useSearchStore } from '../../stores/searchStore';

interface SearchAndFiltersProps {
  className?: string;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  className,
}) => {
  const {
    searchTerm,
    gender,
    isAlive,
    hasImage,
    setSearchTerm,
    setGenderFilter,
    setAliveFilter,
    setImageFilter,
    clearFilters,
  } = useSearchStore();

  const hasActiveFilters = Boolean(
    searchTerm ||
    gender ||
    isAlive !== undefined ||
    hasImage !== undefined
  );

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        className="w-64"
      />
      
      <FilterDropdown
        gender={gender}
        isAlive={isAlive}
        hasImage={hasImage}
        onGenderChange={setGenderFilter}
        onAliveChange={setAliveFilter}
        onImageChange={setImageFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};
