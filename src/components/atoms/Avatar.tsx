/**
 * Avatar component for displaying person images or initials
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarBackgroundColor, getStatusRingColor } from '../../utils';
import { Person } from '../../types';

interface AvatarProps {
  person: Person;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusRing?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl',
};

const ringClasses = {
  sm: 'ring-2',
  md: 'ring-2',
  lg: 'ring-4',
  xl: 'ring-4',
};

export const Avatar: React.FC<AvatarProps> = ({
  person,
  size = 'md',
  showStatusRing = false,
  className,
  onClick,
}) => {
  const baseClasses = cn(
    'rounded-full flex items-center justify-center font-bold text-white transition-all duration-200',
    sizeClasses[size],
    showStatusRing && ringClasses[size],
    onClick && 'cursor-pointer hover:scale-105',
    className
  );

  const ringColor = showStatusRing ? getStatusRingColor(person) : '';
  const backgroundColor = getAvatarBackgroundColor(person);

  if (person.image) {
    return (
      <div
        className={cn(baseClasses, showStatusRing && ringColor)}
        onClick={onClick}
      >
        <img
          src={person.image}
          alt={person.name}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className={cn('hidden', backgroundColor)}>
          {getInitials(person.name)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, backgroundColor, showStatusRing && ringColor)}
      onClick={onClick}
    >
      {getInitials(person.name)}
    </div>
  );
};