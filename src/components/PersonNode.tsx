
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Person } from '../store/familyTreeStore';
import { User, X } from 'lucide-react';
import { useFamilyTreeStore } from '../store/familyTreeStore';

interface PersonNodeProps extends NodeProps {
  data: Person;
}

const PersonNode: React.FC<PersonNodeProps> = ({ data, id }) => {
  const removePerson = useFamilyTreeStore(state => state.removePerson);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removePerson(id);
  };

  return (
    <div className="relative bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 min-w-[150px] max-w-[200px] hover:shadow-xl transition-shadow">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <button
        onClick={handleRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
      >
        <X size={12} />
      </button>

      <div className="flex flex-col items-center space-y-2">
        {data.image ? (
          <img
            src={data.image}
            alt={data.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
            <User size={32} className="text-gray-500" />
          </div>
        )}
        
        <div className="text-center">
          <h3 className="font-semibold text-sm text-gray-900 truncate max-w-full">
            {data.name}
          </h3>
          {data.gender && (
            <p className="text-xs text-gray-500 capitalize mt-1">
              {data.gender}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonNode;
