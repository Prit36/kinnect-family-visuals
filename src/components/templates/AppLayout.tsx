
/**
 * Main application layout template
 */

import React from 'react';
import { TreePine } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUIStore } from '../../stores/uiStore';

interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  header,
  sidebar,
  className,
}) => {
  const { darkMode } = useTheme();
  const { isFullscreen } = useUIStore();

  const containerClass = isFullscreen
    ? `fixed inset-0 z-50 bg-white dark:bg-gray-900`
    : `min-h-screen flex flex-col bg-white dark:bg-gray-900`;

  return (
    <div className={`${containerClass} ${className}`}>
      {!isFullscreen && header && (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 z-40">
          {header}
        </header>
      )}
      
      <div className="flex flex-1">
        {!isFullscreen && sidebar && (
          <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 flex flex-col relative">
          {children}
        </main>
      </div>
    </div>
  );
};
