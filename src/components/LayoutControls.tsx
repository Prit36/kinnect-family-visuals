
import React from 'react';
import { Grid, Circle, TreePine, Shuffle, BarChart3, Maximize, Minimize } from 'lucide-react';
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

const LayoutControls: React.FC = () => {
  const { 
    currentLayout, 
    setLayout, 
    showStatistics, 
    toggleStatistics, 
    isFullscreen, 
    toggleFullscreen 
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

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Layout:</span>
          <Select value={currentLayout} onValueChange={setLayout}>
            <SelectTrigger className="w-40">
              <div className="flex items-center space-x-2">
                {getLayoutIcon(currentLayout)}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {layoutOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    {getLayoutIcon(option.value)}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showStatistics ? "default" : "outline"}
              size="sm"
              onClick={toggleStatistics}
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
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFullscreen ? 'Exit' : 'Enter'} Fullscreen</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default LayoutControls;
