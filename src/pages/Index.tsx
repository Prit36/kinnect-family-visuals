
import React, { useState } from 'react';
import { Plus, Users, TreePine } from 'lucide-react';
import FamilyTree from '../components/FamilyTree';
import AddPersonModal from '../components/AddPersonModal';
import { useFamilyTreeStore } from '../store/familyTreeStore';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const people = useFamilyTreeStore(state => state.people);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <TreePine className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Family Tree Visualizer
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{people.length} member{people.length !== 1 ? 's' : ''}</span>
              </div>
              
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Person
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {people.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <TreePine className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Start Building Your Family Tree
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Add your first family member to begin creating your interactive family tree. 
                You can add photos, define relationships, and explore your family connections.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus size={20} className="mr-2" />
                Add First Person
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-4rem)]">
            <FamilyTree />
          </div>
        )}
      </main>

      {/* Floating Add Button (shown when tree has content) */}
      {people.length > 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10"
          title="Add Family Member"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Instructions */}
      {people.length > 0 && (
        <div className="fixed bottom-8 left-8 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">How to use:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Drag nodes to reposition them</li>
            <li>• Click the + button to add new people</li>
            <li>• Define relationships when adding</li>
            <li>• Click × on nodes to remove them</li>
            <li>• Use controls to zoom and pan</li>
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
