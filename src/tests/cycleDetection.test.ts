import { detectCycles } from '../algorithms/cycleDetection';
import { buildGraph } from '../utils/graphBuilder';
import { Graph, Relationship } from '../models/Graph';

describe('Cycle Detection', () => {
  test('should detect a simple cycle', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectCycles(graph);
    
    // Assert
    expect(result.hasCycles).toBe(true);
    expect(result.cycles.length).toBeGreaterThan(0);
    
    // Check if the cycle contains all three providers
    const cycle = result.cycles[0];
    expect(cycle).toContain('A');
    expect(cycle).toContain('B');
    expect(cycle).toContain('C');
  });
  
  test('should not detect cycles in a linear graph', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectCycles(graph);
    
    // Assert
    expect(result.hasCycles).toBe(false);
    expect(result.cycles.length).toBe(0);
  });
  
  test('should detect multiple cycles', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'C' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectCycles(graph);
    
    // Assert
    expect(result.hasCycles).toBe(true);
    expect(result.cycles.length).toBe(2);
  });
  
  test('should mark providers in cycles', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
      { from: 'D', to: 'E' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    detectCycles(graph);
    
    // Assert
    expect(graph.providers.get('A')?.isInCycle).toBe(true);
    expect(graph.providers.get('B')?.isInCycle).toBe(true);
    expect(graph.providers.get('C')?.isInCycle).toBe(true);
    expect(graph.providers.get('D')?.isInCycle).toBeUndefined();
    expect(graph.providers.get('E')?.isInCycle).toBeUndefined();
  });
});