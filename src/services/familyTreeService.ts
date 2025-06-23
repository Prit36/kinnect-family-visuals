
/**
 * Family tree business logic service
 */

import { Person, Relationship, RelationshipType, Gender } from '../types';
import { generateId } from '../utils';

export class FamilyTreeService {
  /**
   * Create a new person with required fields
   */
  static createPerson(data: Omit<Person, 'id'>): Person {
    return {
      id: generateId(),
      name: data.name || '',
      gender: data.gender || 'male',
      isAlive: data.isAlive !== undefined ? data.isAlive : true,
      nickname: data.nickname,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      birthPlace: data.birthPlace,
      occupation: data.occupation,
      maritalStatus: data.maritalStatus,
      image: data.image,
      phone: data.phone,
      email: data.email,
      website: data.website,
      biography: data.biography,
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
   * Get family statistics
   */
  static getFamilyStatistics(people: Person[]) {
    const totalMembers = people.length;
    const livingMembers = people.filter((p) => p.isAlive).length;
    const deceasedMembers = totalMembers - livingMembers;
    
    const genderStats = people.reduce(
      (acc, person) => {
        acc[person.gender] = (acc[person.gender] || 0) + 1;
        return acc;
      },
      {} as Record<Gender, number>
    );

    const generationStats = this.calculateGenerations(people);
    const averageAge = this.calculateAverageAge(people);

    return {
      totalMembers,
      livingMembers,
      deceasedMembers,
      genderStats,
      generationStats,
      averageAge,
    };
  }

  /**
   * Calculate generation statistics
   */
  private static calculateGenerations(people: Person[]) {
    // This is a simplified calculation
    // In a real implementation, you'd traverse the family tree
    return {
      totalGenerations: Math.max(1, Math.ceil(people.length / 3)),
      oldestGeneration: people.filter((p) => p.birthDate).length > 0 
        ? Math.min(...people.filter(p => p.birthDate).map(p => new Date(p.birthDate!).getFullYear()))
        : null,
      newestGeneration: people.filter((p) => p.birthDate).length > 0
        ? Math.max(...people.filter(p => p.birthDate).map(p => new Date(p.birthDate!).getFullYear()))
        : null,
    };
  }

  /**
   * Calculate average age
   */
  private static calculateAverageAge(people: Person[]): number | null {
    const peopleWithBirthDates = people.filter((p) => p.birthDate);
    
    if (peopleWithBirthDates.length === 0) return null;

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
