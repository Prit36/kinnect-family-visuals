/**
 * Main family tree page component
 */

import React, { useEffect, useState } from 'react';
import { Plus, TreePine, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '../templates/AppLayout';
import { FamilyTreeVisualization } from '../organisms/FamilyTreeVisualization';
import { PersonForm } from '../organisms/PersonForm';
import { SearchAndFilters } from '../organisms/SearchAndFilters';
import { StatisticsPanel } from '../organisms/StatisticsPanel';
import { ExportImportControls } from '../organisms/ExportImportControls';
import { LayoutControls } from '../organisms/LayoutControls';
import { PersonDetailPanel } from '../organisms/PersonDetailPanel';
import { useFamilyTree } from '../../hooks/useFamilyTree';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../hooks/use-toast';
import { extractSharedDataFromUrl, cleanUrl } from '../../utils';
import { SUCCESS_MESSAGES } from '../../constants';

export const FamilyTreePage: React.FC = () => {
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const {
    people,
    selectedNodeId,
    showStatistics,
    isFullscreen,
    importData,
  } = useFamilyTree();
  
  const { darkMode } = useTheme();
  const { toast } = useToast();

  // Check for shared data in URL
  useEffect(() => {
    const sharedData = extractSharedDataFromUrl();
    if (sharedData) {
      try {
        const decodedData = decodeURIComponent(sharedData);
        const parsedData = JSON.parse(decodedData);
        importData(parsedData.people, parsedData.relationships);
        
        toast({
          title: "Loaded Shared Tree",
          description: SUCCESS_MESSAGES.DATA_IMPORTED,
        });
        
        cleanUrl();
      } catch (error) {
        console.error('Failed to load shared data:', error);
        toast({
          title: "Import Failed",
          description: "Failed to load shared family tree data",
          variant: "destructive",
        });
      }
    }
  }, [importData, toast]);

  const renderHeader = () => (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="relative">
            <TreePine className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Family Tree Visualizer
            </h1>
            {people.length > 0 && (
              <div className="flex items-center space-x-4 mt-1">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-semibold text-blue-500">{people.length}</span>{' '}
                  member{people.length !== 1 ? 's' : ''} •
                  <span className="font-semibold text-green-500 ml-1">
                    {people.filter((p) => p.isAlive).length}
                  </span>{' '}
                  living
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {people.length > 0 && (
            <>
              <SearchAndFilters />
              <LayoutControls />
              <ExportImportControls />
            </>
          )}

          <Button
            onClick={() => setIsAddPersonModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-2.5"
          >
            <Plus size={18} className="mr-2" />
            Add Person
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center max-w-2xl px-6 m-auto">
      <div className="relative mb-8">
        <TreePine
          className={`w-32 h-32 mx-auto relative ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
      </div>
      <h2 className={`text-5xl font-bold mb-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
        Build Your Family Tree
      </h2>
      <p className={`text-xl mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Create a beautiful, interactive digital family tree with rich profiles, stunning
        visualizations, and detailed family connections. Preserve your family's legacy with
        modern design and intuitive features.
      </p>
      <Button
        onClick={() => setIsAddPersonModalOpen(true)}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 px-8 py-4 text-lg rounded-2xl"
      >
        <Plus size={24} className="mr-3" />
        Add Your First Family Member
      </Button>
      <div className={`mt-10 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} space-y-2`}>
        <p className="font-semibold text-lg mb-4">✨ Amazing Features:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
          {[
            { color: 'blue', text: 'Beautiful animated profiles with photos' },
            { color: 'green', text: 'Interactive drag & drop interface' },
            { color: 'pink', text: 'Multiple layout options & themes' },
            { color: 'purple', text: 'Advanced search & filtering' },
            { color: 'yellow', text: 'Export & share your family tree' },
            { color: 'teal', text: 'Dark mode for comfortable viewing' },
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className={`w-2 h-2 bg-${feature.color}-500 rounded-full`}></span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuickGuide = () => (
    <div
      className={`fixed bottom-4 left-16 rounded-2xl shadow-xl p-6 max-w-sm z-10 border transition-all duration-300 hover:shadow-2xl ${
        darkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-200'
      }`}
    >
      <h3 className={`font-bold text-lg mb-4 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        <Settings size={20} className="mr-2 text-blue-500" />
        Quick Guide
      </h3>
      <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {[
          { color: 'blue', action: 'Click', description: 'nodes to view detailed information' },
          { color: 'green', action: 'Drag', description: 'nodes to reposition them' },
          { color: 'purple', action: 'Search', description: 'and filter family members' },
          { color: 'pink', action: 'Change layouts', description: 'for different views' },
          { color: 'yellow', action: 'Export/Import', description: 'your family data' },
        ].map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className={`w-2 h-2 bg-${item.color}-500 rounded-full`}></span>
            <span>
              <strong>{item.action}</strong> {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <AppLayout header={renderHeader()}>
      {/* Statistics Panel */}
      {showStatistics && people.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <StatisticsPanel />
        </div>
      )}

      {/* Main Content */}
      {people.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className={isFullscreen ? 'h-screen' : 'h-[calc(100vh-5rem)]'}>
          <FamilyTreeVisualization />
        </div>
      )}

      {/* Person Detail Panel */}
      {selectedNodeId && <PersonDetailPanel />}

      {/* Quick Guide */}
      {people.length > 0 && !isFullscreen && !selectedNodeId && renderQuickGuide()}

      {/* Person Form Modal */}
      <PersonForm
        isOpen={isAddPersonModalOpen}
        onClose={() => setIsAddPersonModalOpen(false)}
        mode="add"
      />
    </AppLayout>
  );
};
