
import React from 'react';
import { Grid, Circle, TreePine, Shuffle, BarChart3, Maximize, Minimize, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFamilyTreeStore, layoutOptions } from '../store/familyTreeStore';
import DarkModeToggle from './DarkModeToggle';

const LayoutControls: React.FC = () => {
  const { 
    currentLayout, 
    setLayout, 
    showStatistics, 
    toggleStatistics, 
    isFullscreen, 
    toggleFullscreen,
    nodeViewMode,
    setNodeViewMode,
    darkMode 
  } = useFamilyTreeStore();

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'hierarchical': return <TreePine size={16} />;
      case 'circular': return <Circle size={16} />;
      case 'grid': return <Grid size={16} />;
      case 'radial': return <Circle size={16} />;
      default: return <Shuffle size={16} />;
    }
  };

  const handleLayoutChange = (value: string) => {
    console.log('Layout changing to:', value);
    setLayout(value);
  };

  const handleViewModeChange = (value: string) => {
    console.log('View mode changing to:', value);
    setNodeViewMode(value as 'normal' | 'fullImage');
  };

  const handleFullscreenToggle = () => {
    console.log('Toggling fullscreen, current state:', isFullscreen);
    toggleFullscreen();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Layout:</span>
          <Select value={currentLayout} onValueChange={handleLayoutChange}>
            <SelectTrigger className={`w-40 ${darkMode ? 'border-gray-600 bg-gray-800/50 text-gray-200' : 'bg-white/80 backdrop-blur-sm'}`}>
              <div className="flex items-center space-x-2">
                {getLayoutIcon(currentLayout)}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className={darkMode ? 'bg-gray-800 border-gray-600' : ''}>
              {layoutOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className={darkMode ? 'text-gray-200 hover:bg-gray-700 focus:bg-gray-700' : ''}
                >
                  <div className="flex items-center space-x-2">
                    {getLayoutIcon(option.value)}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>View:</span>
          <Select value={nodeViewMode} onValueChange={handleViewModeChange}>
            <SelectTrigger className={`w-32 ${darkMode ? 'border-gray-600 bg-gray-800/50 text-gray-200' : 'bg-white/80 backdrop-blur-sm'}`}>
              <div className="flex items-center space-x-2">
                <Eye size={16} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className={darkMode ? 'bg-gray-800 border-gray-600' : ''}>
              <SelectItem 
                value="normal"
                className={darkMode ? 'text-gray-200 hover:bg-gray-700 focus:bg-gray-700' : ''}
              >
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>Normal</span>
                </div>
              </SelectItem>
              <SelectItem 
                value="fullImage"
                className={darkMode ? 'text-gray-200 hover:bg-gray-700 focus:bg-gray-700' : ''}
              >
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>Full Image</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showStatistics ? "default" : "outline"}
              size="sm"
              onClick={toggleStatistics}
              className={darkMode ? 'border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700' : 'bg-white/80 backdrop-blur-sm'}
            >
              <BarChart3 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showStatistics ? 'Hide' : 'Show'} Statistics</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreenToggle}
              className={darkMode ? 'border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-gray-700' : 'bg-white/80 backdrop-blur-sm'}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFullscreen ? 'Exit' : 'Enter'} Fullscreen</p>
          </TooltipContent>
        </Tooltip>

        <DarkModeToggle />
      </div>
    </TooltipProvider>
  );
};

export default LayoutControls;
