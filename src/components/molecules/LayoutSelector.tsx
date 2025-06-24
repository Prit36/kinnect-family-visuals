/**
 * Layout selector component
 */

import React from "react";
import {
  Grid,
  Circle,
  TreePine,
  Shuffle,
  Eye,
  Maximize,
  Minimize,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconButton } from "../atoms/IconButton";
import { LayoutType, NodeViewMode } from "../../types";
import { LAYOUT_OPTIONS } from "../../constants";

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  nodeViewMode: NodeViewMode;
  showStatistics: boolean;
  isFullscreen: boolean;
  onLayoutChange: (layout: LayoutType) => void;
  onViewModeChange: (mode: NodeViewMode) => void;
  onToggleStatistics: () => void;
  onToggleFullscreen: () => void;
}

const getLayoutIcon = (layout: LayoutType) => {
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

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  currentLayout,
  nodeViewMode,
  showStatistics,
  isFullscreen,
  onLayoutChange,
  onViewModeChange,
  onToggleStatistics,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Layout:</span>
        <Select value={currentLayout} onValueChange={onLayoutChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LAYOUT_OPTIONS.map((option) => (
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
        <Select value={nodeViewMode} onValueChange={onViewModeChange}>
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

      <IconButton
        icon={<BarChart3 size={16} />}
        onClick={onToggleStatistics}
        tooltip={showStatistics ? "Hide Statistics" : "Show Statistics"}
        variant={showStatistics ? "default" : "outline"}
      />

      <IconButton
        icon={isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        onClick={onToggleFullscreen}
        tooltip={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        variant="outline"
      />
    </div>
  );
};
