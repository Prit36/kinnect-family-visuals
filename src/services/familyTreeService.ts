/**
 * Family tree business logic service
 */

import { Person, Relationship, RelationshipType } from '../types';
import { generateId } from '../utils';

export class FamilyTreeService {
  /**
   * Create a new person
   */
  static createPerson(personData: Omit<Person, 'id'>): Person {
    return {
      id: generateId(),
      ...personData
    };
  }

  /**
   * Create a new relationship
   */
  static createRelationship(
    source: string,
    target: string,
    type: RelationshipType
  ): Relationship {
    return {
      id: generateId(),
      source,
      target,
      type
    };
  }

  /**
   * Find all relationships for a person
   */
  static getPersonRelationships(
    personId: string,
    relationships: Relationship[]
  ): Array<{ type: RelationshipType; relatedPersonId: string }> {
    return relationships
      .filter(rel => rel.source === personId || rel.target === personId)
      .map(rel => ({
        type: rel.type,
        relatedPersonId: rel.source === personId ? rel.target : rel.source
      }));
  }

  /**
   * Find family members by relationship type
   */
  static getFamilyMembersByType(
    personId: string,
    type: RelationshipType,
    relationships: Relationship[],
    people: Person[]
  ): Person[] {
    const relatedIds = relationships
      .filter(rel => 
        (rel.source === personId || rel.target === personId) && rel.type === type
      )
      .map(rel => rel.source === personId ? rel.target : rel.source);

    return people.filter(person => relatedIds.includes(person.id));
  }

  /**
   * Check if two people are related
   */
  static areRelated(
    person1Id: string,
    person2Id: string,
    relationships: Relationship[]
  ): boolean {
    return relationships.some(rel =>
      (rel.source === person1Id && rel.target === person2Id) ||
      (rel.source === person2Id && rel.target === person1Id)
    );
  }

  /**
   * Get family statistics
   */
  static getFamilyStatistics(people: Person[]) {
    const living = people.filter(p => p.isAlive);
    const deceased = people.filter(p => !p.isAlive);
    const withImages = people.filter(p => p.image);
    const married = people.filter(p => p.maritalStatus === 'married');
    const occupations = new Set(people.filter(p => p.occupation).map(p => p.occupation));

    // Calculate age statistics for living members
    const livingWithBirthDates = living.filter(p => p.birthDate);
    const ages = livingWithBirthDates.map(p => {
      const birthYear = new Date(p.birthDate!).getFullYear();
      return new Date().getFullYear() - birthYear;
    });

    const averageAge = ages.length > 0 
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) 
      : 0;
    const oldestAge = ages.length > 0 ? Math.max(...ages) : 0;

    return {
      total: people.length,
      living: living.length,
      deceased: deceased.length,
      male: people.filter(p => p.gender === 'male').length,
      female: people.filter(p => p.gender === 'female').length,
      withImages: withImages.length,
      married: married.length,
      occupations: occupations.size,
      averageAge,
      oldestAge
    };
  }

  /**
   * Filter people based on search criteria
   */
  static filterPeople(
    people: Person[],
    filters: {
      searchTerm?: string;
      gender?: string;
      isAlive?: boolean;
      hasImage?: boolean;
    }
  ): Person[] {
    return people.filter(person => {
      const matchesSearch = !filters.searchTerm || 
        person.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        person.nickname?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        person.occupation?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesGender = !filters.gender || person.gender === filters.gender;
      const matchesAlive = filters.isAlive === undefined || person.isAlive === filters.isAlive;
      const matchesImage = filters.hasImage === undefined || !!person.image === filters.hasImage;
      
      return matchesSearch && matchesGender && matchesAlive && matchesImage;
    });
  }

  /**
   * Validate person data
   */
  static validatePerson(person: Partial<Person>): string[] {
    const errors: string[] = [];

    if (!person.name?.trim()) {
      errors.push('Name is required');
    }

    if (person.birthDate && person.deathDate) {
      const birthDate = new Date(person.birthDate);
      const deathDate = new Date(person.deathDate);
      if (birthDate > deathDate) {
        errors.push('Birth date cannot be after death date');
      }
    }

    if (person.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
      errors.push('Invalid email format');
    }

    if (person.website && !/^https?:\/\/.+/.test(person.website)) {
      errors.push('Invalid website URL');
    }

    return errors;
  }
}