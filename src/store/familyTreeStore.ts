
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';

export interface Person extends Record<string, unknown> {
  id: string;
  name: string;
  nickname?: string;
  image?: string;
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
  isAlive: boolean;
  age?: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string;
}

export type RelationType =
  | 'parent'
  | 'child'
  | 'sibling'
  | 'spouse'
  | 'partner'
  | 'friend'
  | 'colleague';

export const relationshipTypes = [
  'parent',
  'child',
  'sibling',
  'spouse',
  'partner',
  'friend',
  'colleague',
];

export const relationOptions = [
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'partner', label: 'Partner' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
];

export const layoutOptions = [
  { value: 'hierarchical', label: 'Hierarchical' },
  { value: 'circular', label: 'Circular' },
  { value: 'grid', label: 'Grid' },
  { value: 'radial', label: 'Radial' },
];

export interface SearchFilters {
  searchTerm: string;
  gender?: 'male' | 'female' | 'other';
  isAlive?: boolean;
  hasImage?: boolean;
  ageRange?: [number, number];
  birthYear?: number;
}

// Layout calculation functions
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 280;
  const nodeHeight = 200;
  
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: 'top' as const,
      sourcePosition: 'bottom' as const,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
};

const getCircularLayout = (nodes: Node[]) => {
  const radius = Math.max(300, nodes.length * 30);
  const centerX = 0;
  const centerY = 0;
  
  return nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
    };
  });
};

const getGridLayout = (nodes: Node[]) => {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const nodeWidth = 300;
  const nodeHeight = 220;
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      ...node,
      position: {
        x: col * nodeWidth,
        y: row * nodeHeight,
      },
    };
  });
};

const getRadialLayout = (nodes: Node[], edges: Edge[]) => {
  // Find root nodes (nodes with no incoming edges)
  const rootNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );
  
  if (rootNodes.length === 0) return getCircularLayout(nodes);
  
  const positioned = new Set<string>();
  const result = [...nodes];
  
  // Position root nodes in center
  rootNodes.forEach((root, index) => {
    const angle = (index / rootNodes.length) * 2 * Math.PI;
    const rootRadius = 100;
    const rootNode = result.find(n => n.id === root.id);
    if (rootNode) {
      rootNode.position = {
        x: rootRadius * Math.cos(angle),
        y: rootRadius * Math.sin(angle),
      };
      positioned.add(root.id);
    }
  });
  
  // Position children in concentric circles
  let level = 1;
  let currentLevel = [...rootNodes.map(n => n.id)];
  
  while (currentLevel.length > 0 && positioned.size < nodes.length) {
    const nextLevel: string[] = [];
    const levelRadius = 200 + (level * 150);
    
    currentLevel.forEach(parentId => {
      const children = edges
        .filter(edge => edge.source === parentId)
        .map(edge => edge.target)
        .filter(id => !positioned.has(id));
      
      children.forEach((childId, index) => {
        const angle = (index / Math.max(children.length, 1)) * 2 * Math.PI + 
                     (level * Math.PI / 4); // Offset each level
        const childNode = result.find(n => n.id === childId);
        if (childNode) {
          childNode.position = {
            x: levelRadius * Math.cos(angle),
            y: levelRadius * Math.sin(angle),
          };
          positioned.add(childId);
          nextLevel.push(childId);
        }
      });
    });
    
    currentLevel = nextLevel;
    level++;
  }
  
  return result;
};

export interface FamilyTreeState {
  people: Person[];
  relationships: Relationship[];
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  searchQuery: string;
  filterGender: string | null;
  filterStatus: string | null;
  showStatistics: boolean;
  currentLayout: string;
  isFullscreen: boolean;
  darkMode: boolean;
  searchFilters: SearchFilters;
  addPerson: (person: Omit<Person, 'id'>) => string;
  removePerson: (id: string) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  addRelationship: (sourceId: string, targetId: string, relationType: string) => void;
  removeRelationship: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterGender: (gender: string | null) => void;
  setFilterStatus: (status: string | null) => void;
  toggleStatistics: () => void;
  setLayout: (layout: string) => void;
  toggleFullscreen: () => void;
  toggleDarkMode: () => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  getPersonById: (id: string) => Person | undefined;
  getRelationships: (personId: string) => Relationship[];
  exportData: () => string;
  importData: (data: string) => void;
  generateShareLink: () => string;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  getFilteredPeople: () => Person[];
  applyLayout: () => void;
}

