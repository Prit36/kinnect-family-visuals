
/**
 * Layout service for different family tree layouts
 */

import dagre from 'dagre';
import { FamilyTreeNode, FamilyTreeEdge, LayoutType } from '../types';

export class LayoutService {
  private static readonly NODE_WIDTH = 300;
  private static readonly NODE_HEIGHT = 200;
  private static readonly LAYOUT_SPACING = 100;

  /**
   * Apply hierarchical layout using Dagre
   */
  private static applyHierarchicalLayout(
    nodes: FamilyTreeNode[],
    edges: FamilyTreeEdge[]
  ): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes to graph
    nodes.forEach((node) => {
      g.setNode(node.id, {
        width: this.NODE_WIDTH,
        height: this.NODE_HEIGHT,
      });
    });

    // Add edges to graph
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    // Apply layout
    dagre.layout(g);

    // Update node positions
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - this.NODE_WIDTH / 2,
          y: nodeWithPosition.y - this.NODE_HEIGHT / 2,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply circular layout
   */
  private static applyCircularLayout(
    nodes: FamilyTreeNode[],
    edges: FamilyTreeEdge[]
  ): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
    const centerX = 400;
    const centerY = 300;
    const radius = Math.max(200, nodes.length * 30);

    const layoutedNodes = nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        ...node,
        position: { x: x - this.NODE_WIDTH / 2, y: y - this.NODE_HEIGHT / 2 },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply grid layout
   */
  private static applyGridLayout(
    nodes: FamilyTreeNode[],
    edges: FamilyTreeEdge[]
  ): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const spacing = this.NODE_WIDTH + this.LAYOUT_SPACING;

    const layoutedNodes = nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      return {
        ...node,
        position: {
          x: col * spacing,
          y: row * (this.NODE_HEIGHT + this.LAYOUT_SPACING),
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply radial layout
   */
  private static applyRadialLayout(
    nodes: FamilyTreeNode[],
    edges: FamilyTreeEdge[]
  ): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
    if (nodes.length === 0) return { nodes, edges };

    // Place the first node at center
    const centerNode = nodes[0];
    const centerX = 400;
    const centerY = 300;

    const layoutedNodes = nodes.map((node, index) => {
      if (index === 0) {
        return {
          ...node,
          position: { x: centerX - this.NODE_WIDTH / 2, y: centerY - this.NODE_HEIGHT / 2 },
        };
      }

      // Calculate position for other nodes in concentric circles
      const level = Math.floor((index - 1) / 6) + 1;
      const positionInLevel = (index - 1) % 6;
      const radius = level * 200;
      const angle = (2 * Math.PI * positionInLevel) / 6;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        ...node,
        position: { x: x - this.NODE_WIDTH / 2, y: y - this.NODE_HEIGHT / 2 },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  /**
   * Apply layout based on type
   */
  static applyLayout(
    layoutType: LayoutType,
    nodes: FamilyTreeNode[],
    edges: FamilyTreeEdge[]
  ): { nodes: FamilyTreeNode[]; edges: FamilyTreeEdge[] } {
    if (nodes.length === 0) {
      return { nodes, edges };
    }

    switch (layoutType) {
      case 'hierarchical':
        return this.applyHierarchicalLayout(nodes, edges);
      case 'circular':
        return this.applyCircularLayout(nodes, edges);
      case 'grid':
        return this.applyGridLayout(nodes, edges);
      case 'radial':
        return this.applyRadialLayout(nodes, edges);
      default:
        return this.applyHierarchicalLayout(nodes, edges);
    }
  }

  /**
   * Get available layout types
   */
  static getAvailableLayouts(): Array<{ value: LayoutType; label: string }> {
    return [
      { value: 'hierarchical', label: 'Hierarchical' },
      { value: 'circular', label: 'Circular' },
      { value: 'grid', label: 'Grid' },
      { value: 'radial', label: 'Radial' },
    ];
  }
}
