
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useFamilyTreeStore } from '../store/familyTreeStore';

const SearchAndFilter: React.FC = () => {
  const { searchFilters, setSearchFilters, getFilteredPeople } = useFamilyTreeStore();
  const filteredCount = getFilteredPeople().length;
  
  const hasActiveFilters = searchFilters.gender || 
    searchFilters.isAlive !== undefined || 
    searchFilters.hasImage !== undefined ||
    searchFilters.searchTerm;

  const clearAllFilters = () => {
    setSearchFilters({
      searchTerm: '',
      gender: undefined,
      isAlive: undefined,
      hasImage: undefined,
      ageRange: undefined,
      birthYear: undefined,
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search family members..."
          value={searchFilters.searchTerm}
          onChange={(e) => setSearchFilters({ searchTerm: e.target.value })}
          className="pl-10"
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter size={16} className="mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                !
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Family Members</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {hasActiveFilters && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {filteredCount} members
                </span>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <X size={14} className="mr-1" />
                  Clear All
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="gender-filter">Gender</Label>
              <Select 
                value={searchFilters.gender || ''} 
                onValueChange={(value) => setSearchFilters({ gender: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Status</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alive-filter"
                    checked={searchFilters.isAlive === true}
                    onCheckedChange={(checked) => 
                      setSearchFilters({ isAlive: checked ? true : undefined })
                    }
                  />
                  <Label htmlFor="alive-filter" className="text-sm">Living only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="deceased-filter"
                    checked={searchFilters.isAlive === false}
                    onCheckedChange={(checked) => 
                      setSearchFilters({ isAlive: checked ? false : undefined })
                    }
                  />
                  <Label htmlFor="deceased-filter" className="text-sm">Deceased only</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="photo-filter"
                  checked={searchFilters.hasImage === true}
                  onCheckedChange={(checked) => 
                    setSearchFilters({ hasImage: checked ? true : undefined })
                  }
                />
                <Label htmlFor="photo-filter" className="text-sm">Has photo only</Label>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchAndFilter;
