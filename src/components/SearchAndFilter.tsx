
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
  const { searchFilters, setSearchFilters, getFilteredPeople, darkMode } = useFamilyTreeStore();
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
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} size={16} />
        <Input
          placeholder="Search family members..."
          value={searchFilters.searchTerm}
          onChange={(e) => setSearchFilters({ searchTerm: e.target.value })}
          className={`pl-10 ${darkMode ? 'bg-gray-800/50 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white/80 backdrop-blur-sm'}`}
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`relative ${darkMode ? 'bg-gray-800/50 border-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-200'}`}
          >
            <Filter size={16} className="mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                !
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className={darkMode ? 'bg-gray-800 border-gray-600' : ''}>
          <SheetHeader>
            <SheetTitle className={darkMode ? 'text-gray-200' : ''}>Filter Family Members</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {hasActiveFilters && (
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Showing {filteredCount} members
                </span>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <X size={14} className="mr-1" />
                  Clear All
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="gender-filter" className={darkMode ? 'text-gray-200' : ''}>Gender</Label>
              <Select 
                value={searchFilters.gender || ''} 
                onValueChange={(value) => setSearchFilters({ gender: (value as 'male' | 'female' | 'other') || undefined })}
              >
                <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : ''}>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent className={darkMode ? 'bg-gray-800 border-gray-600' : ''}>
                  <SelectItem value="">All genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className={darkMode ? 'text-gray-200' : ''}>Status</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alive-filter"
                    checked={searchFilters.isAlive === true}
                    onCheckedChange={(checked) => 
                      setSearchFilters({ isAlive: checked ? true : undefined })
                    }
                  />
                  <Label htmlFor="alive-filter" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Living only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="deceased-filter"
                    checked={searchFilters.isAlive === false}
                    onCheckedChange={(checked) => 
                      setSearchFilters({ isAlive: checked ? false : undefined })
                    }
                  />
                  <Label htmlFor="deceased-filter" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Deceased only</Label>
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
                <Label htmlFor="photo-filter" className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Has photo only</Label>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchAndFilter;
