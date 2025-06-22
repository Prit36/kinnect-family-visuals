/**
 * Core type definitions for the Family Tree application
 */

export interface Person {
  id: string;
  name: string;
  nickname?: string;
  gender: Gender;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  occupation?: string;
  maritalStatus?: MaritalStatus;
  isAlive: boolean;
  image?: string;
  phone?: string;
  email?: string;
  website?: string;
  biography?: string;
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
}

export interface FamilyTreeNode {
  id: string;
  data: Person;
  type: 'person';
  position: Position;
  selected?: boolean;
}

export interface FamilyTreeEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface SearchFilters {
  searchTerm: string;
  gender?: Gender;
  isAlive?: boolean;
  hasImage?: boolean;
}

export interface ExportData {
  people: Person[];
  relationships: Relationship[];
  metadata: {
    version: string;
    exportDate: string;
    totalMembers: number;
  };
}

// Enums
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

export enum RelationshipType {
  PARENT = 'parent',
  SPOUSE = 'spouse',
  CHILD = 'child'
}

export enum LayoutType {
  HIERARCHICAL = 'hierarchical',
  CIRCULAR = 'circular',
  GRID = 'grid',
  RADIAL = 'radial'
}

export enum NodeViewMode {
  NORMAL = 'normal',
  FULL_IMAGE = 'fullImage'
}

// UI State Types
export interface UIState {
  darkMode: boolean;
  selectedNodeId: string | null;
  showStatistics: boolean;
  isFullscreen: boolean;
  nodeViewMode: NodeViewMode;
  currentLayout: LayoutType;
}

// Form Types
export interface PersonFormData extends Omit<Person, 'id'> {
  selectedPerson?: string;
  relationshipType?: RelationshipType;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PersonNodeProps extends BaseComponentProps {
  id: string;
  data: Person;
  selected?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
}