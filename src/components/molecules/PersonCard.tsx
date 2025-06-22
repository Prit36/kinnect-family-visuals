/**
 * Person card component for displaying person information
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Person } from '../../types';
import { Avatar } from '../atoms/Avatar';
import { StatusIndicator } from '../atoms/StatusIndicator';
import { IconButton } from '../atoms/IconButton';
import { formatLifespan, calculateAge } from '../../utils';
import { Edit, Trash2, Eye } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onView,
  onEdit,
  onDelete,
  className,
}) => {
  const age = calculateAge(person.birthDate || '', person.deathDate);

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <Avatar person={person} size="md" showStatusRing />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {person.name}
            </h3>
            <StatusIndicator isAlive={person.isAlive} />
          </div>
          
          {person.nickname && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "{person.nickname}"
            </p>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {formatLifespan(person)}
            {age && ` (${age} years)`}
          </p>
          
          {person.occupation && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {person.occupation}
            </p>
          )}
        </div>
      </div>
      
      {(onView || onEdit || onDelete) && (
        <div className="flex justify-end space-x-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {onView && (
            <IconButton
              icon={<Eye size={16} />}
              onClick={onView}
              tooltip="View Details"
              size="sm"
            />
          )}
          {onEdit && (
            <IconButton
              icon={<Edit size={16} />}
              onClick={onEdit}
              tooltip="Edit Person"
              size="sm"
            />
          )}
          {onDelete && (
            <IconButton
              icon={<Trash2 size={16} />}
              onClick={onDelete}
              tooltip="Delete Person"
              variant="destructive"
              size="sm"
            />
          )}
        </div>
      )}
    </div>
  );
};