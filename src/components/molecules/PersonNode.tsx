/**
 * Normal person node component
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Person } from '../../types';
import { Avatar } from '../atoms/Avatar';
import { StatusIndicator } from '../atoms/StatusIndicator';
import { IconButton } from '../atoms/IconButton';
import { formatLifespan, calculateAge } from '../../utils';
import { useFamilyTree } from '../../hooks/useFamilyTree';
import {
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  Phone,
  Mail,
  Globe,
  Star,
} from 'lucide-react';

interface PersonNodeProps {
  id: string;
  data: Person;
  selected?: boolean;
}

export const PersonNode: React.FC<PersonNodeProps> = memo(
  ({ data, id, selected }) => {
    const { setSelectedNode, removePerson } = useFamilyTree();

    const handleNodeClick = () => {
      setSelectedNode(selected ? null : id);
    };

    const handleActionClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    const age = calculateAge(data.birthDate || '', data.deathDate);

    const InfoRow: React.FC<{
      icon: React.ReactNode;
      label: string | React.ReactNode;
      tooltip?: string;
    }> = ({ icon, label, tooltip }) => (
      <div className="flex items-center space-x-3" title={tooltip}>
        <div className="text-gray-400">{icon}</div>
        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
          {label}
        </span>
      </div>
    );

    return (
      <div className="relative group" onClick={handleNodeClick}>
        <motion.div
          animate={{ scale: selected ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'w-72 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer',
            'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md',
            'border-2',
            selected
              ? 'border-sky-500'
              : 'border-transparent group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50'
          )}
        >
          {/* Main Content */}
          <div className="p-4 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-3">
              <Avatar person={data} size="xl" showStatusRing />
              {data.maritalStatus === 'married' && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full p-1 shadow-md border-2 border-white dark:border-gray-800">
                  <Star size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Name & Lifespan */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {data.name}
            </h3>
            {data.nickname && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                "{data.nickname}"
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {formatLifespan(data)}
              {age && ` (${age} years)`}
            </p>
            <div className="mt-2">
              <StatusIndicator isAlive={data.isAlive} />
            </div>
          </div>

          {/* Collapsible Details Section */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-gray-200/80 dark:border-gray-700/80"
              >
                <div className="p-4 space-y-3">
                  {data.birthDate && (
                    <InfoRow
                      icon={<Calendar size={16} />}
                      label={new Date(data.birthDate).toLocaleDateString()}
                      tooltip={`Born on ${new Date(data.birthDate).toLocaleDateString()}`}
                    />
                  )}
                  {data.birthPlace && (
                    <InfoRow
                      icon={<MapPin size={16} />}
                      label={data.birthPlace}
                      tooltip={`Birth Place: ${data.birthPlace}`}
                    />
                  )}
                  {data.occupation && (
                    <InfoRow icon={<Briefcase size={16} />} label={data.occupation} />
                  )}
                  {data.maritalStatus && (
                    <InfoRow
                      icon={<Heart size={16} />}
                      label={data.maritalStatus.charAt(0).toUpperCase() + data.maritalStatus.slice(1)}
                    />
                  )}
                  {data.phone && <InfoRow icon={<Phone size={16} />} label={data.phone} />}
                  {data.email && <InfoRow icon={<Mail size={16} />} label={data.email} />}
                  {data.website && (
                    <div className="flex items-center space-x-3">
                      <Globe size={16} className="text-gray-400 flex-shrink-0" />
                      <a
                        href={data.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-600 dark:text-sky-400 hover:underline truncate"
                        onClick={handleActionClick}
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {data.biography && (
                    <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-left leading-relaxed">
                        {data.biography}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end p-2 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                  <IconButton
                    icon={<Edit size={14} />}
                    onClick={handleActionClick}
                    tooltip="Edit Person"
                    size="sm"
                  />
                  <IconButton
                    icon={<Trash2 size={14} />}
                    onClick={(e) => {
                      handleActionClick(e);
                      removePerson(id);
                    }}
                    tooltip="Remove Person"
                    variant="destructive"
                    size="sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }
);