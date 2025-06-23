
/**
 * Main hook for family tree operations
 */

import { useCallback, useEffect } from 'react';
import { useFamilyTreeStore } from '../stores/familyTreeStore';
import { useUIStore } from '../stores/uiStore';
import { useSearchStore } from '../stores/searchStore';
import { Person, Relationship, RelationshipType } from '../types';
import { ExportService } from '../services/exportService';
import { useToast } from './use-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

export const useFamilyTree = () => {
  const familyTreeStore = useFamilyTreeStore();
  const uiStore = useUIStore();
  const searchStore = useSearchStore();
  const { toast } = useToast();

  // Update filtered people when people or search filters change
  useEffect(() => {
    searchStore._updateFilteredPeople(familyTreeStore.people);
  }, [familyTreeStore.people, searchStore.searchTerm, searchStore.gender, searchStore.isAlive, searchStore.hasImage]);

  const addPerson = useCallback(
    (personData: Omit<Person, 'id'>, relationshipData?: { personId: string; type: RelationshipType }) => {
      try {
        const personId = familyTreeStore.addPerson(personData);
        
        if (relationshipData) {
          familyTreeStore.addRelationship(
            relationshipData.personId,
            personId,
            relationshipData.type
          );
        }
        
        toast({
          title: SUCCESS_MESSAGES.PERSON_ADDED,
          description: `${personData.name} has been added to the family tree`,
        });
        
        return personId;
      } catch (error) {
        toast({
          title: "Error",
          description: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
          variant: "destructive",
        });
        throw error;
      }
    },
    [familyTreeStore, toast]
  );

  const updatePerson = useCallback(
    (id: string, updates: Partial<Person>) => {
      try {
        familyTreeStore.updatePerson(id, updates);
        toast({
          title: SUCCESS_MESSAGES.PERSON_UPDATED,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
          variant: "destructive",
        });
        throw error;
      }
    },
    [familyTreeStore, toast]
  );

  const removePerson = useCallback(
    (id: string) => {
      try {
        const person = familyTreeStore.getPersonById(id);
        familyTreeStore.removePerson(id);
        
        if (uiStore.selectedNodeId === id) {
          uiStore.setSelectedNode(null);
        }
        
        toast({
          title: SUCCESS_MESSAGES.PERSON_REMOVED,
          description: person ? `${person.name} has been removed` : undefined,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
          variant: "destructive",
        });
        throw error;
      }
    },
    [familyTreeStore, uiStore, toast]
  );

  const exportData = useCallback(async () => {
    try {
      const { people, relationships } = familyTreeStore.exportData();
      ExportService.exportAsJSON(people, relationships);
      
      toast({
        title: SUCCESS_MESSAGES.DATA_EXPORTED,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
        variant: "destructive",
      });
    }
  }, [familyTreeStore, toast]);

  const importData = useCallback((people: Person[], relationships: Relationship[]) => {
    try {
      familyTreeStore.importData(people, relationships);
      
      toast({
        title: SUCCESS_MESSAGES.DATA_IMPORTED,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
        variant: "destructive",
      });
    }
  }, [familyTreeStore, toast]);

  const shareData = useCallback(async () => {
    try {
      const { people, relationships } = familyTreeStore.exportData();
      await ExportService.copyShareableLink(people, relationships);
      
      toast({
        title: SUCCESS_MESSAGES.LINK_COPIED,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: ERROR_MESSAGES.GENERAL.UNEXPECTED_ERROR,
        variant: "destructive",
      });
    }
  }, [familyTreeStore, toast]);

  const applyLayout = useCallback(
    (layoutType: string) => {
      familyTreeStore.applyLayout(layoutType);
      uiStore.setCurrentLayout(layoutType as any);
    },
    [familyTreeStore, uiStore]
  );

  return {
    // Data
    people: familyTreeStore.people,
    relationships: familyTreeStore.relationships,
    nodes: familyTreeStore.nodes,
    edges: familyTreeStore.edges,
    filteredPeople: searchStore.filteredPeople,
    statistics: familyTreeStore.getFamilyStatistics(),
    
    // UI State
    selectedNodeId: uiStore.selectedNodeId,
    nodeViewMode: uiStore.nodeViewMode,
    currentLayout: uiStore.currentLayout,
    showStatistics: uiStore.showStatistics,
    isFullscreen: uiStore.isFullscreen,
    
    // Search State
    searchFilters: {
      searchTerm: searchStore.searchTerm,
      gender: searchStore.gender,
      isAlive: searchStore.isAlive,
      hasImage: searchStore.hasImage,
    },
    
    // Actions
    addPerson,
    updatePerson,
    removePerson,
    exportData,
    importData,
    shareData,
    applyLayout,
    
    // UI Actions
    setSelectedNode: uiStore.setSelectedNode,
    setNodeViewMode: uiStore.setNodeViewMode,
    toggleStatistics: uiStore.toggleStatistics,
    toggleFullscreen: uiStore.toggleFullscreen,
    
    // Search Actions
    setSearchTerm: searchStore.setSearchTerm,
    setGenderFilter: searchStore.setGenderFilter,
    setAliveFilter: searchStore.setAliveFilter,
    setImageFilter: searchStore.setImageFilter,
    clearFilters: searchStore.clearFilters,
    
    // Getters
    getPersonById: familyTreeStore.getPersonById,
    getRelationships: familyTreeStore.getRelationships,
  };
};
