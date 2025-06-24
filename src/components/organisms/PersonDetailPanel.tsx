
/**
 * Person detail panel component
 */

import React from 'react';
import {
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Edit,
  X,
  Users,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '../atoms/Avatar';
import { StatusIndicator } from '../atoms/StatusIndicator';
import { useFamilyTreeStore } from '../../stores/familyTreeStore';
import { useUIStore } from '../../stores/uiStore';
import { formatDate, calculateAge } from '../../utils';

export const PersonDetailPanel: React.FC = () => {
  const {
    people,
    getPersonById,
    getRelationships,
  } = useFamilyTreeStore();
  
  const { selectedNodeId, setSelectedNode } = useUIStore();

  if (!selectedNodeId) return null;

  const person = getPersonById(selectedNodeId);
  if (!person) return null;

  const relationships = getRelationships(selectedNodeId);
  const age = person.isAlive && person.birthDate ? calculateAge(person.birthDate) : null;

  const handleClose = () => {
    setSelectedNode(null);
  };

  const handleEdit = () => {
    // This would open the edit modal
    console.log('Edit person:', person.id);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Person Details</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X size={16} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Profile Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar
                    person={person}
                    size="lg"
                    className="w-16 h-16"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                        {person.name}
                      </h3>
                      <StatusIndicator isAlive={person.isAlive} />
                    </div>
                    {person.nickname && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        "{person.nickname}"
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{person.gender}</Badge>
                      {person.maritalStatus && (
                        <Badge variant="outline">{person.maritalStatus}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {person.birthDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Born</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(person.birthDate)}
                        {age && ` (${age} years old)`}
                      </p>
                    </div>
                  </div>
                )}

                {!person.isAlive && person.deathDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Died</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(person.deathDate)}
                      </p>
                    </div>
                  </div>
                )}

                {person.birthPlace && (
                  <div className="flex items-center space-x-3">
                    <MapPin size={16} className="text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Birth Place</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{person.birthPlace}</p>
                    </div>
                  </div>
                )}

                {person.occupation && (
                  <div className="flex items-center space-x-3">
                    <Briefcase size={16} className="text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Occupation</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{person.occupation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            {(person.phone || person.email || person.website) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Contact</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {person.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{person.phone}</p>
                      </div>
                    </div>
                  )}

                  {person.email && (
                    <div className="flex items-center space-x-3">
                      <Mail size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{person.email}</p>
                      </div>
                    </div>
                  )}

                  {person.website && (
                    <div className="flex items-center space-x-3">
                      <Globe size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <a
                          href={person.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {person.website}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Biography */}
            {person.biography && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Biography</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {person.biography}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Relationships */}
            {relationships.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                    <Users size={16} />
                    <span>Family Relationships</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                  {relationships.map((rel, index) => {
                    const relatedPerson = people.find((p) => p.id === rel.relatedPersonId);
                    if (!relatedPerson) return null;

                    return (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            person={relatedPerson}
                            size="sm"
                            className="w-8 h-8"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {relatedPerson.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                              {rel.type}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedNode(relatedPerson.id)}
                          className="text-blue-600 dark:text-blue-400"
                        >
                          View
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
