
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PersonNode from './PersonNode';
import { useFamilyTreeStore } from '../store/familyTreeStore';

const nodeTypes: NodeTypes = {
  person: PersonNode,
};

const FamilyTree: React.FC = () => {
  const { nodes, edges, updateNodePosition, darkMode } = useFamilyTreeStore();
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

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
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  const miniMapStyle = useMemo(
    () => ({
      height: 120,
      backgroundColor: darkMode ? '#1f2937' : '#f8fafc',
      border: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
      borderRadius: '12px',
    }),
    [darkMode]
  );

  const backgroundClass = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50';

  const controlsClass = darkMode 
    ? 'bg-gray-800/80 border-gray-600 text-gray-200 backdrop-blur-sm' 
    : 'bg-white/80 border-gray-200 backdrop-blur-sm';

  return (
    <div className={`w-full h-full ${backgroundClass}`}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        className={backgroundClass}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { 
            strokeWidth: 3,
            stroke: darkMode ? '#60a5fa' : '#3b82f6',
          },
          type: 'smoothstep',
          animated: true,
        }}
      >
        <Controls 
          className={`${controlsClass} rounded-xl shadow-xl border`}
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        <MiniMap
          style={miniMapStyle}
          className="shadow-xl"
          nodeColor={(node) => {
            if (node.type === 'person') {
              const gender = node.data?.gender;
              if (!node.data?.isAlive) return '#9ca3af';
              switch (gender) {
                case 'male': return '#3b82f6';
                case 'female': return '#ec4899';
                default: return '#8b5cf6';
              }
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
    </div>
  );
};

export default FamilyTree;
