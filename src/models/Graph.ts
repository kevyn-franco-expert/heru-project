/**
 * Graph data structure to represent supplier relationships
 */
export interface Relationship {
  from: string;
  to: string;
}

export interface Provider {
  id: string;
  incomingConnections: string[];
  outgoingConnections: string[];
  riskScore?: number;
  isBridge?: boolean;
  isInCycle?: boolean;
}

export interface Graph {
  providers: Map<string, Provider>;
}

export interface CycleResult {
  hasCycles: boolean;
  cycles: string[][];
}

export interface BridgeResult {
  bridges: string[];
}

export interface CommunityResult {
  communities: string[][];
}

export interface RiskScoreResult {
  providerScores: Record<string, number>;
}

export interface AnalysisResult {
  cycles: CycleResult;
  bridges: BridgeResult;
  communities: CommunityResult;
  riskScores: RiskScoreResult;
}