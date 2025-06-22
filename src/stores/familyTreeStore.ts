/**
 * Family tree data store using Zustand
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Person, Relationship, FamilyTreeNode, FamilyTreeEdge } from '../types';
import { FamilyTreeService } from '../services/familyTreeService';
import { LayoutService } from '../services/layoutService';
import { generateId } from '../utils';

interface FamilyTreeState {
  // Data
  people: Person[];
  relationships: Relationship[];
  nodes: FamilyTreeNode[];
  edges: FamilyTreeEdge[];
  
  // Actions
  addPerson: (person: Omit<Person, 'id'>) => string;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  addRelationship: (source: string, target: string, type: string) => void;
  removeRelationship: (id: string) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  
  // Getters
  getPersonById: (id: string) => Person | undefined;
  getRelationships: (personId: string) => Array<{ type: string; relatedPersonId: string }>;
  getFamilyStatistics: () => ReturnType<typeof FamilyTreeService.getFamilyStatistics>;
  
  // Data operations
  importData: (people: Person[], relationships: Relationship[]) => void;
  exportData: () => { people: Person[]; relationships: Relationship[] };
  clearData: () => void;
  
  // Layout operations
  applyLayout: (layoutType: string) => void;
  regenerateNodes: () => void;
}

export const useFamilyTreeStore = create<FamilyTreeState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    people: [],
    relationships: [],
    nodes: [],
    edges: [],

    // Actions
    addPerson: (personData) => {
      const newPerson = FamilyTreeService.createPerson(personData);
      
      set((state) => ({
        people: [...state.people, newPerson],
      }));
      
      // Regenerate nodes after adding person
      get().regenerateNodes();
      
      return newPerson.id;
    },

    updatePerson: (id, updates) => {
      set((state) => ({
        people: state.people.map((person) =>
          person.id === id ? { ...person, ...updates } : person
        ),
      }));
      
      // Update corresponding node
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
        ),
      }));
    },

    removePerson: (id) => {
      set((state) => ({
        people: state.people.filter((person) => person.id !== id),
        relationships: state.relationships.filter(
          (rel) => rel.source !== id && rel.target !== id
        ),
        nodes: state.nodes.filter((node) => node.id !== id),
        edges: state.edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        ),
      }));
    },

    addRelationship: (source, target, type) => {
      const newRelationship = FamilyTreeService.createRelationship(
        source,
        target,
        type as any
      );
      
      set((state) => ({
        relationships: [...state.relationships, newRelationship],
      }));
      
      // Regenerate edges
      get().regenerateNodes();
    },

    removeRelationship: (id) => {
      set((state) => ({
        relationships: state.relationships.filter((rel) => rel.id !== id),
        edges: state.edges.filter((edge) => edge.id !== id),
      }));
    },

    updateNodePosition: (nodeId, position) => {
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === nodeId ? { ...node, position } : node
        ),
      }));
    },

    // Getters
    getPersonById: (id) => {
      return get().people.find((person) => person.id === id);
    },

    getRelationships: (personId) => {
      return FamilyTreeService.getPersonRelationships(
        personId,
        get().relationships
      );
    },

    getFamilyStatistics: () => {
      return FamilyTreeService.getFamilyStatistics(get().people);
    },

    // Data operations
    importData: (people, relationships) => {
      set({
        people,
        relationships,
      });
      get().regenerateNodes();
    },

    exportData: () => {
      const { people, relationships } = get();
      return { people, relationships };
    },

    clearData: () => {
      set({
        people: [],
        relationships: [],
        nodes: [],
        edges: [],
      });
    },

    // Layout operations
    applyLayout: (layoutType) => {
      const { nodes, edges } = get();
      const { nodes: layoutedNodes, edges: layoutedEdges } = LayoutService.applyLayout(
        layoutType as any,
        nodes,
        edges
      );
      
      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
      });
    },

    regenerateNodes: () => {
      const { people, relationships } = get();
      
      const nodes: FamilyTreeNode[] = people.map((person) => ({
        id: person.id,
        data: person,
        type: 'person',
        position: { x: 0, y: 0 },
      }));

      const edges: FamilyTreeEdge[] = relationships.map((rel) => ({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        animated: true,
      }));

      // Apply default hierarchical layout
      const { nodes: layoutedNodes, edges: layoutedEdges } = LayoutService.applyLayout(
        'hierarchical' as any,
        nodes,
        edges
      );

      set({
        nodes: layoutedNodes,
        edges: layoutedEdges,
      });
    },
  }))
);