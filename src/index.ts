import { Relationship } from './models/Graph';
import { analyzeSupplierRelationships } from './utils/fraudDetection';

/**
 * Main entry point for the fraud detection system
 */
function main() {
  // Example input
  const relationships: Relationship[] = [
    { from: "ProveedorA", to: "ProveedorB" },
    { from: "ProveedorB", to: "ProveedorC" },
    { from: "ProveedorC", to: "ProveedorA" },
    { from: "ProveedorD", to: "ProveedorE" }
  ];

  try {
    // Analyze the relationships
    const result = analyzeSupplierRelationships(relationships);
    
    // Output the result
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error analyzing supplier relationships:', error);
  }
}

// If this file is run directly, execute the main function
if (require.main === module) {
  main();
}

// Export the main function for testing
export { main };