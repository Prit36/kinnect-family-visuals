/**
 * Statistics card component
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className,
}) => {
  return (
    <Card className={cn('bg-white/70 border-gray-200 backdrop-blur-lg dark:bg-gray-800/50 dark:border-gray-700', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-200">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};