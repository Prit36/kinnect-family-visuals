/**
 * Search and filter state store using Zustand
 */

import { create } from 'zustand';
import { SearchFilters, Person, Gender } from '../types';
import { FamilyTreeService } from '../services/familyTreeService';
import { useDebounce } from '../hooks/useDebounce';

interface SearchState extends SearchFilters {
  // Derived state
  filteredPeople: Person[];
  
  // Actions
  setSearchTerm: (term: string) => void;
  setGenderFilter: (gender?: Gender) => void;
  setAliveFilter: (isAlive?: boolean) => void;
  setImageFilter: (hasImage?: boolean) => void;
  clearFilters: () => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  
  // Internal
  _updateFilteredPeople: (people: Person[]) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  // Initial state
  searchTerm: '',
  gender: undefined,
  isAlive: undefined,
  hasImage: undefined,
  filteredPeople: [],

  // Actions
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  setGenderFilter: (gender) => {
    set({ gender });
  },

  setAliveFilter: (isAlive) => {
    set({ isAlive });
  },

  setImageFilter: (hasImage) => {
    set({ hasImage });
  },

  clearFilters: () => {
    set({
      searchTerm: '',
      gender: undefined,
      isAlive: undefined,
      hasImage: undefined,
    });
  },

  updateFilters: (filters) => {
    set((state) => ({ ...state, ...filters }));
  },

  _updateFilteredPeople: (people) => {
    const { searchTerm, gender, isAlive, hasImage } = get();
    const filtered = FamilyTreeService.filterPeople(people, {
      searchTerm,
      gender,
      isAlive,
      hasImage,
    });
    set({ filteredPeople: filtered });
  },
}));