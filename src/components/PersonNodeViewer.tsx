
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import PersonNode from './PersonNode';
import PersonNodeFullImage from './PersonNodeFullImage';
import { useFamilyTreeStore } from '../store/familyTreeStore';

interface PersonNodeViewerProps {
  id: string;
  data: {
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
  };
  selected?: boolean;
}

const PersonNodeViewer: React.FC<PersonNodeViewerProps> = ({ id, data, selected }) => {
  const { nodeViewMode } = useFamilyTreeStore();

  // Create a complete Person object with id
  const personData = { id, ...data };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
      
      {nodeViewMode === 'fullImage' ? (
        <PersonNodeFullImage id={id} data={personData} selected={selected} />
      ) : (
        <PersonNode id={id} data={personData} selected={selected} />
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
    </>
  );
};

export default PersonNodeViewer;
