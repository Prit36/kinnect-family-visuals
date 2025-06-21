
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

export interface Person {
  id: string;
  name: string;
  image?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface Relationship {
  sourceId: string;
  targetId: string;
  relationType: string;
}

export const relationshipTypes = [
  'Mother',
  'Father',
  'Child',
  'Sibling',
  'Spouse',
  'Grandparent',
  'Grandchild',
  'Uncle',
  'Aunt',
  'Cousin',
  'Nephew',
  'Niece'
];

interface FamilyTreeState {
  people: Person[];
  relationships: Relationship[];
  nodes: Node[];
  edges: Edge[];
  addPerson: (person: Omit<Person, 'id'>) => string;
  addRelationship: (sourceId: string, targetId: string, relationType: string) => void;
  removePerson: (id: string) => void;
  removeRelationship: (sourceId: string, targetId: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  getPersonById: (id: string) => Person | undefined;
}

const createPersonNode = (person: Person, position: { x: number; y: number }): Node => ({
  id: person.id,
  type: 'person',
  position,
  data: person,
  draggable: true,
});

const createRelationshipEdge = (relationship: Relationship): Edge => ({
  id: `${relationship.sourceId}-${relationship.targetId}`,
  source: relationship.sourceId,
  target: relationship.targetId,
  label: relationship.relationType,
  type: 'smoothstep',
  animated: false,
  style: {
    stroke: '#64748b',
    strokeWidth: 2,
  },
  labelStyle: {
    fill: '#475569',
    fontWeight: 600,
    fontSize: 12,
  },
});

export const useFamilyTreeStore = create<FamilyTreeState>((set, get) => ({
  people: [],
  relationships: [],
  nodes: [],
  edges: [],

  addPerson: (personData) => {
    const id = `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const person: Person = { ...personData, id };
    
    // Calculate position for new node
    const existingNodes = get().nodes;
    const position = existingNodes.length === 0 
      ? { x: 250, y: 250 }
      : { 
          x: Math.random() * 400 + 100, 
          y: Math.random() * 300 + 100 
        };

    const newNode = createPersonNode(person, position);

    set((state) => ({
      people: [...state.people, person],
      nodes: [...state.nodes, newNode],
    }));

    return id;
  },

  addRelationship: (sourceId, targetId, relationType) => {
    const relationship: Relationship = { sourceId, targetId, relationType };
    const newEdge = createRelationshipEdge(relationship);

    set((state) => ({
      relationships: [...state.relationships, relationship],
      edges: [...state.edges, newEdge],
    }));
  },

  removePerson: (id) => {
    set((state) => ({
      people: state.people.filter(p => p.id !== id),
      nodes: state.nodes.filter(n => n.id !== id),
      relationships: state.relationships.filter(r => r.sourceId !== id && r.targetId !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id),
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

  getPersonById: (id) => {
    return get().people.find(p => p.id === id);
  },
}));
