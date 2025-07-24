import { detectBridges } from '../algorithms/bridgeDetection';
import { buildGraph } from '../utils/graphBuilder';
import { Graph, Relationship } from '../models/Graph';

describe('Bridge Detection', () => {
  test('should detect a bridge provider in a simple graph', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectBridges(graph);
    
    // Assert
    expect(result.bridges.length).toBeGreaterThan(0);
    expect(result.bridges).toContain('B');
  });
  
  test('should not detect bridges in a fully connected graph', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'A' },
      { from: 'C', to: 'B' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectBridges(graph);
    
    // Assert
    expect(result.bridges.length).toBe(0);
  });
  
  test('should detect multiple bridge providers', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'F' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectBridges(graph);
    
    // Assert
    expect(result.bridges.length).toBeGreaterThan(1);
    expect(result.bridges).toContain('B');
    expect(result.bridges).toContain('C');
    expect(result.bridges).toContain('D');
  });
  
  test('should mark providers as bridges', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'E', to: 'F' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    detectBridges(graph);
    
    // Assert
    expect(graph.providers.get('B')?.isBridge).toBe(true);
    expect(graph.providers.get('C')?.isBridge).toBe(true);
    expect(graph.providers.get('A')?.isBridge).toBe(true);
    expect(graph.providers.get('D')?.isBridge).toBe(true);
    expect(graph.providers.get('E')?.isBridge).toBe(true);
    expect(graph.providers.get('F')?.isBridge).toBe(true);
  });
});