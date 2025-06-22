
import React from 'react';
import { Users, Heart, Baby, Skull, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFamilyTreeStore } from '../store/familyTreeStore';

const StatisticsPanel: React.FC = () => {
  const { people, darkMode } = useFamilyTreeStore();

  const stats = {
    total: people.length,
    living: people.filter(p => p.isAlive).length,
    deceased: people.filter(p => !p.isAlive).length,
    male: people.filter(p => p.gender === 'male').length,
    female: people.filter(p => p.gender === 'female').length,
    withImages: people.filter(p => p.image).length,
    married: people.filter(p => p.maritalStatus === 'married').length,
    occupations: new Set(people.filter(p => p.occupation).map(p => p.occupation)).size,
  };

  // Calculate age statistics for living members
  const livingWithBirthDates = people.filter(p => p.isAlive && p.birthDate);
  const ages = livingWithBirthDates.map(p => {
    const birthYear = new Date(p.birthDate!).getFullYear();
    return new Date().getFullYear() - birthYear;
  });
  
  const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
  const oldestAge = ages.length > 0 ? Math.max(...ages) : 0;

  const cardClass = darkMode 
    ? 'bg-gray-800/50 border-gray-700 backdrop-blur-lg' 
    : 'bg-white/70 border-gray-200 backdrop-blur-lg';

  const textClass = darkMode ? 'text-gray-200' : 'text-gray-900';
  const subtextClass = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${textClass}`}>Total Members</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${textClass}`}>{stats.total}</div>
          <p className={`text-xs ${subtextClass}`}>
            {stats.male} male • {stats.female} female
          </p>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${textClass}`}>Living</CardTitle>
          <Heart className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${textClass}`}>{stats.living}</div>
          <p className={`text-xs ${subtextClass}`}>
            {averageAge > 0 ? `Avg age: ${averageAge}` : 'Active members'}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${textClass}`}>Deceased</CardTitle>
          <Skull className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${textClass}`}>{stats.deceased}</div>
          <p className={`text-xs ${subtextClass}`}>
            {stats.total > 0 ? `${Math.round((stats.deceased / stats.total) * 100)}% of total` : 'No data'}
          </p>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${textClass}`}>Occupations</CardTitle>
          <Briefcase className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${textClass}`}>{stats.occupations}</div>
          <p className={`text-xs ${subtextClass}`}>
            Different careers
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;
