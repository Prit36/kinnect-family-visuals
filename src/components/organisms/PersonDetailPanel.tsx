/**
 * Person detail panel component
 */

import React from 'react';
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Heart,
  Edit,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '../atoms/Avatar';
import { StatusIndicator } from '../atoms/StatusIndicator';
import { useFamilyTree } from '../../hooks/useFamilyTree';
import { useTheme } from '../../contexts/ThemeContext';
import { formatDate, calculateAge } from '../../utils';

export const PersonDetailPanel: React.FC = () => {
  const {
    selectedNodeId,
    getPersonById,
    getRelationships,
    people,
    setSelectedNode,
  } = useFamilyTree();
  
  const { darkMode } = useTheme();

  if (!selectedNodeId) return null;

  const person = getPersonById(selectedNodeId);
  const relationships = getRelationships(selectedNodeId);

  if (!person) return null;

  const getRelatedPerson = (relationship: any) => {
    return people.find((p) => p.id === relationship.relatedPersonId);
  };

  const age = calculateAge(person.birthDate || '', person.deathDate);

  return (
    <div
      className={`fixed right-4 top-20 bottom-4 w-80 rounded-lg shadow-xl border z-20 overflow-y-auto ${
        darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
      }`}
    >
      <div
        className={`sticky top-0 border-b p-4 flex items-center justify-between ${
          darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
        }`}
      >
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : ''}`}>
          Person Details
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
          <X size={16} />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Section */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Avatar person={person} size="xl" showStatusRing />
          </div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            {person.name}
          </h3>
          {person.nickname && (
            <p className={`italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              "{person.nickname}"
            </p>
          )}
          <div className="flex justify-center mt-2">
            <StatusIndicator isAlive={person.isAlive} />
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="space-y-3">
          <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Basic Information
          </h4>

          {person.gender && (
            <div className="flex items-center space-x-2">
              <User size={16} className="text-gray-500" />
              <span className="text-sm capitalize">{person.gender}</span>
            </div>
          )}

          {person.birthDate && (
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <div className="text-sm">
                <span>Born: {formatDate(person.birthDate)}</span>
                {age && <span className="text-gray-600 ml-2">({age} years)</span>}
              </div>
            </div>
          )}

          {person.deathDate && (
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm">Died: {formatDate(person.deathDate)}</span>
            </div>
          )}

          {person.birthPlace && (
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-sm">{person.birthPlace}</span>
            </div>
          )}

          {person.occupation && (
            <div className="flex items-center space-x-2">
              <Briefcase size={16} className="text-gray-500" />
              <span className="text-sm">{person.occupation}</span>
            </div>
          )}

          {person.maritalStatus && (
            <div className="flex items-center space-x-2">
              <Heart size={16} className="text-gray-500" />
              <span className="text-sm capitalize">{person.maritalStatus}</span>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {(person.phone || person.email || person.website) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Contact Information
              </h4>

              {person.phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-500" />
                  <a
                    href={`tel:${person.phone}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {person.phone}
                  </a>
                </div>
              )}

              {person.email && (
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-500" />
                  <a
                    href={`mailto:${person.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {person.email}
                  </a>
                </div>
              )}

              {person.website && (
                <div className="flex items-center space-x-2">
                  <Globe size={16} className="text-gray-500" />
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </>
        )}

        {/* Biography */}
        {person.biography && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Biography
              </h4>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {person.biography}
              </p>
            </div>
          </>
        )}

        {/* Relationships */}
        {relationships.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Family Relationships
              </h4>
              <div className="space-y-2">
                {relationships.map((rel, index) => {
                  const relatedPerson = getRelatedPerson(rel);
                  if (!relatedPerson) return null;

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : ''}`}>
                          {relatedPerson.name}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {rel.type}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNode(relatedPerson.id)}
                      >
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};