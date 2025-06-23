
/**
 * Person form component for adding/editing family members
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { User, Calendar, MapPin, Briefcase, Phone, Mail, Globe } from 'lucide-react';
import { FormField } from '../molecules/FormField';
import { ImageUpload } from '../molecules/ImageUpload';
import { usePersonForm } from '../../hooks/usePersonForm';
import { useFamilyTree } from '../../hooks/useFamilyTree';
import type { PersonFormData, RelationshipType, Gender, MaritalStatus } from '../../types';
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS, RELATIONSHIP_TYPE_OPTIONS } from '../../constants';

interface PersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<PersonFormData>;
  mode?: 'add' | 'edit';
}

export const PersonForm: React.FC<PersonFormProps> = ({
  isOpen,
  onClose,
  initialData,
  mode = 'add',
}) => {
  const { people, addPerson, updatePerson } = useFamilyTree();

  const handleSubmit = async (data: PersonFormData) => {
    if (mode === 'add') {
      const relationshipData = data.selectedPerson && data.relationshipType
        ? { personId: data.selectedPerson, type: data.relationshipType }
        : undefined;

      await addPerson(data, relationshipData);
    } else if (initialData?.id) {
      await updatePerson(initialData.id, data);
    }
    
    onClose();
  };

  const {
    formData,
    errors,
    isSubmitting,
    imagePreview,
    updateField,
    handleImageUpload,
    handleImageUrlChange,
    handleSubmit: onSubmit,
    handleCancel,
    genderOptions,
    maritalStatusOptions,
  } = usePersonForm({
    initialData,
    onSubmit: handleSubmit,
    onCancel: onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {mode === 'add' ? 'Add Family Member' : 'Edit Family Member'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <form onSubmit={onSubmit} className="space-y-4">
            <TabsContent value="basic" className="space-y-4">
              <FormField label="Full Name" required error={errors[0]}>
                <Input
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField label="Nickname">
                <Input
                  value={formData.nickname}
                  onChange={(e) => updateField('nickname', e.target.value)}
                  placeholder="Enter nickname (optional)"
                />
              </FormField>

              <ImageUpload
                value={formData.image}
                onChange={(value) => updateField('image', value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Gender">
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateField('gender', value as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Marital Status">
                  <Select
                    value={formData.maritalStatus || ''}
                    onValueChange={(value) => updateField('maritalStatus', value as MaritalStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {mode === 'add' && people.length > 0 && (
                <>
                  <FormField label="Connect to existing person">
                    <Select
                      value={formData.selectedPerson}
                      onValueChange={(value) => updateField('selectedPerson', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select person (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  {formData.selectedPerson && (
                    <FormField label="Relationship">
                      <Select
                        value={formData.relationshipType || ''}
                        onValueChange={(value) => updateField('relationshipType', value as RelationshipType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIP_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  checked={formData.isAlive}
                  onCheckedChange={(checked) => updateField('isAlive', checked)}
                />
                <label className="text-sm font-medium">Person is alive</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Birth Date">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateField('birthDate', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                {!formData.isAlive && (
                  <FormField label="Death Date">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        value={formData.deathDate}
                        onChange={(e) => updateField('deathDate', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </FormField>
                )}
              </div>

              <FormField label="Birth Place">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={formData.birthPlace}
                    onChange={(e) => updateField('birthPlace', e.target.value)}
                    placeholder="City, Country"
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Occupation">
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={formData.occupation}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    placeholder="Job title or profession"
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Biography">
                <Textarea
                  value={formData.biography}
                  onChange={(e) => updateField('biography', e.target.value)}
                  placeholder="Tell their story..."
                  rows={4}
                />
              </FormField>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <FormField label="Phone Number">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Email Address">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="email@example.com"
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Website">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://example.com"
                    className="pl-10"
                  />
                </div>
              </FormField>
            </TabsContent>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Person' : 'Update Person'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
