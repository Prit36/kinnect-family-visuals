
import React, { useState, useRef } from 'react';
import { X, Upload, User, Calendar, MapPin, Briefcase, Heart, Phone, Mail, Globe } from 'lucide-react';
import { useFamilyTreeStore, relationshipTypes } from '../store/familyTreeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

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
  
  // Extended personal information
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [occupation, setOccupation] = useState('');
  const [biography, setBiography] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [isAlive, setIsAlive] = useState(true);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [nickname, setNickname] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { people, addPerson, addRelationship } = useFamilyTreeStore();
  const { toast } = useToast();

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

  const calculateAge = (birthDate: string, deathDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    if (birthDate && deathDate && new Date(birthDate) > new Date(deathDate)) {
      toast({
        title: "Validation Error",
        description: "Birth date cannot be after death date",
        variant: "destructive",
      });
      return;
    }

    const age = calculateAge(birthDate, isAlive ? undefined : deathDate);

    const personId = addPerson({
      name: name.trim(),
      image: imageUrl || undefined,
      gender: gender || undefined,
      birthDate: birthDate || undefined,
      deathDate: isAlive ? undefined : deathDate || undefined,
      birthPlace: birthPlace.trim() || undefined,
      occupation: occupation.trim() || undefined,
      biography: biography.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      website: website.trim() || undefined,
      isAlive,
      maritalStatus: maritalStatus || undefined,
      nickname: nickname.trim() || undefined,
      age,
    });

    if (selectedPerson && relationshipType) {
      addRelationship(selectedPerson, personId, relationshipType);
    }

    toast({
      title: "Success",
      description: `${name} has been added to the family tree`,
    });

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setImageUrl('');
    setImagePreview('');
    setGender('');
    setSelectedPerson('');
    setRelationshipType('');
    setBirthDate('');
    setDeathDate('');
    setBirthPlace('');
    setOccupation('');
    setBiography('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setIsAlive(true);
    setMaritalStatus('');
    setNickname('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Add Family Member
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter nickname (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 overflow-hidden">
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
                      <User size={32} className="text-gray-500" />
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={(value: 'male' | 'female' | 'other' | '') => setGender(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                      <SelectItem value="separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="isAlive"
                  checked={isAlive}
                  onChange={(e) => setIsAlive(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isAlive">Person is alive</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Birth Date
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>

                {!isAlive && (
                  <div className="space-y-2">
                    <Label htmlFor="deathDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Death Date
                    </Label>
                    <Input
                      id="deathDate"
                      type="date"
                      value={deathDate}
                      onChange={(e) => setDeathDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthPlace" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Birth Place
                </Label>
                <Input
                  id="birthPlace"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Occupation
                </Label>
                <Input
                  id="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Job title or profession"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography">Biography</Label>
                <Textarea
                  id="biography"
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Tell their story..."
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </TabsContent>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Add Person</Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonModal;
