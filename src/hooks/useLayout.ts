/**
 * Hook for layout management
 */

import { useCallback } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useFamilyTreeStore } from '../stores/familyTreeStore';
import { LayoutType, NodeViewMode } from '../types';
import { LAYOUT_OPTIONS } from '../constants';

export const useLayout = () => {
  const uiStore = useUIStore();
  const familyTreeStore = useFamilyTreeStore();

  const setLayout = useCallback((layout: LayoutType) => {
    uiStore.setCurrentLayout(layout);
    familyTreeStore.applyLayout(layout);
  }, [uiStore, familyTreeStore]);

  const setViewMode = useCallback((mode: NodeViewMode) => {
    uiStore.setNodeViewMode(mode);
  }, [uiStore]);

  const toggleFullscreen = useCallback(() => {
    uiStore.toggleFullscreen();
  }, [uiStore]);

  const toggleStatistics = useCallback(() => {
    uiStore.toggleStatistics();
  }, [uiStore]);

  return {
    currentLayout: uiStore.currentLayout,
    nodeViewMode: uiStore.nodeViewMode,
    isFullscreen: uiStore.isFullscreen,
    showStatistics: uiStore.showStatistics,
    
    setLayout,
    setViewMode,
    toggleFullscreen,
    toggleStatistics,
    
    layoutOptions: LAYOUT_OPTIONS,
  };
};