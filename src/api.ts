import express, { Request, Response } from 'express';
import { Relationship } from './models/Graph';
import { analyzeSupplierRelationships } from './utils/fraudDetection';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Main endpoint for fraud detection
app.post('/analyze', (req: Request, res: Response) => {
  try {
    const relationships: Relationship[] = req.body;
    
    // Validate input
    if (!Array.isArray(relationships)) {
      return res.status(400).json({ 
        error: 'Invalid input. Expected an array of relationships.' 
      });
    }
    
    // Validate each relationship
    for (const rel of relationships) {
      if (!rel.from || !rel.to) {
        return res.status(400).json({ 
          error: 'Invalid relationship. Each relationship must have "from" and "to" properties.' 
        });
      }
    }
    
    // Analyze the relationships
    const result = analyzeSupplierRelationships(relationships);
    
    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing supplier relationships:', error);
    res.status(500).json({ 
      error: 'An error occurred while analyzing the relationships.' 
    });
  }
});

// Start the server
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// If this file is run directly, start the server
if (require.main === module) {
  startServer();
}

// Export for testing
export { app, startServer };