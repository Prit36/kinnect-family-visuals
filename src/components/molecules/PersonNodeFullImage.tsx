
/**
 * Full image person node component
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Person } from '../../types';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';
import { formatLifespan, getInitials, getAvatarBackgroundColor } from '../../utils';
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
} from 'lucide-react';

interface PersonNodeProps {
  id: string;
  data: Person;
  selected?: boolean;
}

export const PersonNodeFullImage: React.FC<PersonNodeProps> = memo(
  ({ data, id, selected }) => {
    const { setSelectedNode, removePerson } = useFamilyTree();

    const handleNodeClick = () => {
      setSelectedNode(selected ? null : id);
    };

    const handleEditClick = () => {
      // TODO: Implement edit functionality
      console.log('Edit person:', id);
    };

    const handleDeleteClick = () => {
      // TODO: Implement delete functionality
      console.log('Delete person:', id);
    };

    const handleActionClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    const InfoRow: React.FC<{
      icon: React.ReactNode;
      label: string | React.ReactNode;
      tooltip?: string;
      capitalize?: boolean;
    }> = ({ icon, label, tooltip, capitalize }) => (
      <div className="flex items-center space-x-3" title={tooltip}>
        <div className="text-gray-400">{icon}</div>
        <span
          className={cn(
            'text-sm text-gray-700 dark:text-gray-300 truncate',
            capitalize && 'capitalize'
          )}
        >
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
            'w-72 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer overflow-hidden',
            'bg-white dark:bg-gray-800',
            'border-2',
            selected
              ? 'border-sky-500'
              : 'border-transparent group-hover:border-gray-300/50 dark:group-hover:border-gray-600/50'
          )}
        >
          {/* Top Section with Image and Name */}
          <div className="relative">
            {data.image ? (
              <img
                src={data.image}
                alt={data.name}
                className="w-full h-auto object-cover rounded-t-2xl"
              />
            ) : (
              <div
                className={cn(
                  'w-full h-28 flex items-center justify-center font-bold text-4xl text-white rounded-t-2xl',
                  getAvatarBackgroundColor(data)
                )}
              >
                {getInitials(data.name)}
              </div>
            )}
            <div
              className="absolute bottom-0 left-0 w-full p-2 rounded-b-2xl text-white"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              <h3 className="font-bold text-xl text-center leading-snug">
                {data.name}
              </h3>
              <p className="text-sm text-center text-gray-300">
                {formatLifespan(data)}
              </p>
            </div>
          </div>

          {/* Collapsible Details Section */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-gray-200/80 dark:border-gray-700/80"
              >
                <div className="p-4 space-y-2">
                  {data.birthDate && (
                    <InfoRow
                      icon={<Calendar size={14} />}
                      label={new Date(data.birthDate).toLocaleDateString()}
                      tooltip={`Born on ${new Date(data.birthDate).toLocaleDateString()}`}
                    />
                  )}
                  {data.birthPlace && (
                    <InfoRow
                      icon={<MapPin size={14} />}
                      label={data.birthPlace}
                      tooltip={`Birth Place: ${data.birthPlace}`}
                    />
                  )}
                  {data.occupation && (
                    <InfoRow icon={<Briefcase size={14} />} label={data.occupation} />
                  )}
                  {data.maritalStatus && (
                    <InfoRow
                      icon={<Heart size={14} />}
                      label={data.maritalStatus}
                      capitalize
                    />
                  )}
                  {data.phone && <InfoRow icon={<Phone size={14} />} label={data.phone} />}
                  {data.email && <InfoRow icon={<Mail size={14} />} label={data.email} />}
                  {data.website && (
                    <div className="flex items-center space-x-3">
                      <Globe size={14} className="text-gray-400 flex-shrink-0" />
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
                    onClick={handleEditClick}
                    tooltip="Edit Person"
                    size="sm"
                  />
                  <IconButton
                    icon={<Trash2 size={14} />}
                    onClick={handleDeleteClick}
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
