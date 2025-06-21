
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
    }),
    [darkMode]
  );

  const backgroundClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const controlsClass = darkMode 
    ? 'bg-gray-800 border-gray-600 text-gray-200' 
    : 'bg-white border-gray-200';

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
      >
        <Controls className={`${controlsClass} rounded-lg shadow-lg`} />
        <MiniMap
          style={miniMapStyle}
          className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg shadow-lg`}
          nodeColor={(node) => {
            if (node.type === 'person') {
              return '#3b82f6';
            }
            return '#64748b';
          }}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color={darkMode ? '#374151' : '#e2e8f0'}
        />
      </ReactFlow>
    </div>
  );
};

export default FamilyTree;
