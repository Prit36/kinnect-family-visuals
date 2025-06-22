
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Person } from '../store/familyTreeStore';
import { 
  User, 
  Trash2, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  Heart,
  Info,
  Crown,
  UserX
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
  const [showDetails, setShowDetails] = useState(false);
  const { removePerson, setSelectedNode, selectedNodeId, darkMode } = useFamilyTreeStore();
  const isSelected = selectedNodeId === id;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removePerson(id);
  };

  const handleSelect = () => {
    setSelectedNode(isSelected ? null : id);
  };

  const getGenderPlaceholder = () => {
    switch (data.gender) {
      case 'male':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <User size={48} className="text-white" />
          </div>
        );
      case 'female':
        return (
          <div className="w-full h-48 bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center">
            <User size={48} className="text-white" />
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
            <User size={48} className="text-white" />
          </div>
        );
    }
  };

  const getStatusColor = () => {
    if (!data.isAlive) return 'bg-gray-500';
    switch (data.gender) {
      case 'male': return 'bg-blue-500';
      case 'female': return 'bg-pink-500';
      default: return 'bg-purple-500';
    }
  };

  const getAgeDisplay = () => {
    if (data.age !== undefined) {
      return data.isAlive ? `${data.age} years old` : `Died at ${data.age}`;
    }
    return null;
  };

  return (
    <TooltipProvider>
      <div 
        className={`relative group cursor-pointer transition-all duration-300 w-80 ${
          isSelected ? 'scale-105 z-10' : 'hover:scale-102'
        }`}
        onClick={handleSelect}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${
          isSelected ? 'from-blue-400 to-purple-500' : 'from-transparent to-transparent'
        } rounded-2xl blur-sm opacity-0 ${isSelected ? 'opacity-30' : 'group-hover:opacity-20'} transition-opacity duration-300`} />
        
        {/* Main card */}
        <div className={`relative ${
          darkMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/95 border-gray-200'
        } backdrop-blur-sm rounded-2xl shadow-xl border-2 transition-all duration-300 overflow-hidden`}>
          
          <Handle
            type="target"
            position={Position.Top}
            className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800 shadow-lg"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800 shadow-lg"
          />
          
          {/* Profile Image/Placeholder - Full Width */}
          <div className="relative">
            {data.image ? (
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              getGenderPlaceholder()
            )}
            
            {/* Status overlay */}
            <div className="absolute top-3 left-3 flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${getStatusColor()} border-2 border-white shadow-lg`} />
              {data.maritalStatus === 'married' && (
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown size={12} className="text-white" />
                </div>
              )}
              {!data.isAlive && (
                <div className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                  <UserX size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Delete button */}
            <Button
              onClick={handleRemove}
              variant="destructive"
              size="sm"
              className="absolute top-3 right-3 w-8 h-8 p-0 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Trash2 size={14} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-1 leading-tight">
                {data.name}
              </h3>
              {data.nickname && (
                <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2">"{data.nickname}"</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  {data.gender && (
                    <span className={`px-3 py-1 rounded-full text-white font-medium ${
                      data.gender === 'male' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      data.gender === 'female' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                      'bg-gradient-to-r from-purple-500 to-violet-500'
                    }`}>
                      {data.gender}
                    </span>
                  )}
                  {getAgeDisplay() && (
                    <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                      {getAgeDisplay()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {data.birthDate && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      <Calendar size={14} />
                      <span className="text-xs font-medium truncate">
                        {new Date(data.birthDate).getFullYear()}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Born: {new Date(data.birthDate).toLocaleDateString()}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {data.birthPlace && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                      <MapPin size={14} />
                      <span className="text-xs font-medium truncate">
                        {data.birthPlace.split(',')[0]}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.birthPlace}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {data.occupation && (
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                  <Briefcase size={14} />
                  <span className="text-xs font-medium truncate">{data.occupation}</span>
                </div>
              )}
              
              {data.maritalStatus && (
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300">
                  <Heart size={14} />
                  <span className="text-xs font-medium capitalize">{data.maritalStatus}</span>
                </div>
              )}
            </div>

            {/* Toggle Details Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="w-full mb-3 text-xs"
            >
              {showDetails ? 'Less Details' : 'More Details'}
            </Button>

            {/* Expanded Details */}
            {showDetails && (
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                {data.deathDate && (
                  <div className="flex items-center space-x-3 text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Died: {new Date(data.deathDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {data.phone && (
                  <div className="flex items-center space-x-3 text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Phone size={14} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 truncate">{data.phone}</span>
                  </div>
                )}
                
                {data.email && (
                  <div className="flex items-center space-x-3 text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Mail size={14} className="text-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 truncate">{data.email}</span>
                  </div>
                )}
                
                {data.website && (
                  <div className="flex items-center space-x-3 text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Globe size={14} className="text-purple-500 flex-shrink-0" />
                    <a 
                      href={data.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                
                {data.biography && (
                  <div className="text-sm p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <div className="flex items-start space-x-2">
                      <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs">
                        {data.biography}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PersonNode;
