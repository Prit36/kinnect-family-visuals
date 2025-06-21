
import React, { useState, useEffect } from 'react';
import { Plus, Users, TreePine, Search, Settings, Sparkles } from 'lucide-react';
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
    ? `fixed inset-0 z-50 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}` 
    : `min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`;

  const headerClass = darkMode 
    ? 'bg-gray-800/90 border-gray-700 backdrop-blur-lg' 
    : 'bg-white/90 border-gray-200 backdrop-blur-lg';

  return (
    <div className={containerClass}>
      {/* Header */}
      <header className={`${headerClass} border-b shadow-xl sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="relative">
                  <TreePine className="w-10 h-10 text-green-600 dark:text-green-400" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                  Family Tree Visualizer
                </h1>
                {people.length > 0 && (
                  <div className="flex items-center space-x-4 mt-1">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="font-semibold text-blue-500">{people.length}</span> member{people.length !== 1 ? 's' : ''} • 
                      <span className="font-semibold text-green-500 ml-1">{people.filter(p => p.isAlive).length}</span> living
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {people.length > 0 && (
                <>
                  <SearchAndFilter />
                  <LayoutControls />
                  <ExportImport />
                </>
              )}
              
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-6 py-2.5"
              >
                <Plus size={18} className="mr-2" />
                Add Person
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Panel */}
      {showStatistics && people.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <StatisticsPanel />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        {people.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-2xl px-6">
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <TreePine className={`w-32 h-32 mx-auto relative ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                </div>
              </div>
              <h2 className={`text-5xl font-bold mb-6 bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
                Build Your Family Tree
              </h2>
              <p className={`text-xl mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Create a beautiful, interactive digital family tree with rich profiles, 
                stunning visualizations, and detailed family connections. Preserve your 
                family's legacy with modern design and intuitive features.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 px-8 py-4 text-lg rounded-2xl"
              >
                <Plus size={24} className="mr-3" />
                Add Your First Family Member
              </Button>
              <div className={`mt-10 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} space-y-2`}>
                <p className="font-semibold text-lg mb-4">✨ Amazing Features:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
                    <span>Beautiful animated profiles with photos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></span>
                    <span>Interactive drag & drop interface</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"></span>
                    <span>Multiple layout options & themes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></span>
                    <span>Advanced search & filtering</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                    <span>Export & share your family tree</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"></span>
                    <span>Dark mode for comfortable viewing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={isFullscreen ? "h-screen" : "h-[calc(100vh-5rem)]"}>
            <FamilyTree />
          </div>
        )}
      </main>

      {/* Person Detail Panel */}
      {selectedNodeId && <PersonDetailPanel />}

      {/* Floating Add Button */}
      {people.length > 0 && !isFullscreen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 z-20 transform hover:scale-110 group"
          title="Add Family Member"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
        </button>
      )}

      {/* Enhanced Instructions */}
      {people.length > 0 && !isFullscreen && !selectedNodeId && (
        <div className={`fixed bottom-8 left-8 rounded-2xl shadow-2xl p-6 max-w-sm z-10 border backdrop-blur-lg transition-all duration-300 hover:shadow-3xl ${
          darkMode 
            ? 'bg-gray-800/90 border-gray-600 text-gray-200' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <h3 className={`font-bold text-lg mb-4 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <Settings size={20} className="mr-2 text-blue-500" />
            Quick Guide
          </h3>
          <ul className={`text-sm space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span><strong>Click</strong> nodes to view detailed information</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span><strong>Drag</strong> nodes to reposition them</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span><strong>Search</strong> and filter family members</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <span><strong>Change layouts</strong> for different views</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span><strong>Export/Import</strong> your family data</span>
            </li>
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
