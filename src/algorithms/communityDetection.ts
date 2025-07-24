import { CommunityResult, Graph } from '../models/Graph';

/**
 * Detects communities (connected components) in the graph
 * Time Complexity: O(V + E) where V is the number of vertices and E is the number of edges
 * @param graph The graph to analyze
 * @returns Object containing the list of communities
 */
export function detectCommunities(graph: Graph): CommunityResult {
  const communities: string[][] = [];
  const visited = new Set<string>();
  
  // Create an undirected version of the graph for community detection
  const undirectedConnections = new Map<string, Set<string>>();
  
  // Initialize undirected connections
  for (const [providerId, provider] of graph.providers.entries()) {
    undirectedConnections.set(providerId, new Set<string>());
  }
  
  // Add all connections as undirected
  for (const [providerId, provider] of graph.providers.entries()) {
    for (const neighbor of provider.outgoingConnections) {
      undirectedConnections.get(providerId)?.add(neighbor);
      undirectedConnections.get(neighbor)?.add(providerId);
    }
  }

  // For each provider, run DFS if not visited
  for (const providerId of graph.providers.keys()) {
    if (!visited.has(providerId)) {
      const community: string[] = [];
      communityDfs(providerId, undirectedConnections, visited, community);
      communities.push(community);
    }
  }

  return { communities };
}

/**
 * DFS helper function to detect communities
 */
function communityDfs(
  currentId: string,
  undirectedConnections: Map<string, Set<string>>,
  visited: Set<string>,
  community: string[]
): void {
  visited.add(currentId);
  community.push(currentId);
  
  const neighbors = undirectedConnections.get(currentId) || new Set<string>();
  
  for (const neighborId of neighbors) {
    if (!visited.has(neighborId)) {
      communityDfs(neighborId, undirectedConnections, visited, community);
    }
  }
}