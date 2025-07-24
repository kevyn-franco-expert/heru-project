import { Graph, RiskScoreResult } from '../models/Graph';

/**
 * Calculates risk scores for all providers in the graph
 * Risk factors:
 * - Number of connections (both incoming and outgoing)
 * - Being in a cycle (high risk)
 * - Being a bridge (medium risk)
 * 
 * @param graph The graph to analyze
 * @returns Object containing risk scores for each provider
 */
export function calculateRiskScores(graph: Graph): RiskScoreResult {
  const providerScores: Record<string, number> = {};
  
  // Constants for risk scoring
  const BASE_SCORE = 20;
  const CONNECTION_WEIGHT = 5;
  const CYCLE_PENALTY = 40;
  const BRIDGE_PENALTY = 20;
  
  for (const [providerId, provider] of graph.providers.entries()) {
    let score = BASE_SCORE;
    
    // Add score based on number of connections
    const connectionCount = provider.incomingConnections.length + provider.outgoingConnections.length;
    score += connectionCount * CONNECTION_WEIGHT;
    
    // Add penalty for being in a cycle (high risk)
    if (provider.isInCycle) {
      score += CYCLE_PENALTY;
    }
    
    // Add penalty for being a bridge (medium risk)
    if (provider.isBridge) {
      score += BRIDGE_PENALTY;
    }
    
    // Cap the score at 100
    score = Math.min(score, 100);
    
    // Update the provider's risk score
    provider.riskScore = score;
    providerScores[providerId] = score;
  }
  
  return { providerScores };
}