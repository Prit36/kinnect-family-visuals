/**
 * Search and filters component
 */

import React from 'react';
import { SearchInput } from '../molecules/SearchInput';
import { FilterDropdown } from '../molecules/FilterDropdown';
import { useSearch } from '../../hooks/useSearch';

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
    hasActiveFilters,
    setSearchTerm,
    setGenderFilter,
    setAliveFilter,
    setImageFilter,
    clearFilters,
  } = useSearch();

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