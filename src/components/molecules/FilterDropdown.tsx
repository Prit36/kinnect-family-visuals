/**
 * Filter dropdown component for search filters
 */

import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { IconButton } from '../atoms/IconButton';
import { Gender } from '../../types';
import { GENDER_OPTIONS } from '../../constants';

interface FilterDropdownProps {
  gender?: Gender;
  isAlive?: boolean;
  hasImage?: boolean;
  onGenderChange: (gender?: Gender) => void;
  onAliveChange: (isAlive?: boolean) => void;
  onImageChange: (hasImage?: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  gender,
  isAlive,
  hasImage,
  onGenderChange,
  onAliveChange,
  onImageChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter size={16} className="mr-2" />
          Filters
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filters</h4>
            {hasActiveFilters && (
              <IconButton
                icon={<X size={14} />}
                onClick={onClearFilters}
                size="sm"
                variant="ghost"
              />
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm">Gender</Label>
              <Select
                value={gender || 'all'}
                onValueChange={(value) =>
                  onGenderChange(value === 'all' ? undefined : (value as Gender))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genders</SelectItem>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Status</Label>
              <Select
                value={
                  isAlive === undefined ? 'all' : isAlive.toString()
                }
                onValueChange={(value) =>
                  onAliveChange(value === 'all' ? undefined : value === 'true')
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All members</SelectItem>
                  <SelectItem value="true">Living</SelectItem>
                  <SelectItem value="false">Deceased</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Has Profile Picture</Label>
              <Switch
                checked={hasImage === true}
                onCheckedChange={(checked) =>
                  onImageChange(checked ? true : undefined)
                }
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};