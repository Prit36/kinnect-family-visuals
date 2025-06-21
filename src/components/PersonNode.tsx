
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
  ChevronUp,
  Star,
  Crown
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
  const { removePerson, setSelectedNode, selectedNodeId, darkMode } = useFamilyTreeStore();
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

  const getGenderGradient = () => {
    if (!data.isAlive) return 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700';
    switch (data.gender) {
      case 'male': return 'from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-900/30 dark:via-blue-800/40 dark:to-indigo-800/30';
      case 'female': return 'from-pink-50 via-rose-100 to-purple-100 dark:from-pink-900/30 dark:via-rose-800/40 dark:to-purple-800/30';
      default: return 'from-purple-50 via-violet-100 to-indigo-100 dark:from-purple-900/30 dark:via-violet-800/40 dark:to-indigo-800/30';
    }
  };

  const getBorderGradient = () => {
    if (isSelected) return 'from-blue-400 to-purple-500';
    if (!data.isAlive) return 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500';
    switch (data.gender) {
      case 'male': return 'from-blue-400 to-indigo-500';
      case 'female': return 'from-pink-400 to-rose-500';
      default: return 'from-purple-400 to-violet-500';
    }
  };

  return (
    <TooltipProvider>
      <div 
        className={`relative group cursor-pointer transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-64'
        } ${isSelected ? 'scale-105 z-10' : 'hover:scale-102'}`}
        onClick={handleSelect}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getBorderGradient()} rounded-2xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
        
        {/* Main card */}
        <div className={`relative bg-gradient-to-br ${getGenderGradient()} backdrop-blur-sm rounded-2xl shadow-xl border-2 border-transparent bg-clip-padding transition-all duration-300`}>
          {/* Border gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getBorderGradient()} rounded-2xl p-0.5`}>
            <div className={`h-full w-full bg-gradient-to-br ${getGenderGradient()} rounded-2xl`} />
          </div>
          
          {/* Content */}
          <div className="relative p-6">
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
            
            {/* Close button */}
            <button
              onClick={handleRemove}
              className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl z-10 hover:scale-110"
            >
              <X size={14} />
            </button>

            {/* Header with profile */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                {data.image ? (
                  <div className="relative">
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/20" />
                  </div>
                ) : (
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getBorderGradient()} flex items-center justify-center border-3 border-white dark:border-gray-700 shadow-lg`}>
                    <User size={24} className="text-white" />
                  </div>
                )}
                
                {/* Status indicators */}
                {!data.isAlive && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">†</span>
                  </div>
                )}
                
                {data.maritalStatus === 'married' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown size={10} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1 leading-tight">
                  {data.name}
                </h3>
                {data.nickname && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-1">"{data.nickname}"</p>
                )}
                <div className="flex items-center space-x-2 text-xs">
                  {data.gender && (
                    <span className={`px-2 py-1 rounded-full text-white font-medium ${
                      data.gender === 'male' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      data.gender === 'female' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                      'bg-gradient-to-r from-purple-500 to-violet-500'
                    }`}>
                      {data.gender}
                    </span>
                  )}
                  {getAgeDisplay() && (
                    <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                      {getAgeDisplay()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick info icons */}
            <div className="flex justify-center space-x-3 mb-4">
              {data.birthDate && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                      <Calendar size={14} className="text-white" />
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                      <MapPin size={14} className="text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.birthPlace}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {data.occupation && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                      <Briefcase size={14} className="text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.occupation}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {data.maritalStatus && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                      <Heart size={14} className="text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.maritalStatus}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Expand/Collapse Button */}
            <div className="flex justify-center mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="h-8 px-4 text-xs bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300 border border-white/20 dark:border-gray-600/20 rounded-full transition-all duration-200"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={12} className="mr-1" />
                    Less Info
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} className="mr-1" />
                    More Info
                  </>
                )}
              </Button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="space-y-3 pt-3 border-t border-white/20 dark:border-gray-600/20">
                {data.deathDate && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-gray-800/30 rounded-lg p-2 backdrop-blur-sm">
                    <Calendar size={14} className="text-gray-500" />
                    <span>Died: {new Date(data.deathDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {data.phone && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-gray-800/30 rounded-lg p-2 backdrop-blur-sm">
                    <Phone size={14} className="text-green-500" />
                    <span className="truncate">{data.phone}</span>
                  </div>
                )}
                
                {data.email && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-gray-800/30 rounded-lg p-2 backdrop-blur-sm">
                    <Mail size={14} className="text-blue-500" />
                    <span className="truncate">{data.email}</span>
                  </div>
                )}
                
                {data.website && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-gray-800/30 rounded-lg p-2 backdrop-blur-sm">
                    <Globe size={14} className="text-purple-500" />
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
                  <div className="text-sm text-gray-600 dark:text-gray-300 bg-white/30 dark:bg-gray-800/30 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-start space-x-2">
                      <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                      <p className="leading-relaxed">{data.biography}</p>
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
