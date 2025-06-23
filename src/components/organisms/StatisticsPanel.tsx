
/**
 * Statistics panel component
 */

import React from 'react';
import { Users, Heart, Skull, Briefcase } from 'lucide-react';
import { StatCard } from '../molecules/StatCard';
import { useFamilyTreeStore } from '../../stores/familyTreeStore';

interface StatisticsPanelProps {
  className?: string;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  className,
}) => {
  const { getFamilyStatistics } = useFamilyTreeStore();
  const statistics = getFamilyStatistics();

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <StatCard
        title="Total Members"
        value={statistics.total}
        subtitle={`${statistics.male} male • ${statistics.female} female`}
        icon={<Users className="h-4 w-4 text-blue-500" />}
      />

      <StatCard
        title="Living"
        value={statistics.living}
        subtitle={statistics.averageAge > 0 ? `Avg age: ${statistics.averageAge}` : 'Active members'}
        icon={<Heart className="h-4 w-4 text-green-500" />}
      />

      <StatCard
        title="Deceased"
        value={statistics.deceased}
        subtitle={
          statistics.total > 0
            ? `${Math.round((statistics.deceased / statistics.total) * 100)}% of total`
            : 'No data'
        }
        icon={<Skull className="h-4 w-4 text-gray-500" />}
      />

      <StatCard
        title="Occupations"
        value={statistics.occupations}
        subtitle="Different careers"
        icon={<Briefcase className="h-4 w-4 text-purple-500" />}
      />
    </div>
  );
};