const initialPeople: Person[] = [
  {
    id: '1',
    name: 'John Doe',
    nickname: 'Johnny',
    gender: 'male',
    birthDate: '1950-01-01',
    birthPlace: 'New York, USA',
    occupation: 'Engineer',
    isAlive: true,
    age: 73,
    image: 'https://images.generated.photos/Rm9qRjE2a21OUGN5R1NqV0FOUlZlS0JQQkJQbU5oR21Gbk9ZZVVKT2FFVT0/prompt/1977338.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    nickname: 'Janie',
    gender: 'female',
    birthDate: '1955-05-05',
    birthPlace: 'Los Angeles, USA',
    occupation: 'Teacher',
    isAlive: true,
    age: 68,
    image: 'https://images.generated.photos/aG9KaW1zR1FkR3B2b09MRlVMd010a1F4blh3a1Z5aW1lV3R5R0JneHlGVT0/prompt/1977342.jpg',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    nickname: 'Em',
    gender: 'female',
    birthDate: '1980-03-10',
    birthPlace: 'Chicago, USA',
    occupation: 'Doctor',
    isAlive: true,
    age: 43,
    image: 'https://images.generated.photos/UEEuNFZ4a2hqR21zeGNjR1F4R090a2w4V0NlR2F1V05lR0Ezc3haT1VPUT0/prompt/1977345.jpg',
  },
  {
    id: '4',
    name: 'Michael Brown',
    nickname: 'Mike',
    gender: 'male',
    birthDate: '1978-11-15',
    birthPlace: 'Houston, USA',
    occupation: 'Lawyer',
    isAlive: true,
    age: 45,
    image: 'https://images.generated.photos/VjFuMWF4a2JkRjB2b09MRlVMd010a1F4blh3a1Z5aW1lV3R5R0JneHlGVT0/prompt/1977348.jpg',
  },
  {
    id: '5',
    name: 'David Wilson',
    nickname: 'Dave',
    gender: 'male',
    birthDate: '2005-07-20',
    birthPlace: 'Phoenix, USA',
    occupation: 'Student',
    isAlive: true,
    age: 18,
    image: 'https://images.generated.photos/aG9KaW1zR1FkR3B2b09MRlVMd010a1F4blh3a1Z5aW1lV3R5R0JneHlGVT0/prompt/1977351.jpg',
  },
  {
    id: '6',
    name: 'Ashley Taylor',
    nickname: 'Ash',
    gender: 'female',
    birthDate: '2007-09-25',
    birthPlace: 'Philadelphia, USA',
    occupation: 'Student',
    isAlive: true,
    age: 16,
    image: 'https://images.generated.photos/aG9KaW1zR1FkR3B2b09MRlVMd010a1F4blh3a1Z5aW1lV3R5R0JneHlGVT0/prompt/1977354.jpg',
  },
];

const initialRelationships: Relationship[] = [
  { id: '1', sourceId: '1', targetId: '3', relationType: 'parent' },
  { id: '2', sourceId: '2', targetId: '3', relationType: 'parent' },
  { id: '3', sourceId: '1', targetId: '4', relationType: 'parent' },
  { id: '4', sourceId: '2', targetId: '4', relationType: 'parent' },
  { id: '5', sourceId: '3', targetId: '5', relationType: 'parent' },
  { id: '6', sourceId: '4', targetId: '6', relationType: 'parent' },
];

const initialNodes: Node[] = initialPeople.map((person) => ({
  id: person.id,
  type: 'person',
  data: person,
  position: { x: Math.random() * 300, y: Math.random() * 300 },
}));

const initialEdges: Edge[] = initialRelationships.map((relationship) => ({
  id: relationship.id,
  source: relationship.sourceId,
  target: relationship.targetId,
  type: 'smoothstep',
  animated: true,
}));

