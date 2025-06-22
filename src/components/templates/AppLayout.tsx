/**
 * Main application layout template
 */

import React from 'react';
import { TreePine } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useFamilyTree } from '../../hooks/useFamilyTree';

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
  const { isFullscreen } = useFamilyTree();

  const containerClass = isFullscreen
    ? `fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'}`
    : `min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`;

  return (
    <div className={`${containerClass} ${className}`}>
      {!isFullscreen && header && (
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-lg sticky top-0 z-40`}>
          {header}
        </header>
      )}
      
      <div className="flex flex-1">
        {!isFullscreen && sidebar && (
          <aside className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
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