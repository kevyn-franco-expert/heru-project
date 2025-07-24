import { analyzeSupplierRelationships } from '../utils/fraudDetection';
import { Relationship } from '../models/Graph';

describe('Fraud Detection', () => {
  test('should analyze supplier relationships and return comprehensive results', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' }, // Cycle
      { from: 'D', to: 'E' },
      { from: 'F', to: 'G' }
    ];
    
    // Act
    const result = analyzeSupplierRelationships(relationships);
    
    // Assert
    // Check cycles
    expect(result.cycles).toBeDefined();
    expect(result.cycles.hasCycles).toBe(true);
    expect(result.cycles.cycles.length).toBeGreaterThan(0);
    
    // Check bridges
    expect(result.bridges).toBeDefined();
    expect(result.bridges.bridges).toBeDefined();
    
    // Check communities
    expect(result.communities).toBeDefined();
    expect(result.communities.communities).toBeDefined();
    expect(result.communities.communities.length).toBe(3); // 3 separate communities
    
    // Check risk scores
    expect(result.riskScores).toBeDefined();
    expect(result.riskScores.providerScores).toBeDefined();
    expect(Object.keys(result.riskScores.providerScores).length).toBe(7); // A, B, C, D, E, F, G
  });
  
  test('should handle empty input', () => {
    // Arrange
    const relationships: Relationship[] = [];
    
    // Act
    const result = analyzeSupplierRelationships(relationships);
    
    // Assert
    expect(result.cycles.hasCycles).toBe(false);
    expect(result.cycles.cycles.length).toBe(0);
    expect(result.bridges.bridges.length).toBe(0);
    expect(result.communities.communities.length).toBe(0);
    expect(Object.keys(result.riskScores.providerScores).length).toBe(0);
  });
  
  test('should handle a complex network', () => {
    // Arrange
    const relationships: Relationship[] = [
      // Community 1 with cycle
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
      
      // Bridge to another community
      { from: 'C', to: 'D' },
      
      // Community 2
      { from: 'D', to: 'E' },
      { from: 'E', to: 'F' },
      { from: 'F', to: 'G' },
      
      // Isolated community
      { from: 'H', to: 'I' }
    ];
    
    // Act
    const result = analyzeSupplierRelationships(relationships);
    
    // Assert
    // Check cycles
    expect(result.cycles.hasCycles).toBe(true);
    
    // Check bridges
    expect(result.bridges.bridges.length).toBeGreaterThan(0);
    expect(result.bridges.bridges).toContain('C'); // C is a bridge between communities
    
    // Check communities
    expect(result.communities.communities.length).toBe(2); // 2 separate communities
    
    // Check risk scores
    expect(Object.keys(result.riskScores.providerScores).length).toBe(9); // A through I
    
    // Providers in cycles should have higher risk
    expect(result.riskScores.providerScores['A']).toBeGreaterThan(result.riskScores.providerScores['E']);
    
    // Bridge providers should have medium risk
    expect(result.riskScores.providerScores['C']).toBeGreaterThan(result.riskScores.providerScores['F']);
  });
});