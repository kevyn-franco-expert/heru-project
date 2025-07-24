import { detectCommunities } from '../algorithms/communityDetection';
import { buildGraph } from '../utils/graphBuilder';
import { Graph, Relationship } from '../models/Graph';

describe('Community Detection', () => {
  test('should detect a single community in a connected graph', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectCommunities(graph);
    
    // Assert
    expect(result.communities.length).toBe(1);
    expect(result.communities[0].length).toBe(4); // A, B, C, D
    expect(result.communities[0]).toContain('A');
    expect(result.communities[0]).toContain('B');
    expect(result.communities[0]).toContain('C');
    expect(result.communities[0]).toContain('D');
  });
  
  test('should detect multiple communities in a disconnected graph', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'D', to: 'E' },
      { from: 'F', to: 'G' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Act
    const result = detectCommunities(graph);
    
    // Assert
    expect(result.communities.length).toBe(3);
    
    // Find community with A
    const communityA = result.communities.find(c => c.includes('A'));
    expect(communityA).toBeDefined();
    expect(communityA?.length).toBe(3); // A, B, C
    expect(communityA).toContain('A');
    expect(communityA).toContain('B');
    expect(communityA).toContain('C');
    
    // Find community with D
    const communityD = result.communities.find(c => c.includes('D'));
    expect(communityD).toBeDefined();
    expect(communityD?.length).toBe(2); // D, E
    expect(communityD).toContain('D');
    expect(communityD).toContain('E');
    
    // Find community with F
    const communityF = result.communities.find(c => c.includes('F'));
    expect(communityF).toBeDefined();
    expect(communityF?.length).toBe(2); // F, G
    expect(communityF).toContain('F');
    expect(communityF).toContain('G');
  });
  
  test('should handle isolated providers', () => {
    // Arrange
    const relationships: Relationship[] = [
      { from: 'A', to: 'B' },
      { from: 'C', to: 'C' }, // Self-loop
      { from: 'D', to: 'E' }
    ];
    const graph: Graph = buildGraph(relationships);
    
    // Add an isolated provider
    graph.providers.set('F', {
      id: 'F',
      incomingConnections: [],
      outgoingConnections: []
    });
    
    // Act
    const result = detectCommunities(graph);
    
    // Assert
    expect(result.communities.length).toBe(3);
    
    // Find isolated provider
    const isolatedCommunity = result.communities.find(c => c.length === 1);
    expect(isolatedCommunity).toBeDefined();
    expect(isolatedCommunity).toContain('F');
  });
});