import { CycleResult, Graph } from '../models/Graph';

/**
 * Detects cycles in a directed graph using DFS
 * Time Complexity: O(V + E) where V is the number of vertices and E is the number of edges
 * @param graph The graph to analyze
 * @returns Object containing whether cycles exist and the list of cycles
 */
export function detectCycles(graph: Graph): CycleResult {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const providerIds = Array.from(graph.providers.keys());
  
  // For each provider, run DFS if not visited
  for (const providerId of providerIds) {
    if (!visited.has(providerId)) {
      const path: string[] = [];
      dfs(providerId, graph, visited, recursionStack, path, cycles);
    }
  }

  // Mark providers that are in cycles
  cycles.forEach(cycle => {
    cycle.forEach(providerId => {
      const provider = graph.providers.get(providerId);
      if (provider) {
        provider.isInCycle = true;
      }
    });
  });

  return {
    hasCycles: cycles.length > 0,
    cycles
  };
}

/**
 * DFS helper function to detect cycles
 */
function dfs(
  currentId: string,
  graph: Graph,
  visited: Set<string>,
  recursionStack: Set<string>,
  path: string[],
  cycles: string[][]
): void {
  visited.add(currentId);
  recursionStack.add(currentId);
  path.push(currentId);

  const provider = graph.providers.get(currentId);
  if (!provider) return;

  for (const neighborId of provider.outgoingConnections) {
    if (!visited.has(neighborId)) {
      dfs(neighborId, graph, visited, recursionStack, [...path], cycles);
    } else if (recursionStack.has(neighborId)) {
      // Found a cycle
      const cycleStart = path.indexOf(neighborId);
      if (cycleStart !== -1) {
        const cycle = path.slice(cycleStart).concat(neighborId);
        cycles.push(cycle);
      }
    }
  }

  recursionStack.delete(currentId);
}