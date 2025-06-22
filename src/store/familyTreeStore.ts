import { create } from 'zustand';
import { Node, Edge, Position } from '@xyflow/react';
import dagre from '@dagre/dagre';

export interface Person {
  id: string;
  name: string;
  nickname?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  occupation?: string;
  phone?: string;
  email?: string;
  website?: string;
  biography?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  image?: string;
  isAlive: boolean;
}

export interface Relationship {
  id: string;
  parentId: string;
  childId: string;
  type: 'parent' | 'child' | 'spouse' | 'sibling';
}

export interface SearchFilters {
  searchTerm: string;
  gender?: 'male' | 'female' | 'other';
  isAlive?: boolean;
  hasImage?: boolean;
}

export const relationshipTypes = [
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'sibling', label: 'Sibling' },
];

export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

export const layoutOptions = [
  { value: 'hierarchical', label: 'Hierarchical' },
  { value: 'circular', label: 'Circular' },
  { value: 'grid', label: 'Grid' },
  { value: 'radial', label: 'Radial' },
  { value: 'force', label: 'Force-Directed' },
];

interface FamilyTreeState {
  people: Person[];
  relationships: Relationship[];
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  darkMode: boolean;
  currentLayout: string;
  showStatistics: boolean;
  isFullscreen: boolean;
  searchFilters: SearchFilters;
  
  // Actions
  addPerson: (person: Person) => void;
  removePerson: (id: string) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addRelationship: (relationship: Relationship) => void;
  removeRelationship: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  toggleDarkMode: () => void;
  setLayout: (layout: string) => void;
  toggleStatistics: () => void;
  toggleFullscreen: () => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  getFilteredPeople: () => Person[];
  exportData: () => string;
  importData: (jsonString: string) => void;
  clearData: () => void;
}

const createNode = (person: Person): Node => ({
  id: person.id,
  type: 'person',
  position: { x: Math.random() * 500, y: Math.random() * 500 },
  data: person,
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
});

const createEdge = (relationship: Relationship): Edge => ({
  id: relationship.id,
  source: relationship.parentId,
  target: relationship.childId,
  type: 'smoothstep',
  animated: true,
});

const applyHierarchicalLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 300, height: 400 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 150,
        y: nodeWithPosition.y - 200,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
};

