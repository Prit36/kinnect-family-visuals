
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

export interface Person {
  id: string;
  name: string;
  image?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  occupation?: string;
  biography?: string;
  phone?: string;
  email?: string;
  website?: string;
  isAlive: boolean;
  maritalStatus?: string;
  nickname?: string;
  age?: number;
  notes?: string;
  tags?: string[];
}

export interface Relationship {
  sourceId: string;
  targetId: string;
  relationType: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export const relationshipTypes = [
  'Mother',
  'Father',
  'Son',
  'Daughter',
  'Child',
  'Brother',
  'Sister',
  'Sibling',
  'Husband',
  'Wife',
  'Spouse',
  'Partner',
  'Grandfather',
  'Grandmother',
  'Grandparent',
  'Grandson',
  'Granddaughter',
  'Grandchild',
  'Uncle',
  'Aunt',
  'Nephew',
  'Niece',
  'Stepfather',
  'Stepmother',
  'Stepchild',
  'Half-brother',
  'Half-sister',
  'Cousin',
  'In-law',
  'Guardian',
  'Adoptive Parent',
  'Adoptive Child',
  'Friend',
  'Colleague'
];

export const layoutOptions = [
  { value: 'hierarchical', label: 'Family Tree' },
  { value: 'force', label: 'Force Layout' },
  { value: 'circular', label: 'Circular' },
  { value: 'grid', label: 'Grid' },
  { value: 'radial', label: 'Radial' }
];

interface SearchFilters {
  searchTerm: string;
  gender?: string;
  isAlive?: boolean;
  hasImage?: boolean;
  ageRange?: { min: number; max: number };
  birthYear?: { min: number; max: number };
}

interface FamilyTreeState {
  people: Person[];
  relationships: Relationship[];
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  searchFilters: SearchFilters;
  currentLayout: string;
  showStatistics: boolean;
  isFullscreen: boolean;
  
