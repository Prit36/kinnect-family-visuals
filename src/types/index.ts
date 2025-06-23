
/**
 * Core type definitions for the Family Tree application
 */

// Base types - Single source of truth
export type Gender = 'male' | 'female' | 'other';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type RelationshipType = 'parent' | 'spouse' | 'child';
export type LayoutType = 'hierarchical' | 'circular' | 'grid' | 'radial';
export type NodeViewMode = 'normal' | 'fullImage';

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
