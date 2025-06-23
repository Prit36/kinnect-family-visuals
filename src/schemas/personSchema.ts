
/**
 * Zod schema for person form validation
 */

import { z } from 'zod';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS, RELATIONSHIP_TYPE_OPTIONS } from '../constants';

export const personSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  nickname: z.string().max(50, 'Nickname must be less than 50 characters').optional(),
  gender: z.enum(['male', 'female', 'other'] as const),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  birthPlace: z.string().max(100, 'Birth place must be less than 100 characters').optional(),
  occupation: z.string().optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'] as const).optional(),
  isAlive: z.boolean().default(true),
  image: z.string().optional(),
  phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  biography: z.string().optional(),
  selectedPerson: z.string().optional(),
  relationshipType: z.enum(['parent', 'spouse', 'child'] as const).optional(),
}).refine((data) => {
  if (data.birthDate && data.deathDate) {
    return new Date(data.deathDate) > new Date(data.birthDate);
  }
  return true;
}, {
  message: 'Death date must be after birth date',
  path: ['deathDate'],
});

export type PersonFormSchema = z.infer<typeof personSchema>;
