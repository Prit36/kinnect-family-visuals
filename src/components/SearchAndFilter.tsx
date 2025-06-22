
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFamilyTreeStore } from '../store/familyTreeStore';

const SearchAndFilter: React.FC = () => {
  const { searchFilters, setSearchFilters, darkMode } = useFamilyTreeStore();

  const updateFilters = (updates: Partial<typeof searchFilters>) => {
    setSearchFilters(updates);
  };

  const clearFilters = () => {
    setSearchFilters({
      searchTerm: '',
      gender: undefined,
      isAlive: undefined,
      hasImage: undefined,
    });
  };

  const hasActiveFilters = searchFilters.searchTerm || 
    searchFilters.gender || 
    searchFilters.isAlive !== undefined || 
    searchFilters.hasImage !== undefined;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search family members..."
          value={searchFilters.searchTerm}
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          className={`pl-10 w-64 ${darkMode ? 'border-gray-600 bg-gray-800/50 text-gray-200' : 'bg-white/80 backdrop-blur-sm'}`}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`relative ${darkMode ? 'border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700' : 'bg-white/80 backdrop-blur-sm'}`}
          >
            <Filter size={16} className="mr-2" />
            Filters
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-600' : ''}`} align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : ''}`}>Filters</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-1"
                >
                  <X size={14} />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Gender</Label>
                <Select
                  value={searchFilters.gender || ''}
                  onValueChange={(value) => updateFilters({ gender: value || undefined })}
                >
                  <SelectTrigger className={`mt-1 ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : ''}`}>
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

              <div>
                <Label className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Status</Label>
                <Select
                  value={searchFilters.isAlive === undefined ? '' : searchFilters.isAlive.toString()}
                  onValueChange={(value) => 
                    updateFilters({ 
                      isAlive: value === '' ? undefined : value === 'true'
                    })
                  }
                >
                  <SelectTrigger className={`mt-1 ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : ''}`}>
                    <SelectValue placeholder="All members" />
                  </SelectTrigger>
                  <SelectContent className={darkMode ? 'bg-gray-800 border-gray-600' : ''}>
                    <SelectItem value="">All members</SelectItem>
                    <SelectItem value="true">Living</SelectItem>
                    <SelectItem value="false">Deceased</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Has Profile Picture</Label>
                <Switch
                  checked={searchFilters.hasImage === true}
                  onCheckedChange={(checked) => 
                    updateFilters({ 
                      hasImage: checked ? true : undefined
                    })
                  }
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchAndFilter;