  // Actions
  addPerson: (person: Omit<Person, 'id'>) => string;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addRelationship: (sourceId: string, targetId: string, relationType: string, details?: Partial<Relationship>) => void;
  updateRelationship: (sourceId: string, targetId: string, updates: Partial<Relationship>) => void;
  removePerson: (id: string) => void;
  removeRelationship: (sourceId: string, targetId: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  
  // Selection and search
  setSelectedNode: (id: string | null) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  getFilteredPeople: () => Person[];
  
  // Layout and display
  setLayout: (layout: string) => void;
  toggleStatistics: () => void;
  toggleFullscreen: () => void;
  
  // Utility functions
  getPersonById: (id: string) => Person | undefined;
  getRelationships: (personId: string) => Relationship[];
  getFamily: (personId: string) => Person[];
  exportData: () => string;
  importData: (data: string) => void;
  getStatistics: () => any;
}

const createPersonNode = (person: Person, position: { x: number; y: number }): Node => ({
  id: person.id,
  type: 'person',
  position,
  data: person,
  draggable: true,
  style: {
    background: person.gender === 'male' ? '#e3f2fd' : person.gender === 'female' ? '#fce4ec' : '#f3e5f5',
    border: `2px solid ${person.isAlive ? '#4caf50' : '#757575'}`,
  },
});

const createRelationshipEdge = (relationship: Relationship): Edge => ({
  id: `${relationship.sourceId}-${relationship.targetId}`,
  source: relationship.sourceId,
  target: relationship.targetId,
  label: relationship.relationType,
  type: 'smoothstep',
  animated: ['Spouse', 'Partner', 'Husband', 'Wife'].includes(relationship.relationType),
  style: {
    stroke: getRelationshipColor(relationship.relationType),
    strokeWidth: 2,
  },
  labelStyle: {
    fill: '#475569',
    fontWeight: 600,
    fontSize: 12,
    background: 'white',
    padding: '2px 4px',
    borderRadius: '4px',
  },
});

const getRelationshipColor = (relationType: string): string => {
  const colors: { [key: string]: string } = {
    'Mother': '#e91e63',
    'Father': '#2196f3',
    'Child': '#4caf50',
    'Son': '#4caf50',
    'Daughter': '#4caf50',
    'Sibling': '#ff9800',
    'Brother': '#ff9800',
    'Sister': '#ff9800',
    'Spouse': '#f44336',
    'Husband': '#f44336',
    'Wife': '#f44336',
    'Partner': '#f44336',
    'Grandparent': '#9c27b0',
    'Grandfather': '#9c27b0',
    'Grandmother': '#9c27b0',
    'Grandchild': '#8bc34a',
    'Grandson': '#8bc34a',
    'Granddaughter': '#8bc34a',
  };
  return colors[relationType] || '#64748b';
};

const calculateLayout = (people: Person[], relationships: Relationship[], layoutType: string) => {
  // Simple layout algorithms
  switch (layoutType) {
    case 'hierarchical':
      return people.map((person, index) => ({
        ...person,
        position: { x: (index % 5) * 200, y: Math.floor(index / 5) * 150 }
      }));
    case 'circular':
      return people.map((person, index) => {
        const angle = (index / people.length) * 2 * Math.PI;
        const radius = 300;
        return {
          ...person,
          position: {
            x: 400 + radius * Math.cos(angle),
            y: 300 + radius * Math.sin(angle)
          }
        };
      });
    case 'grid':
      return people.map((person, index) => ({
        ...person,
        position: { x: (index % 6) * 180, y: Math.floor(index / 6) * 140 }
      }));
    default:
      return people.map((person, index) => ({
        ...person,
        position: { x: Math.random() * 800 + 100, y: Math.random() * 600 + 100 }
      }));
  }
};

export const useFamilyTreeStore = create<FamilyTreeState>((set, get) => ({
  people: [],
  relationships: [],
  nodes: [],
  edges: [],
  selectedNodeId: null,
  searchFilters: { searchTerm: '' },
  currentLayout: 'hierarchical',
  showStatistics: false,
  isFullscreen: false,

  addPerson: (personData) => {
    const id = `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const person: Person = { ...personData, id, isAlive: personData.isAlive ?? true };
    
    const existingNodes = get().nodes;
    const position = existingNodes.length === 0 
      ? { x: 400, y: 300 }
      : { 
          x: Math.random() * 400 + 200, 
          y: Math.random() * 300 + 150 
        };

    const newNode = createPersonNode(person, position);

    set((state) => ({
      people: [...state.people, person],
      nodes: [...state.nodes, newNode],
    }));

    return id;
  },

  updatePerson: (id, updates) => {
    set((state) => ({
      people: state.people.map(p => p.id === id ? { ...p, ...updates } : p),
      nodes: state.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...updates } } : n),
    }));
  },

  addRelationship: (sourceId, targetId, relationType, details = {}) => {
    const relationship: Relationship = { sourceId, targetId, relationType, ...details };
    const newEdge = createRelationshipEdge(relationship);

    set((state) => ({
      relationships: [...state.relationships, relationship],
      edges: [...state.edges, newEdge],
    }));
  },

  updateRelationship: (sourceId, targetId, updates) => {
    set((state) => ({
      relationships: state.relationships.map(r => 
        r.sourceId === sourceId && r.targetId === targetId ? { ...r, ...updates } : r
      ),
    }));
  },

  removePerson: (id) => {
    set((state) => ({
      people: state.people.filter(p => p.id !== id),
      nodes: state.nodes.filter(n => n.id !== id),
      relationships: state.relationships.filter(r => r.sourceId !== id && r.targetId !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  removeRelationship: (sourceId, targetId) => {
    set((state) => ({
      relationships: state.relationships.filter(r => 
        !(r.sourceId === sourceId && r.targetId === targetId)
      ),
      edges: state.edges.filter(e => 
        !(e.source === sourceId && e.target === targetId)
      ),
    }));
  },

  updateNodePosition: (id, position) => {
    set((state) => ({
      nodes: state.nodes.map(node => 
        node.id === id ? { ...node, position } : node
      ),
    }));
  },

  setSelectedNode: (id) => {
    set({ selectedNodeId: id });
  },

  setSearchFilters: (filters) => {
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
      const matchesImage = searchFilters.hasImage === undefined || !!person.image === searchFilters.hasImage;
      
      return matchesSearch && matchesGender && matchesAlive && matchesImage;
    });
  },

  setLayout: (layout) => {
    set({ currentLayout: layout });
    const { people, relationships } = get();
    const layoutPositions = calculateLayout(people, relationships, layout);
    
    set((state) => ({
      nodes: state.nodes.map(node => {
        const layoutPerson = layoutPositions.find(p => p.id === node.id);
        return layoutPerson ? { ...node, position: layoutPerson.position } : node;
      })
    }));
  },

  toggleStatistics: () => {
    set((state) => ({ showStatistics: !state.showStatistics }));
  },

  toggleFullscreen: () => {
    set((state) => ({ isFullscreen: !state.isFullscreen }));
  },

  getPersonById: (id) => {
    return get().people.find(p => p.id === id);
  },

  getRelationships: (personId) => {
    return get().relationships.filter(r => r.sourceId === personId || r.targetId === personId);
  },

  getFamily: (personId) => {
    const relationships = get().getRelationships(personId);
    const familyIds = relationships.map(r => r.sourceId === personId ? r.targetId : r.sourceId);
    return get().people.filter(p => familyIds.includes(p.id));
  },

  exportData: () => {
    const { people, relationships } = get();
    return JSON.stringify({ people, relationships }, null, 2);
  },

  importData: (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.people && parsed.relationships) {
        const nodes = parsed.people.map((person: Person) => 
          createPersonNode(person, { x: Math.random() * 400 + 200, y: Math.random() * 300 + 150 })
        );
        const edges = parsed.relationships.map((rel: Relationship) => createRelationshipEdge(rel));
        
        set({
          people: parsed.people,
          relationships: parsed.relationships,
          nodes,
          edges,
        });
      }
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  },

  getStatistics: () => {
    const { people, relationships } = get();
    const currentYear = new Date().getFullYear();
    
    return {
      totalPeople: people.length,
      totalRelationships: relationships.length,
      alive: people.filter(p => p.isAlive).length,
      deceased: people.filter(p => !p.isAlive).length,
      maleCount: people.filter(p => p.gender === 'male').length,
      femaleCount: people.filter(p => p.gender === 'female').length,
      withPhotos: people.filter(p => p.image).length,
      averageAge: people.reduce((sum, p) => sum + (p.age || 0), 0) / people.length || 0,
      oldestPerson: people.reduce((oldest, p) => 
        (p.age || 0) > (oldest?.age || 0) ? p : oldest, people[0]
      ),
      youngestPerson: people.reduce((youngest, p) => 
        (p.age || Infinity) < (youngest?.age || Infinity) ? p : youngest, people[0]
      ),
      birthYearRange: {
        earliest: Math.min(...people.map(p => p.birthDate ? new Date(p.birthDate).getFullYear() : currentYear)),
        latest: Math.max(...people.map(p => p.birthDate ? new Date(p.birthDate).getFullYear() : 1900))
      },
      relationshipTypes: relationships.reduce((acc, r) => {
        acc[r.relationType] = (acc[r.relationType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  },
}));
