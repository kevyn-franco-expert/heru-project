import { calculateRiskScores } from '../algorithms/riskScoring';
import { buildGraph } from '../utils/graphBuilder';
import { detectCycles } from '../algorithms/cycleDetection';
import { detectBridges } from '../algorithms/bridgeDetection';
import { Graph, Relationship } from '../models/Graph';

describe('Risk Scoring', () => {
  test('should calculate risk scores for all providers', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = calculateRiskScores(graph);
    
    // Assert
    expect(result.providerScores).toBeDefined();
    expect(Object.keys(result.providerScores).length).toBe(4); // A, B, C, D
    expect(result.providerScores['A']).toBeGreaterThanOrEqual(0);
    expect(result.providerScores['A']).toBeLessThanOrEqual(100);
    expect(result.providerScores['B']).toBeGreaterThanOrEqual(0);
    expect(result.providerScores['B']).toBeLessThanOrEqual(100);
  });
  
  test('should assign higher risk to providers in cycles', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' }, // Cycle
      { from: 'D', to: 'E' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Mark providers in cycles
    detectCycles(graph);
    
    // Act
    const result = calculateRiskScores(graph);
    
    // Assert
    expect(result.providerScores['A']).toBeGreaterThan(result.providerScores['D']);
    expect(result.providerScores['B']).toBeGreaterThan(result.providerScores['D']);
    expect(result.providerScores['C']).toBeGreaterThan(result.providerScores['D']);
  });
  
  test('should assign medium risk to bridge providers', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' }, // B is a bridge
      { from: 'C', to: 'D' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Mark bridge providers
    detectBridges(graph);
    
    // Act
    const result = calculateRiskScores(graph);
    
    // Assert
    expect(result.providerScores['B']).toBeGreaterThan(result.providerScores['A']);
    expect(result.providerScores['B']).toBeGreaterThan(result.providerScores['D']);
  });
  
  test('should consider number of connections in risk score', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'A', to: 'D' }, // A has many connections
      { from: 'E', to: 'F' }  // E has one connection
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = calculateRiskScores(graph);
    
    // Assert
    expect(result.providerScores['A']).toBeGreaterThan(result.providerScores['E']);
    expect(result.providerScores['A']).toBeGreaterThan(result.providerScores['F']);
  });
  
  test('should cap risk scores at 100', () => {
    // Arrange
    const relationships: Relationship[] = [
      // Create a highly connected provider in a cycle that's also a bridge
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'A', to: 'D' },
      { from: 'A', to: 'E' },
      { from: 'A', to: 'F' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' } // Cycle
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Mark providers in cycles and bridges
    detectCycles(graph);
    detectBridges(graph);
    
    // Act
    const result = calculateRiskScores(graph);
    
    // Assert
    expect(result.providerScores['A']).toBeLessThanOrEqual(100);
  });
});