

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
  
  const { filteredPeople, searchTerm, gender, isAlive, hasImage } = useSearchStore();
  const { setSelectedNode } = useUIStore();
  
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Filter nodes based on search filters
  const filteredNodeIds = new Set(filteredPeople.map((person) => person.id));

  const visibleNodes = useMemo(() => {
    const hasActiveFilters = Boolean(
      searchTerm ||
      gender ||
      isAlive !== undefined ||
      hasImage !== undefined
    );

    if (!hasActiveFilters) {
      return flowNodes;
    }

    return flowNodes.filter((node) => filteredNodeIds.has(node.id));
  }, [flowNodes, filteredNodeIds, searchTerm, gender, isAlive, hasImage]);

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
    setSelectedNode(null);
  }, [setSelectedNode]);

  const miniMapStyle = useMemo(
    () => ({
      height: 120,
      backgroundColor: 'transparent',
      border: '1px solid hsl(var(--border))',
      borderRadius: '12px',
    }),
    []
  );

  return (
    <div className={`w-full h-full bg-slate-50 dark:bg-gray-900 ${className}`}>
      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50 dark:bg-gray-900"
        defaultEdgeOptions={{
          style: {
            strokeWidth: 3,
            stroke: '#3b82f6',
          },
          type: 'smoothstep',
          animated: true,
        }}
        onPaneClick={onPaneClick}
      >
        <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-xl shadow-xl border" />
        <MiniMap
          style={miniMapStyle}
          className="shadow-xl bg-white dark:bg-gray-800"
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
          color="hsl(var(--muted-foreground))"
          className="opacity-60"
        />
      </ReactFlow>

      {/* Search Results Counter */}
      {(searchTerm ||
        gender ||
        isAlive !== undefined ||
        hasImage !== undefined) && (
        <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium">
            Showing {visibleNodes.length} of {people.length} family members
          </p>
        </div>
      )}
    </div>
  );
};

