/**
 * Family tree business logic service
 */

import { Person, Relationship, RelationshipType, Gender, MaritalStatus } from '../types';
import { generateId } from '../utils';

export class FamilyTreeService {
  /**
   * Create a new person with required fields
   */
  static createPerson(data: Omit<Person, 'id'>): Person {
    return {
      id: generateId(),
      name: String(data.name || ''),
      gender: (data.gender as Gender) || 'male',
      isAlive: Boolean(data.isAlive !== undefined ? data.isAlive : true),
      nickname: String(data.nickname || ''),
      birthDate: String(data.birthDate || ''),
      deathDate: String(data.deathDate || ''),
      birthPlace: String(data.birthPlace || ''),
      occupation: String(data.occupation || ''),
      maritalStatus: (data.maritalStatus as MaritalStatus) || undefined,
      image: String(data.image || ''),
      phone: String(data.phone || ''),
      email: String(data.email || ''),
      website: String(data.website || ''),
      biography: String(data.biography || ''),
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
      type,
    };
  }

  /**
   * Get all relationships for a person
   */
  static getPersonRelationships(
    personId: string,
    relationships: Relationship[]
  ): Array<{ type: RelationshipType; relatedPersonId: string }> {
    return relationships
      .filter((rel) => rel.source === personId || rel.target === personId)
      .map((rel) => ({
        type: rel.type,
        relatedPersonId: rel.source === personId ? rel.target : rel.source,
      }));
  }

  /**
   * Filter people based on search criteria
   */
  static filterPeople(
    people: Person[],
    filters: {
      searchTerm?: string;
      gender?: Gender;
      isAlive?: boolean;
      hasImage?: boolean;
    }
  ): Person[] {
    return people.filter((person) => {
      // Search term filter
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matches = 
          person.name.toLowerCase().includes(searchLower) ||
          (person.nickname && person.nickname.toLowerCase().includes(searchLower)) ||
          (person.occupation && person.occupation.toLowerCase().includes(searchLower)) ||
          (person.birthPlace && person.birthPlace.toLowerCase().includes(searchLower));
        
        if (!matches) return false;
      }

      // Gender filter
      if (filters.gender && person.gender !== filters.gender) {
        return false;
      }

      // Alive status filter
      if (filters.isAlive !== undefined && person.isAlive !== filters.isAlive) {
        return false;
      }

      // Image filter
      if (filters.hasImage !== undefined) {
        const hasImage = Boolean(person.image && person.image.trim());
        if (hasImage !== filters.hasImage) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get family statistics
   */
  static getFamilyStatistics(people: Person[]) {
    const total = people.length;
    const living = people.filter((p) => p.isAlive).length;
    const deceased = total - living;
    const male = people.filter((p) => p.gender === 'male').length;
    const female = people.filter((p) => p.gender === 'female').length;
    
    const occupations = new Set(people.filter(p => p.occupation).map(p => p.occupation)).size;
    const averageAge = this.calculateAverageAge(people);

    return {
      total,
      living,
      deceased,
      male,
      female,
      occupations,
      averageAge,
      // Keep the old structure for backward compatibility
      totalMembers: total,
      livingMembers: living,
      deceasedMembers: deceased,
      genderStats: {
        male,
        female,
        other: people.filter((p) => p.gender === 'other').length,
      } as Record<Gender, number>,
      generationStats: this.calculateGenerations(people),
    };
  }

  /**
   * Calculate generation statistics
   */
  private static calculateGenerations(people: Person[]) {
    // This is a simplified calculation
    // In a real implementation, you'd traverse the family tree
    const birthYears = people
      .filter(p => p.birthDate)
      .map(p => new Date(p.birthDate!).getFullYear());

    return {
      totalGenerations: Math.max(1, Math.ceil(people.length / 3)),
      oldestGeneration: birthYears.length > 0 ? Math.min(...birthYears) : null,
      newestGeneration: birthYears.length > 0 ? Math.max(...birthYears) : null,
    };
  }

  /**
   * Calculate average age
   */
  private static calculateAverageAge(people: Person[]): number {
    const peopleWithBirthDates = people.filter((p) => p.birthDate);
    
    if (peopleWithBirthDates.length === 0) return 0;

    const totalAge = peopleWithBirthDates.reduce((sum, person) => {
      const birthYear = new Date(person.birthDate!).getFullYear();
      const endYear = person.deathDate 
        ? new Date(person.deathDate).getFullYear()
        : new Date().getFullYear();
      return sum + (endYear - birthYear);
    }, 0);

    return Math.round(totalAge / peopleWithBirthDates.length);
  }

  /**
   * Find potential relationships
   */
  static findPotentialRelationships(
    people: Person[],
    relationships: Relationship[]
  ): Array<{ person1: Person; person2: Person; suggestedType: RelationshipType }> {
    const suggestions: Array<{ person1: Person; person2: Person; suggestedType: RelationshipType }> = [];
    
    // This is a simplified suggestion algorithm
    // In a real implementation, you'd use more sophisticated logic
    
    return suggestions;
  }

  /**
   * Validate family tree structure
   */
  static validateFamilyTree(
    people: Person[],
    relationships: Relationship[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for orphaned relationships
    relationships.forEach((rel) => {
      const sourcePerson = people.find((p) => p.id === rel.source);
      const targetPerson = people.find((p) => p.id === rel.target);
      
      if (!sourcePerson) {
        errors.push(`Relationship ${rel.id} references non-existent source person ${rel.source}`);
      }
      
      if (!targetPerson) {
        errors.push(`Relationship ${rel.id} references non-existent target person ${rel.target}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
