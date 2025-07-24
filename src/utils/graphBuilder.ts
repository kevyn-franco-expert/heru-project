import { Graph, Provider, Relationship } from '../models/Graph';

/**
 * Builds a graph from a list of relationships
 * @param relationships List of supplier relationships
 * @returns Graph representation
 */
export function buildGraph(relationships: Relationship[]): Graph {
  const providers = new Map<string, Provider>();

  // First pass: Create all providers
  relationships.forEach(rel => {
    if (!providers.has(rel.from)) {
      providers.set(rel.from, {
        id: rel.from,
        incomingConnections: [],
        outgoingConnections: []
      });
    }

    if (!providers.has(rel.to)) {
      providers.set(rel.to, {
        id: rel.to,
        incomingConnections: [],
        outgoingConnections: []
      });
    }
  });

  // Second pass: Add connections
  relationships.forEach(rel => {
    const fromProvider = providers.get(rel.from)!;
    const toProvider = providers.get(rel.to)!;

    fromProvider.outgoingConnections.push(rel.to);
    toProvider.incomingConnections.push(rel.from);
  });

  return { providers };
}

/**
 * Gets all provider IDs from the graph
 * @param graph The graph
 * @returns Array of provider IDs
 */
export function getProviderIds(graph: Graph): string[] {
  return Array.from(graph.providers.keys());
}