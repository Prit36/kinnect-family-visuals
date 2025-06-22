/**
 * Status indicator component for showing alive/deceased status
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';

interface StatusIndicatorProps {
  isAlive: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isAlive,
  className,
}) => {
  return (
    <Badge
      variant={isAlive ? 'success' : 'default'}
      size="sm"
      className={className}
    >
      {isAlive ? 'Living' : 'Deceased'}
    </Badge>
  );
};