const applyCircularLayout = (nodes: Node[]): Node[] => {
  const center = { x: 400, y: 300 };
  const radius = Math.max(200, nodes.length * 30);
  
  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    return {
      ...node,
      position: {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
};

const applyGridLayout = (nodes: Node[]): Node[] => {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const spacing = { x: 350, y: 450 };
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      ...node,
      position: {
        x: col * spacing.x + 50,
        y: row * spacing.y + 50,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
};

const applyRadialLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  if (nodes.length === 0) return nodes;
  
  const center = { x: 400, y: 300 };
  const levels: string[][] = [];
  const visited = new Set<string>();
  
  // Find root nodes (nodes with no incoming edges)
  const rootNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );
  
  if (rootNodes.length === 0) {
    // If no clear root, use the first node
    levels[0] = [nodes[0].id];
    visited.add(nodes[0].id);
  } else {
    levels[0] = rootNodes.map(node => node.id);
    rootNodes.forEach(node => visited.add(node.id));
  }
  
  // Build levels
  let currentLevel = 0;
  while (levels[currentLevel] && levels[currentLevel].length > 0) {
    const nextLevel: string[] = [];
    levels[currentLevel].forEach(nodeId => {
      edges.forEach(edge => {
        if (edge.source === nodeId && !visited.has(edge.target)) {
          nextLevel.push(edge.target);
          visited.add(edge.target);
        }
      });
    });
    if (nextLevel.length > 0) {
      levels[currentLevel + 1] = nextLevel;
      currentLevel++;
    } else {
      break;
    }
  }
  
  return nodes.map(node => {
    let level = 0;
    let indexInLevel = 0;
    
    for (let i = 0; i < levels.length; i++) {
      const index = levels[i].indexOf(node.id);
      if (index !== -1) {
        level = i;
        indexInLevel = index;
        break;
      }
    }
    
    const radius = level * 200 + 100;
    const nodesInLevel = levels[level]?.length || 1;
    const angle = (2 * Math.PI * indexInLevel) / nodesInLevel;
    
    return {
      ...node,
      position: {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });
};

export const useFamilyTreeStore = create<FamilyTreeState>((set, get) => ({
  people: [],
  relationships: [],
  nodes: [],
  edges: [],
  selectedNodeId: null,
  darkMode: false,
  currentLayout: 'hierarchical',
  showStatistics: false,
  isFullscreen: false,
  searchFilters: {
    searchTerm: '',
    gender: undefined,
    isAlive: undefined,
    hasImage: undefined,
  },

  addPerson: (person: Person) => {
    set((state) => {
      const newPeople = [...state.people, person];
      const newNodes = [...state.nodes, createNode(person)];
      return {
        people: newPeople,
        nodes: newNodes,
      };
    });
  },

  removePerson: (id: string) => {
    set((state) => ({
      people: state.people.filter(p => p.id !== id),
      nodes: state.nodes.filter(n => n.id !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id),
      relationships: state.relationships.filter(r => r.parentId !== id && r.childId !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  updatePerson: (id: string, updates: Partial<Person>) => {
    set((state) => ({
      people: state.people.map(p => p.id === id ? { ...p, ...updates } : p),
      nodes: state.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...updates } } : n),
    }));
  },

  addRelationship: (relationship: Relationship) => {
    set((state) => ({
      relationships: [...state.relationships, relationship],
      edges: [...state.edges, createEdge(relationship)],
    }));
  },

  removeRelationship: (id: string) => {
    set((state) => ({
      relationships: state.relationships.filter(r => r.id !== id),
      edges: state.edges.filter(e => e.id !== id),
    }));
  },

  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  updateNodePosition: (id: string, position: { x: number; y: number }) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === id ? { ...node, position } : node
      ),
    }));
  },

  toggleDarkMode: () => {
    set((state) => ({ darkMode: !state.darkMode }));
  },

  setLayout: (layout: string) => {
    set((state) => {
      let updatedNodes = [...state.nodes];
      
      switch (layout) {
        case 'hierarchical':
          updatedNodes = applyHierarchicalLayout(updatedNodes, state.edges);
          break;
        case 'circular':
          updatedNodes = applyCircularLayout(updatedNodes);
          break;
        case 'grid':
          updatedNodes = applyGridLayout(updatedNodes);
          break;
        case 'radial':
          updatedNodes = applyRadialLayout(updatedNodes, state.edges);
          break;
        default:
          break;
      }
      
      return {
        currentLayout: layout,
        nodes: updatedNodes,
      };
    });
  },

  toggleStatistics: () => {
    set((state) => ({ showStatistics: !state.showStatistics }));
  },

  toggleFullscreen: () => {
    set((state) => ({ isFullscreen: !state.isFullscreen }));
  },

  setSearchFilters: (filters: Partial<SearchFilters>) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters }
    }));
  },

  getFilteredPeople: () => {
    const { people, searchFilters } = get();
    
    return people.filter(person => {
      const matchesSearch = !searchFilters.searchTerm || 
        person.name.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
        person.nickname?.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
        person.occupation?.toLowerCase().includes(searchFilters.searchTerm.toLowerCase());
      
      const matchesGender = !searchFilters.gender || person.gender === searchFilters.gender;
      const matchesAlive = searchFilters.isAlive === undefined || person.isAlive === searchFilters.isAlive;
      const matchesImage = searchFilters.hasImage === undefined || 
        (searchFilters.hasImage ? !!person.image : !person.image);
      
      return matchesSearch && matchesGender && matchesAlive && matchesImage;
    });
  },

  exportData: () => {
    const { people, relationships } = get();
    return JSON.stringify({ people, relationships }, null, 2);
  },

  importData: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      const people = data.people || [];
      const relationships = data.relationships || [];
      
      set({
        people,
        relationships,
        nodes: people.map(createNode),
        edges: relationships.map(createEdge),
      });
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  },

  clearData: () => {
    set({
      people: [],
      relationships: [],
      nodes: [],
      edges: [],
      selectedNodeId: null,
    });
  },
}));
