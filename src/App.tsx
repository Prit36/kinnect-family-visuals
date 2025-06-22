/**
 * Main App component with providers and error boundary
 */

import React from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/templates/ErrorBoundary';
import { FamilyTreePage } from './components/pages/FamilyTreePage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <FamilyTreePage />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;