export const useFamilyTreeStore = create<FamilyTreeState>((set, get) => ({
  people: initialPeople,
  relationships: initialRelationships,
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  searchQuery: '',
  filterGender: null,
  filterStatus: null,
  showStatistics: false,
  currentLayout: 'hierarchical',
  isFullscreen: false,
  darkMode: false,
  searchFilters: {
    searchTerm: '',
    gender: undefined,
    isAlive: undefined,
    hasImage: undefined,
    ageRange: undefined,
    birthYear: undefined,
  },
  addPerson: (person) => {
    const id = String(Date.now());
    const newPerson = { ...person, id };
    const newNode: Node = {
      id: id,
      type: 'person',
      data: newPerson,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
    };
    set((state) => ({
      people: [...state.people, newPerson],
      nodes: [...state.nodes, newNode],
    }));
    return id;
  },
  removePerson: (id: string) =>
    set((state) => ({
      people: state.people.filter((person) => person.id !== id),
      relationships: state.relationships.filter(
        (rel) => rel.sourceId !== id && rel.targetId !== id
      ),
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),
  updatePerson: (id: string, updates: Partial<Person>) =>
    set((state) => ({
      people: state.people.map((person) =>
        person.id === id ? { ...person, ...updates } : person
      ),
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
      ),
    })),
  addRelationship: (sourceId: string, targetId: string, relationType: string) =>
    set((state) => {
      const id = String(Date.now());
      const newRelationship = { id, sourceId, targetId, relationType };
      const newEdge: Edge = {
        id: id,
        source: sourceId,
        target: targetId,
        type: 'smoothstep',
        animated: true,
      };
      return {
        relationships: [...state.relationships, newRelationship],
        edges: [...state.edges, newEdge],
      };
    }),
  removeRelationship: (id: string) =>
    set((state) => ({
      relationships: state.relationships.filter((rel) => rel.id !== id),
      edges: state.edges.filter((edge) => edge.id !== id),
    })),
  setSelectedNode: (id: string | null) => set({ selectedNodeId: id }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilterGender: (gender: string | null) => set({ filterGender: gender }),
  setFilterStatus: (status: string | null) => set({ filterStatus: status }),
  toggleStatistics: () => set((state) => ({ showStatistics: !state.showStatistics })),
  setLayout: (layout: string) => {
    set({ currentLayout: layout });
    get().applyLayout();
  },
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode;
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('family-tree-dark-mode', newDarkMode.toString());
    return { darkMode: newDarkMode };
  }),
  updateNodePosition: (id: string, position: { x: number; y: number }) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position } : node
      ),
    })),
  getPersonById: (id: string) => {
    const people = get().people;
    return people.find((person) => person.id === id);
  },
  getRelationships: (personId: string) => {
    const relationships = get().relationships;
    return relationships.filter(
      (rel) => rel.sourceId === personId || rel.targetId === personId
    );
  },
  exportData: () => {
    const state = get();
    const data = JSON.stringify({
      people: state.people,
      relationships: state.relationships,
      nodes: state.nodes,
      edges: state.edges,
    });
    return data;
  },
  importData: (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      set({
        people: parsedData.people || [],
        relationships: parsedData.relationships || [],
        nodes: parsedData.nodes || [],
        edges: parsedData.edges || [],
      });
    } catch (error) {
      console.error('Failed to parse imported data:', error);
    }
  },
  generateShareLink: () => {
    const data = get().exportData();
    const encodedData = encodeURIComponent(data);
    const baseUrl = window.location.origin;
    const shareableLink = `${baseUrl}/?data=${encodedData}`;
    return shareableLink;
  },
  setSearchFilters: (filters: Partial<SearchFilters>) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters },
    })),
  getFilteredPeople: () => {
    const state = get();
    const { searchFilters } = state;
    return state.people.filter((person) => {
      if (searchFilters.searchTerm && !person.name.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())) {
        return false;
      }
      if (searchFilters.gender && person.gender !== searchFilters.gender) {
        return false;
      }
      if (searchFilters.isAlive !== undefined && person.isAlive !== searchFilters.isAlive) {
        return false;
      }
      if (searchFilters.hasImage !== undefined && !!person.image !== searchFilters.hasImage) {
        return false;
      }
      return true;
    });
  },
  applyLayout: () => {
    const state = get();
    const { nodes, edges, currentLayout } = state;
    let layoutedNodes: Node[] = [];

    switch (currentLayout) {
      case 'hierarchical':
        layoutedNodes = getLayoutedElements(nodes, edges, 'TB');
        break;
      case 'circular':
        layoutedNodes = getCircularLayout(nodes);
        break;
      case 'grid':
        layoutedNodes = getGridLayout(nodes);
        break;
      case 'radial':
        layoutedNodes = getRadialLayout(nodes, edges);
        break;
      default:
        layoutedNodes = getLayoutedElements(nodes, edges, 'TB');
    }

    set({ nodes: layoutedNodes });
  },
}));

// Initialize dark mode from localStorage
if (typeof window !== 'undefined') {
  const savedDarkMode = localStorage.getItem('family-tree-dark-mode');
  if (savedDarkMode === 'true') {
    document.documentElement.classList.add('dark');
    useFamilyTreeStore.setState({ darkMode: true });
  }
}
