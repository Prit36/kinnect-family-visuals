/**
 * Hook for search functionality with debouncing
 */

import { useCallback } from 'react';
import { useSearchStore } from '../stores/searchStore';
import { useDebounce } from './useDebounce';
import { Gender } from '../types';

export const useSearch = () => {
  const searchStore = useSearchStore();
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchStore.searchTerm, 300);

  const setSearchTerm = useCallback((term: string) => {
    searchStore.setSearchTerm(term);
  }, [searchStore]);

  const setGenderFilter = useCallback((gender?: Gender) => {
    searchStore.setGenderFilter(gender);
  }, [searchStore]);

  const setAliveFilter = useCallback((isAlive?: boolean) => {
    searchStore.setAliveFilter(isAlive);
  }, [searchStore]);

  const setImageFilter = useCallback((hasImage?: boolean) => {
    searchStore.setImageFilter(hasImage);
  }, [searchStore]);

  const clearFilters = useCallback(() => {
    searchStore.clearFilters();
  }, [searchStore]);

  const hasActiveFilters = Boolean(
    searchStore.searchTerm ||
    searchStore.gender ||
    searchStore.isAlive !== undefined ||
    searchStore.hasImage !== undefined
  );

  return {
    searchTerm: searchStore.searchTerm,
    debouncedSearchTerm,
    gender: searchStore.gender,
    isAlive: searchStore.isAlive,
    hasImage: searchStore.hasImage,
    filteredPeople: searchStore.filteredPeople,
    hasActiveFilters,
    
    setSearchTerm,
    setGenderFilter,
    setAliveFilter,
    setImageFilter,
    clearFilters,
  };
};