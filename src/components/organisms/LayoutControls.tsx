/**
 * Layout controls component
 */

import React from "react";
import { LayoutSelector } from "../molecules/LayoutSelector";
import { useUIStore } from "../../stores/uiStore";
import { useFamilyTreeStore } from "../../stores/familyTreeStore";
import { LayoutType } from "@/types";

interface LayoutControlsProps {
  className?: string;
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({
  className,
}) => {
  const {
    currentLayout,
    nodeViewMode,
    showStatistics,
    isFullscreen,
    setCurrentLayout,
    setNodeViewMode,
    toggleStatistics,
    toggleFullscreen,
  } = useUIStore();

  const { applyLayout } = useFamilyTreeStore();

  const handleLayoutChange = (layout: LayoutType) => {
    setCurrentLayout(layout);
    applyLayout(layout);
  };

  return (
    <div className={className}>
      <LayoutSelector
        currentLayout={currentLayout}
        nodeViewMode={nodeViewMode}
        showStatistics={showStatistics}
        isFullscreen={isFullscreen}
        onLayoutChange={handleLayoutChange}
        onViewModeChange={setNodeViewMode}
        onToggleStatistics={toggleStatistics}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};
