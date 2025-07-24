import { detectCycles } from '../algorithms/cycleDetection';
import { detectBridges } from '../algorithms/bridgeDetection';
import { detectCommunities } from '../algorithms/communityDetection';
import { calculateRiskScores } from '../algorithms/riskScoring';
import { AnalysisResult, Graph, Relationship } from '../models/Graph';
import { buildGraph } from './graphBuilder';

/**
 * Main function to analyze supplier relationships for fraud detection
 * @param relationships List of supplier relationships
 * @returns Comprehensive analysis result
 */
export function analyzeSupplierRelationships(relationships: Relationship[]): AnalysisResult {
  // Build the graph from relationships
  const graph: Graph = buildGraph(relationships);
  
  // Detect cycles
  const cycles = detectCycles(graph);
  
  // Detect bridge providers
  const bridges = detectBridges(graph);
  
  // Detect communities
  const communities = detectCommunities(graph);
  
  // Calculate risk scores
  const riskScores = calculateRiskScores(graph);
  
  return {
    cycles,
    bridges,
    communities,
    riskScores
  };
}