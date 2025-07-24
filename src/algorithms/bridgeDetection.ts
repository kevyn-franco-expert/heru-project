import { BridgeResult, Graph } from '../models/Graph';

/**
 * Detects bridge providers (articulation points) in the graph
 * Time Complexity: O(V + E) where V is the number of vertices and E is the number of edges
 * @param graph The graph to analyze
 * @returns Object containing the list of bridge providers
 */
export function detectBridges(graph: Graph): BridgeResult {
  const bridges: string[] = [];
  const visited = new Set<string>();
  const disc: Record<string, number> = {}; // Discovery time
  const low: Record<string, number> = {};  // Earliest visited vertex
  const parent: Record<string, string | null> = {}; // Parent in DFS tree
  let time = 0;

  // Create an undirected version of the graph for bridge detection
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
      bridgeDfs(
        providerId, 
        graph, 
        undirectedConnections,
        visited, 
        disc, 
        low, 
        parent, 
        time, 
        bridges
      );
    }
  }

  // Mark providers that are bridges
  bridges.forEach(providerId => {
    const provider = graph.providers.get(providerId);
    if (provider) {
      provider.isBridge = true;
    }
  });

  return { bridges };
}

/**
 * DFS helper function to detect bridges (articulation points)
 */
function bridgeDfs(
  currentId: string,
  graph: Graph,
  undirectedConnections: Map<string, Set<string>>,
  visited: Set<string>,
  disc: Record<string, number>,
  low: Record<string, number>,
  parent: Record<string, string | null>,
  time: number,
  bridges: string[]
): void {
  visited.add(currentId);
  disc[currentId] = low[currentId] = ++time;
  
  let children = 0;
  
  const neighbors = undirectedConnections.get(currentId) || new Set<string>();
  
  for (const neighborId of neighbors) {
    if (!visited.has(neighborId)) {
      children++;
      parent[neighborId] = currentId;
      
      bridgeDfs(
        neighborId,
        graph,
        undirectedConnections,
        visited,
        disc,
        low,
        parent,
        time,
        bridges
      );
      
      // Check if subtree rooted with neighborId has a connection to
      // one of the ancestors of currentId
      low[currentId] = Math.min(low[currentId], low[neighborId]);
      
      // If the current vertex is not the root and low value of one of its children
      // is more than the discovery value of the current vertex, then the current
      // vertex is an articulation point
      if ((parent[currentId] !== null && low[neighborId] >= disc[currentId]) ||
          (parent[currentId] === null && children > 1)) {
        if (!bridges.includes(currentId)) {
          bridges.push(currentId);
        }
      }
    } else if (neighborId !== parent[currentId]) {
      // Update low value of currentId for parent function calls
      low[currentId] = Math.min(low[currentId], disc[neighborId]);
    }
  }
}