
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFamilyTreeStore } from '../store/familyTreeStore';

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useFamilyTreeStore();

  const handleToggle = () => {
    toggleDarkMode();
    // Save to localStorage
    localStorage.setItem('family-tree-dark-mode', (!darkMode).toString());
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            className="dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle {darkMode ? 'Light' : 'Dark'} Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DarkModeToggle;
