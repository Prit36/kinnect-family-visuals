
import React, { useState, useRef } from 'react';
import { X, Upload, User } from 'lucide-react';
import { useFamilyTreeStore, relationshipTypes } from '../store/familyTreeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [relationshipType, setRelationshipType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { people, addPerson, addRelationship } = useFamilyTreeStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    const personId = addPerson({
      name: name.trim(),
      image: imageUrl || undefined,
      gender: gender || undefined,
    });

    // Add relationship if both person and relationship type are selected
    if (selectedPerson && relationshipType) {
      addRelationship(selectedPerson, personId, relationshipType);
    }

    // Reset form
    setName('');
    setImageUrl('');
    setImagePreview('');
    setGender('');
    setSelectedPerson('');
    setRelationshipType('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setImageUrl('');
    setImagePreview('');
    setGender('');
    setSelectedPerson('');
    setRelationshipType('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImagePreview('');
                      setImageUrl('');
                    }}
                  />
                ) : (
                  <User size={24} className="text-gray-500" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Image
                </Button>
                <Input
                  placeholder="Or enter image URL"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="text-sm"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {people.length > 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="person">Connect to existing person</Label>
                <Select value={selectedPerson} onValueChange={setSelectedPerson}>
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
              </div>

              {selectedPerson && (
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select value={relationshipType} onValueChange={setRelationshipType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Person</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonModal;
