
/**
 * Main family tree visualization component
 */

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeTypes,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PersonNodeViewer } from '../molecules/PersonNodeViewer';
import { useFamilyTreeStore } from '../../stores/familyTreeStore';
import { useSearchStore } from '../../stores/searchStore';
import { useUIStore } from '../../stores/uiStore';
import { useTheme } from '../../contexts/ThemeContext';
import { THEME_CONFIG } from '../../constants';

const nodeTypes: NodeTypes = {
  person: PersonNodeViewer,
};

interface FamilyTreeVisualizationProps {
  className?: string;
}

export const FamilyTreeVisualization: React.FC<FamilyTreeVisualizationProps> = ({
  className,
}) => {
  const {
    nodes,
    edges,
    people,
  } = useFamilyTreeStore();
  
  const { filteredPeople, searchFilters } = useSearchStore();
  const { setSelectedNodeId } = useUIStore();
  
  const { darkMode } = useTheme();
  
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Filter nodes based on search filters
  const filteredNodeIds = new Set(filteredPeople.map((person) => person.id));

  const visibleNodes = useMemo(() => {
    const hasActiveFilters = Boolean(
      searchFilters.searchTerm ||
      searchFilters.gender ||
      searchFilters.isAlive !== undefined ||
      searchFilters.hasImage !== undefined
    );

    if (!hasActiveFilters) {
      return flowNodes;
    }

    return flowNodes.filter((node) => filteredNodeIds.has(node.id));
  }, [flowNodes, filteredNodeIds, searchFilters]);

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
    return flowEdges.filter(
      (edge) =>
        visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [flowEdges, visibleNodes]);

  // Sync store state with React Flow state
  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  React.useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (_: any, node: any) => {
      // Update node position in store
      // This would be handled by the store
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const miniMapStyle = useMemo(
    () => ({
      height: 120,
      backgroundColor: darkMode ? '#1f2937' : '#f8fafc',
      border: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
      borderRadius: '12px',
    }),
    [darkMode]
  );

  const backgroundClass = darkMode ? 'bg-gray-900' : 'bg-slate-50';
  const controlsClass = darkMode
    ? 'bg-gray-800 border-gray-600 text-gray-200'
    : 'bg-white border-gray-200';

  return (
    <div className={`w-full h-full ${backgroundClass} ${className}`}>
      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className={backgroundClass}
        defaultEdgeOptions={{
          style: {
            strokeWidth: 3,
            stroke: darkMode ? '#60a5fa' : '#3b82f6',
          },
          type: 'smoothstep',
          animated: true,
        }}
        onPaneClick={onPaneClick}
      >
        <Controls className={`${controlsClass} rounded-xl shadow-xl border`} />
        <MiniMap
          style={miniMapStyle}
          className="shadow-xl"
          nodeColor={(node) => {
            if (node.type === 'person' && node.data) {
              const gender = (node.data as any).gender;
              if (!(node.data as any).isAlive) return '#9ca3af';
              return THEME_CONFIG.COLORS.GENDER[gender as keyof typeof THEME_CONFIG.COLORS.GENDER] || '#64748b';
            }
            return '#64748b';
          }}
          nodeBorderRadius={8}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color={darkMode ? '#374151' : '#e2e8f0'}
          className="opacity-60"
        />
      </ReactFlow>

      {/* Search Results Counter */}
      {(searchFilters.searchTerm ||
        searchFilters.gender ||
        searchFilters.isAlive !== undefined ||
        searchFilters.hasImage !== undefined) && (
        <div
          className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg shadow-lg ${
            darkMode
              ? 'bg-gray-800 text-gray-200 border border-gray-600'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          <p className="text-sm font-medium">
            Showing {visibleNodes.length} of {people.length} family members
          </p>
        </div>
      )}
    </div>
  );
};
