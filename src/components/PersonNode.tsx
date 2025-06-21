import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Person } from '../store/familyTreeStore';
import { 
  User, 
  X, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  Heart,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useFamilyTreeStore } from '../store/familyTreeStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PersonNodeProps extends Omit<NodeProps, 'data'> {
  data: Person;
}

const PersonNode: React.FC<PersonNodeProps> = ({ data, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { removePerson, setSelectedNode, selectedNodeId } = useFamilyTreeStore();
  const isSelected = selectedNodeId === id;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removePerson(id);
  };

  const handleSelect = () => {
    setSelectedNode(isSelected ? null : id);
  };

  const getAgeDisplay = () => {
    if (data.age !== undefined) {
      return data.isAlive ? `${data.age} years old` : `Died at ${data.age}`;
    }
    return null;
  };

  const getBorderColor = () => {
    if (isSelected) return '#3b82f6';
    if (!data.isAlive) return '#64748b';
    return data.gender === 'male' ? '#2563eb' : data.gender === 'female' ? '#ec4899' : '#8b5cf6';
  };

  const getBackgroundColor = () => {
    if (!data.isAlive) return '#f8fafc';
    return data.gender === 'male' ? '#eff6ff' : data.gender === 'female' ? '#fdf2f8' : '#f5f3ff';
  };

  return (
    <TooltipProvider>
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-200 cursor-pointer ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : 'hover:shadow-xl'
        }`}
        style={{
          backgroundColor: getBackgroundColor(),
          border: `3px solid ${getBorderColor()}`,
          minWidth: isExpanded ? '280px' : '180px',
          maxWidth: isExpanded ? '320px' : '220px',
        }}
        onClick={handleSelect}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-800"
        />
        
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
        >
          <X size={12} />
        </button>

        <div className="p-4">
          {/* Profile Image and Basic Info */}
          <div className="flex items-start space-x-3 mb-3">
            <div className="relative">
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm">
                  <User size={20} className="text-gray-500 dark:text-gray-300" />
                </div>
              )}
              {!data.isAlive && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">†</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                {data.name}
              </h3>
              {data.nickname && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{data.nickname}"</p>
              )}
              {data.gender && (
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {data.gender}
                </p>
              )}
              {getAgeDisplay() && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {getAgeDisplay()}
                </p>
              )}
            </div>
          </div>

          {/* Quick Info Icons */}
          <div className="flex justify-center space-x-2 mb-2">
            {data.birthDate && (
              <Tooltip>
                <TooltipTrigger>
                  <Calendar size={14} className="text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Born: {new Date(data.birthDate).toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {data.birthPlace && (
              <Tooltip>
                <TooltipTrigger>
                  <MapPin size={14} className="text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{data.birthPlace}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {data.occupation && (
              <Tooltip>
                <TooltipTrigger>
                  <Briefcase size={14} className="text-purple-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{data.occupation}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {data.maritalStatus && (
              <Tooltip>
                <TooltipTrigger>
                  <Heart size={14} className="text-pink-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{data.maritalStatus}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Expand/Collapse Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="h-6 px-2 text-xs dark:text-gray-300 dark:hover:text-gray-100"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={12} className="mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown size={12} className="mr-1" />
                  More
                </>
              )}
            </Button>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
              {data.deathDate && (
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar size={12} />
                  <span>Died: {new Date(data.deathDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {data.phone && (
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <Phone size={12} />
                  <span className="truncate">{data.phone}</span>
                </div>
              )}
              
              {data.email && (
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <Mail size={12} />
                  <span className="truncate">{data.email}</span>
                </div>
              )}
              
              {data.website && (
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <Globe size={12} />
                  <a 
                    href={data.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Website
                  </a>
                </div>
              )}
              
              {data.biography && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-start space-x-2">
                    <Info size={12} className="mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-3">{data.biography}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PersonNode;
