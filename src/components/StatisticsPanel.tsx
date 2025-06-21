
import React from 'react';
import { Users, User, Calendar, MapPin, Briefcase, Heart, TrendingUp } from 'lucide-react';
import { useFamilyTreeStore } from '../store/familyTreeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const StatisticsPanel: React.FC = () => {
  const { people, relationships } = useFamilyTreeStore();

  const totalPeople = people.length;
  const livingPeople = people.filter(p => p.isAlive).length;
  const deceasedPeople = totalPeople - livingPeople;
  const totalRelationships = relationships.length;

  // Gender statistics
  const maleCount = people.filter(p => p.gender === 'male').length;
  const femaleCount = people.filter(p => p.gender === 'female').length;
  const otherGenderCount = people.filter(p => p.gender === 'other').length;
  const unknownGenderCount = people.filter(p => !p.gender).length;

  // Age statistics
  const peopleWithAges = people.filter(p => p.age !== undefined);
  const averageAge = peopleWithAges.length > 0 
    ? Math.round(peopleWithAges.reduce((sum, p) => sum + (p.age || 0), 0) / peopleWithAges.length)
    : 0;

  // Birth place statistics
  const birthPlaces = people
    .filter(p => p.birthPlace)
    .reduce((acc, p) => {
      const place = p.birthPlace!;
      acc[place] = (acc[place] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topBirthPlace = Object.entries(birthPlaces)
    .sort(([,a], [,b]) => b - a)[0];

  // Occupation statistics
  const occupations = people
    .filter(p => p.occupation)
    .reduce((acc, p) => {
      const occupation = p.occupation!;
      acc[occupation] = (acc[occupation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topOccupation = Object.entries(occupations)
    .sort(([,a], [,b]) => b - a)[0];

  // Marital status statistics
  const marriedCount = people.filter(p => p.maritalStatus === 'married').length;
  const singleCount = people.filter(p => p.maritalStatus === 'single').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total People */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Total People</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{totalPeople}</div>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            {totalRelationships} relationships
          </p>
        </CardContent>
      </Card>

      {/* Living vs Deceased */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 dark:text-green-400">Living: {livingPeople}</span>
              <span className="text-gray-600 dark:text-gray-400">Deceased: {deceasedPeople}</span>
            </div>
            <Progress 
              value={totalPeople > 0 ? (livingPeople / totalPeople) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Gender</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-600 dark:text-blue-400">Male:</span>
              <span className="dark:text-gray-300">{maleCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pink-600 dark:text-pink-400">Female:</span>
              <span className="dark:text-gray-300">{femaleCount}</span>
            </div>
            {otherGenderCount > 0 && (
              <div className="flex justify-between">
                <span className="text-purple-600 dark:text-purple-400">Other:</span>
                <span className="dark:text-gray-300">{otherGenderCount}</span>
              </div>
            )}
            {unknownGenderCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Unknown:</span>
                <span className="dark:text-gray-300">{unknownGenderCount}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Average Age */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium dark:text-gray-200">Average Age</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{averageAge}</div>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            {peopleWithAges.length} people with known ages
          </p>
        </CardContent>
      </Card>

      {/* Top Birth Place */}
      {topBirthPlace && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Top Birth Place</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold truncate dark:text-white">{topBirthPlace[0]}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {topBirthPlace[1]} {topBirthPlace[1] === 1 ? 'person' : 'people'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top Occupation */}
      {topOccupation && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Top Occupation</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold truncate dark:text-white">{topOccupation[0]}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {topOccupation[1]} {topOccupation[1] === 1 ? 'person' : 'people'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Marital Status */}
      {(marriedCount > 0 || singleCount > 0) && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-200">Marital Status</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs">
              {marriedCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-600 dark:text-red-400">Married:</span>
                  <span className="dark:text-gray-300">{marriedCount}</span>
                </div>
              )}
              {singleCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-600 dark:text-blue-400">Single:</span>
                  <span className="dark:text-gray-300">{singleCount}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatisticsPanel;
