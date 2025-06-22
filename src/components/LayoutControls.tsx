import React from "react";
import {
  Grid,
  Circle,
  TreePine,
  Shuffle,
  BarChart3,
  Maximize,
  Minimize,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFamilyTreeStore, layoutOptions } from "../store/familyTreeStore";
import DarkModeToggle from "./DarkModeToggle";

const getLayoutIcon = (layout: string) => {
  switch (layout) {
    case "hierarchical":
      return <TreePine size={16} />;
    case "circular":
      return <Circle size={16} />;
    case "grid":
      return <Grid size={16} />;
    case "radial":
      return <Circle size={16} />;
    default:
      return <Shuffle size={16} />;
  }
};

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
  } = useFamilyTreeStore();

  const handleLayoutChange = (value: string) => {
    setLayout(value);
  };

  const handleViewModeChange = (value: string) => {
    setNodeViewMode(value as "normal" | "fullImage");
  };

  const handleFullscreenToggle = () => {
    toggleFullscreen();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Layout:</span>
          <Select value={currentLayout} onValueChange={handleLayoutChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
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

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">View:</span>
          <Select value={nodeViewMode} onValueChange={handleViewModeChange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>Normal</span>
                </div>
              </SelectItem>
              <SelectItem value="fullImage">
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
              variant={showStatistics ? "outline" : "default"}
              size="sm"
              onClick={toggleStatistics}
            >
              <BarChart3 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showStatistics ? "Hide" : "Show"} Statistics</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreenToggle}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFullscreen ? "Exit" : "Enter"} Fullscreen</p>
          </TooltipContent>
        </Tooltip>

        <DarkModeToggle />
      </div>
    </TooltipProvider>
  );
};

export default LayoutControls;
