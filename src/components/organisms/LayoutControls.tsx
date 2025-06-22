/**
 * Layout controls component
 */

import React from 'react';
import { LayoutSelector } from '../molecules/LayoutSelector';
import { useLayout } from '../../hooks/useLayout';

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
    setLayout,
    setViewMode,
    toggleStatistics,
    toggleFullscreen,
  } = useLayout();

  return (
    <div className={className}>
      <LayoutSelector
        currentLayout={currentLayout}
        nodeViewMode={nodeViewMode}
        showStatistics={showStatistics}
        isFullscreen={isFullscreen}
        onLayoutChange={setLayout}
        onViewModeChange={setViewMode}
        onToggleStatistics={toggleStatistics}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};