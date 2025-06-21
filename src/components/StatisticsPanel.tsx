
import React from 'react';
import { BarChart3, Users, Heart, Camera, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFamilyTreeStore } from '../store/familyTreeStore';

const StatisticsPanel: React.FC = () => {
  const { getStatistics, people } = useFamilyTreeStore();
  const stats = getStatistics();

  if (people.length === 0) return null;

  const livingPercentage = (stats.alive / stats.totalPeople) * 100;
  const malePercentage = (stats.maleCount / stats.totalPeople) * 100;
  const femalePercentage = (stats.femaleCount / stats.totalPeople) * 100;
  const photoPercentage = (stats.withPhotos / stats.totalPeople) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPeople}</div>
          <div className="flex space-x-2 mt-2">
            <Badge variant="outline" className="text-green-600">
              {stats.alive} living
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {stats.deceased} deceased
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Male</span>
              <span>{stats.maleCount} ({malePercentage.toFixed(0)}%)</span>
            </div>
            <Progress value={malePercentage} className="h-2 bg-blue-100" />
            <div className="flex justify-between text-sm">
              <span>Female</span>
              <span>{stats.femaleCount} ({femalePercentage.toFixed(0)}%)</span>
            </div>
            <Progress value={femalePercentage} className="h-2 bg-pink-100" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Photos & Age</CardTitle>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.withPhotos}</div>
          <div className="text-xs text-muted-foreground">
            {photoPercentage.toFixed(0)}% have photos
          </div>
          <div className="mt-2 text-sm">
            <div>Avg age: {stats.averageAge.toFixed(1)} years</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Relationships</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRelationships}</div>
          <div className="text-xs text-muted-foreground">
            Total connections
          </div>
          <div className="mt-2">
            {Object.entries(stats.relationshipTypes).slice(0, 2).map(([type, count]) => (
              <div key={type} className="text-xs">
                {type}: {count}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;
