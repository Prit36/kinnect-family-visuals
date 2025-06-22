/**
 * UI state store using Zustand
 */

import { create } from 'zustand';
import { LayoutType, NodeViewMode } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants';

interface UIState {
  // Selection state
  selectedNodeId: string | null;
  
  // View state
  nodeViewMode: NodeViewMode;
  currentLayout: LayoutType;
  showStatistics: boolean;
  isFullscreen: boolean;
  
  // Modal state
  isAddPersonModalOpen: boolean;
  isEditPersonModalOpen: boolean;
  editingPersonId: string | null;
  
  // Actions
  setSelectedNode: (id: string | null) => void;
  setNodeViewMode: (mode: NodeViewMode) => void;
  setCurrentLayout: (layout: LayoutType) => void;
  toggleStatistics: () => void;
  toggleFullscreen: () => void;
  
  // Modal actions
  openAddPersonModal: () => void;
  closeAddPersonModal: () => void;
  openEditPersonModal: (personId: string) => void;
  closeEditPersonModal: () => void;
  
  // Reset
  resetUI: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  selectedNodeId: null,
  nodeViewMode: NodeViewMode.NORMAL,
  currentLayout: LayoutType.HIERARCHICAL,
  showStatistics: false,
  isFullscreen: false,
  isAddPersonModalOpen: false,
  isEditPersonModalOpen: false,
  editingPersonId: null,

  // Actions
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  
  setNodeViewMode: (mode) => {
    set({ nodeViewMode: mode });
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  },
  
  setCurrentLayout: (layout) => {
    set({ currentLayout: layout });
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.LAYOUT_PREFERENCE, layout);
  },
  
  toggleStatistics: () => set((state) => ({ showStatistics: !state.showStatistics })),
  
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

  // Modal actions
  openAddPersonModal: () => set({ isAddPersonModalOpen: true }),
  
  closeAddPersonModal: () => set({ isAddPersonModalOpen: false }),
  
  openEditPersonModal: (personId) => set({ 
    isEditPersonModalOpen: true, 
    editingPersonId: personId 
  }),
  
  closeEditPersonModal: () => set({ 
    isEditPersonModalOpen: false, 
    editingPersonId: null 
  }),

  // Reset
  resetUI: () => set({
    selectedNodeId: null,
    showStatistics: false,
    isFullscreen: false,
    isAddPersonModalOpen: false,
    isEditPersonModalOpen: false,
    editingPersonId: null,
  }),
}));

// Initialize from localStorage
const initializeUIStore = () => {
  const savedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as NodeViewMode;
  const savedLayout = localStorage.getItem(STORAGE_KEYS.LAYOUT_PREFERENCE) as LayoutType;
  
  if (savedViewMode && Object.values(NodeViewMode).includes(savedViewMode)) {
    useUIStore.getState().setNodeViewMode(savedViewMode);
  }
  
  if (savedLayout && Object.values(LayoutType).includes(savedLayout)) {
    useUIStore.getState().setCurrentLayout(savedLayout);
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeUIStore();
}