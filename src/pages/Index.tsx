
import React, { useState, useEffect } from 'react';
import { Plus, Users, TreePine, Search, Settings } from 'lucide-react';
import FamilyTree from '../components/FamilyTree';
import AddPersonModal from '../components/AddPersonModal';
import PersonDetailPanel from '../components/PersonDetailPanel';
import SearchAndFilter from '../components/SearchAndFilter';
import StatisticsPanel from '../components/StatisticsPanel';
import LayoutControls from '../components/LayoutControls';
import ExportImport from '../components/ExportImport';
import { useFamilyTreeStore } from '../store/familyTreeStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    people, 
    selectedNodeId, 
    showStatistics, 
    isFullscreen,
    darkMode,
    importData 
  } = useFamilyTreeStore();
  const { toast } = useToast();

  // Check for shared data in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData) {
      try {
        const decodedData = decodeURIComponent(sharedData);
        importData(decodedData);
        toast({
          title: "Loaded Shared Tree",
          description: "Family tree has been loaded from shared link",
        });
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Failed to load shared data:', error);
      }
    }
  }, [importData, toast]);

  const containerClass = isFullscreen 
    ? `fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}` 
    : `min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`;

  const headerClass = darkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <div className={containerClass}>
      {/* Header */}
      <header className={`${headerClass} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <TreePine className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div className="absolute -inset-1 bg-green-600/20 dark:bg-green-400/20 rounded-full blur animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Family Tree Visualizer
                </h1>
                {people.length > 0 && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {people.length} member{people.length !== 1 ? 's' : ''} • {people.filter(p => p.isAlive).length} living
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {people.length > 0 && (
                <>
                  <SearchAndFilter />
                  <LayoutControls />
                  <ExportImport />
                </>
              )}
              
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus size={16} className="mr-2" />
                Add Person
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Panel */}
      {showStatistics && people.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <StatisticsPanel />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        {people.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="relative mb-6">
                <TreePine className={`w-24 h-24 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                </div>
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Build Your Family Tree
              </h2>
              <p className={`mb-8 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Create a comprehensive digital family tree with photos, relationships, 
                and detailed information about your family members. Connect generations 
                and preserve your family's story.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Family Member
              </Button>
              <div className={`mt-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <p>Features include:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Rich profiles with photos and biographical information</li>
                  <li>• Multiple relationship types and connections</li>
                  <li>• Interactive visualizations and layouts</li>
                  <li>• Search, filter, and statistics</li>
                  <li>• Export and share your family tree</li>
                  <li>• Dark mode support for comfortable viewing</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className={isFullscreen ? "h-screen" : "h-[calc(100vh-4rem)]"}>
            <FamilyTree />
          </div>
        )}
      </main>

      {/* Person Detail Panel */}
      {selectedNodeId && <PersonDetailPanel />}

      {/* Floating Add Button (shown when tree has content) */}
      {people.length > 0 && !isFullscreen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 transform hover:scale-110"
          title="Add Family Member"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Enhanced Instructions */}
      {people.length > 0 && !isFullscreen && !selectedNodeId && (
        <div className={`fixed bottom-8 left-8 rounded-lg shadow-lg p-4 max-w-sm z-10 border backdrop-blur-sm ${
          darkMode 
            ? 'bg-gray-800/95 border-gray-600 text-gray-200' 
            : 'bg-white/95 border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-2 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <Settings size={16} className="mr-2" />
            Quick Guide
          </h3>
          <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>• <strong>Click</strong> nodes to view detailed information</li>
            <li>• <strong>Drag</strong> nodes to reposition them</li>
            <li>• <strong>Search</strong> and filter family members</li>
            <li>• <strong>Change layouts</strong> using the layout selector</li>
            <li>• <strong>Export/Import</strong> your family tree data</li>
            <li>• <strong>View statistics</strong> about your family</li>
            <li>• <strong>Toggle dark mode</strong> for comfortable viewing</li>
          </ul>
        </div>
      )}

      <AddPersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;
