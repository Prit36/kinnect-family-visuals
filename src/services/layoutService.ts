/**
 * Layout calculation service for family tree visualization
 */

import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';
import { LayoutType } from '../types';
import { LAYOUT_CONFIG } from '../constants';

export class LayoutService {
  private static dagreGraph = new dagre.graphlib.Graph();

  static {
    this.dagreGraph.setDefaultEdgeLabel(() => ({}));
  }

  /**
   * Apply hierarchical layout using Dagre
   */
  static applyHierarchicalLayout(
    nodes: Node[],
    edges: Edge[],
    direction: 'TB' | 'LR' = 'TB'
  ): { nodes: Node[]; edges: Edge[] } {
    this.dagreGraph.setGraph({ rankdir: direction });

    // Clear previous graph
    nodes.forEach(node => {
      if (this.dagreGraph.hasNode(node.id)) {
        this.dagreGraph.removeNode(node.id);
      }
    });

    edges.forEach(edge => {
      if (this.dagreGraph.hasEdge(edge.source, edge.target)) {
        this.dagreGraph.removeEdge(edge.source, edge.target);
      }
    });

    // Add nodes and edges
    nodes.forEach(node => {
      this.dagreGraph.setNode(node.id, {
        width: LAYOUT_CONFIG.NODE_WIDTH,
        height: LAYOUT_CONFIG.NODE_HEIGHT
      });
    });

    edges.forEach(edge => {
      this.dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(this.dagreGraph);

    // Update node positions
    const layoutedNodes = nodes.map(node => {
      const nodeWithPosition = this.dagreGraph.node(node.id);
      
      return {
        ...node,
        targetPosition: direction === 'LR' ? Position.Left : Position.Top,
        sourcePosition: direction === 'LR' ? Position.Right : Position.Bottom,
        position: {
          x: nodeWithPosition.x - LAYOUT_CONFIG.NODE_WIDTH / 2,
          y: nodeWithPosition.y - LAYOUT_CONFIG.NODE_HEIGHT / 2,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply circular layout
   */
  static applyCircularLayout(nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
    const centerX = 400;
    const centerY = 300;
    const radius = Math.max(200, nodes.length * 30);

    const layoutedNodes = nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        ...node,
        position: { x, y },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply grid layout
   */
  static applyGridLayout(nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const spacing = LAYOUT_CONFIG.NODE_WIDTH + LAYOUT_CONFIG.SPACING.HORIZONTAL;

    const layoutedNodes = nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      return {
        ...node,
        position: {
          x: col * spacing,
          y: row * (LAYOUT_CONFIG.NODE_HEIGHT + LAYOUT_CONFIG.SPACING.VERTICAL),
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply radial layout
   */
  static applyRadialLayout(nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
    if (nodes.length === 0) return { nodes, edges };

    const centerNode = nodes[0];
    const otherNodes = nodes.slice(1);
    
    const centerX = 400;
    const centerY = 300;
    
    // Place center node
    const layoutedNodes = [
      {
        ...centerNode,
        position: { x: centerX, y: centerY },
      }
    ];

    // Place other nodes in concentric circles
    const levels = Math.ceil(otherNodes.length / 8);
    let nodeIndex = 0;

    for (let level = 1; level <= levels; level++) {
      const radius = level * 200;
      const nodesInLevel = Math.min(8 * level, otherNodes.length - nodeIndex);
      
      for (let i = 0; i < nodesInLevel; i++) {
        if (nodeIndex >= otherNodes.length) break;
        
        const angle = (2 * Math.PI * i) / nodesInLevel;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        layoutedNodes.push({
          ...otherNodes[nodeIndex],
          position: { x, y },
        });
        
        nodeIndex++;
      }
    }

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply layout based on type
   */
  static applyLayout(
    layoutType: LayoutType,
    nodes: Node[],
    edges: Edge[]
  ): { nodes: Node[]; edges: Edge[] } {
    switch (layoutType) {
      case LayoutType.HIERARCHICAL:
        return this.applyHierarchicalLayout(nodes, edges);
      case LayoutType.CIRCULAR:
        return this.applyCircularLayout(nodes, edges);
      case LayoutType.GRID:
        return this.applyGridLayout(nodes, edges);
      case LayoutType.RADIAL:
        return this.applyRadialLayout(nodes, edges);
      default:
        return { nodes, edges };
    }
  }
}