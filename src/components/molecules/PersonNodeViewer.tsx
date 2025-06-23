
/**
 * Person node viewer component that switches between view modes
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { PersonNode } from './PersonNode';
import { PersonNodeFullImage } from './PersonNodeFullImage';
import { useUIStore } from '../../stores/uiStore';
import { Person } from '../../types';

interface PersonNodeViewerProps {
  id: string;
  data: Person;
  selected?: boolean;
}

export const PersonNodeViewer: React.FC<PersonNodeViewerProps> = ({
  id,
  data,
  selected,
}) => {
  const { nodeViewMode } = useUIStore();

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />

      {nodeViewMode === 'fullImage' ? (
        <PersonNodeFullImage id={id} data={data} selected={selected} />
      ) : (
        <PersonNode id={id} data={data} selected={selected} />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
    </>
  );
};
