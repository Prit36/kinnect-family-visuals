import { create } from 'zustand';
import { Edge, Node } from '@xyflow/react';
import { persist } from 'zustand/middleware';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 172;

interface Person {
  id: string;
  name: string;
  nickname?: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  occupation?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  isAlive: boolean;
  image?: string;
  phone?: string;
  email?: string;
  website?: string;
  biography?: string;
}

interface Relationship {
  id: string;
  source: string;
  target: string;
  type: 'parent' | 'spouse' | 'child';
}

interface SearchFilters {
  searchTerm: string;
  gender?: 'male' | 'female' | 'other';
  isAlive?: boolean;
  hasImage?: boolean;
}

// Mock Data
const mockData = {
  people: [
    {
      id: '1',
      name: 'John Doe',
      gender: 'male',
      birthDate: '1950-01-01',
      isAlive: true,
      occupation: 'Engineer',
      image: 'https://images.unsplash.com/photo-1573496896036-798281cbb6e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: '2',
      name: 'Jane Smith',
      gender: 'female',
      birthDate: '1955-05-05',
      deathDate: '2020-03-10',
      isAlive: false,
      occupation: 'Teacher',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d29tYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: '3',
      name: 'Alice Doe',
      gender: 'female',
      birthDate: '1975-03-15',
      isAlive: true,
      occupation: 'Doctor',
      image: 'https://images.unsplash.com/photo-1589156191108-c7377e255179?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdvdW1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: '4',
      name: 'Bob Doe',
      gender: 'male',
      birthDate: '1978-11-20',
      isAlive: true,
      occupation: 'Lawyer',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422aa9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    },
    {
      id: '5',
      name: 'Charlie Smith',
      gender: 'male',
      birthDate: '2000-07-04',
      isAlive: true,
      occupation: 'Student',
    },
    {
      id: '6',
      name: 'Diana Smith',
      gender: 'female',
      birthDate: '2003-12-25',
      isAlive: true,
      occupation: 'Student',
    },
  ],
  relationships: [
    { id: '1', source: '1', target: '3', type: 'parent' },
    { id: '2', source: '2', target: '3', type: 'parent' },
    { id: '3', source: '1', target: '4', type: 'parent' },
    { id: '4', source: '2', target: '4', type: 'parent' },
    { id: '5', source: '3', target: '5', type: 'parent' },
    { id: '6', source: '4', target: '6', type: 'parent' },
  ],
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
): { nodes: Node[]; edges: Edge[] } => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'LR' ? 'left' : 'top';
    node.sourcePosition = direction === 'LR' ? 'right' : 'bottom';

    // We are shifting the dagre node position (defined center ) to the top left
    // so it matches the React Flow node anchor point
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

interface FamilyTreeState {
  people: Person[];
  relationships: Relationship[];
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  darkMode: boolean;
  searchFilters: SearchFilters;
  nodeViewMode: 'normal' | 'fullImage';
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, 'id'>) => void;
  removeRelationship: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  toggleDarkMode: () => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  getFilteredPeople: () => Person[];
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  autoLayout: () => void;
  setNodeViewMode: (mode: 'normal' | 'fullImage') => void;
}

export const useFamilyTreeStore = create<FamilyTreeState>()(
  persist(
    (set, get) => ({
      people: mockData.people,
      relationships: mockData.relationships,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      darkMode: false,
      nodeViewMode: 'normal',
      searchFilters: {
        searchTerm: '',
        gender: undefined,
        isAlive: undefined,
        hasImage: undefined,
      },

      addPerson: (person) => {
        const newPerson: Person = { id: crypto.randomUUID(), ...person };
        set((state) => ({
          people: [...state.people, newPerson],
        }));
        set((state) => {
          const newNodes = [...state.nodes, {
            id: newPerson.id,
            data: newPerson,
            type: 'person',
            position: { x: 0, y: 0 },
          }];
          const { nodes, edges } = getLayoutedElements(newNodes, state.edges);
          return { nodes, edges };
        });
      },

      updatePerson: (id, updates) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === id ? { ...person, ...updates } : person
          ),
        }));
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
          ),
        }));
      },

      removePerson: (id) => {
        set((state) => ({
          people: state.people.filter((person) => person.id !== id),
        }));
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          ),
        }));
      },

      addRelationship: (relationship) => {
        const newRelationship = { id: crypto.randomUUID(), ...relationship };
        set((state) => ({
          relationships: [...state.relationships, newRelationship],
        }));
        set((state) => {
          const newEdges = [...state.edges, {
            id: newRelationship.id,
            source: newRelationship.source,
            target: newRelationship.target,
          }];
          const { nodes, edges } = getLayoutedElements(state.nodes, newEdges);
          return { nodes, edges };
        });
      },

      removeRelationship: (id) => {
        set((state) => ({
          relationships: state.relationships.filter(
            (relationship) => relationship.id !== id
          ),
        }));
        set((state) => ({
          edges: state.edges.filter((edge) => edge.id !== id),
        }));
      },

      setSelectedNode: (id) => set({ selectedNodeId: id }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      updateSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        })),
      
      getFilteredPeople: () => {
        const { people, searchFilters } = get();
        return people.filter((person) => {
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
      
      updateNodePosition: (nodeId, position) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId ? { ...node, position } : node
          ),
        })),
      
      setNodeViewMode: (mode) => set({ nodeViewMode: mode }),

      autoLayout: () => {
        set((state) => {
          const { nodes, edges } = getLayoutedElements(state.nodes, state.edges);
          return { nodes, edges };
        });
      },
    }),
    {
      name: 'family-tree-storage',
    }
  )
);
