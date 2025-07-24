## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Running the System

#### Using the CLI

Run the system with the example data:

```bash
npm run start
```

#### Using the API

Start the API server:

```bash
npm run dev
```

Then send a POST request to `http://localhost:3000/analyze` with a JSON body containing the relationships:

```json
[
  { "from": "ProveedorA", "to": "ProveedorB" },
  { "from": "ProveedorB", "to": "ProveedorC" },
  { "from": "ProveedorC", "to": "ProveedorA" },
  { "from": "ProveedorD", "to": "ProveedorE" }
]
```

### Running Tests

Run the test suite:

```bash
npm test
```

## Input Format

The system expects a JSON array of relationships, where each relationship has `from` and `to` properties:

```json
[
  { "from": "ProveedorA", "to": "ProveedorB" },
  { "from": "ProveedorB", "to": "ProveedorC" },
  { "from": "ProveedorC", "to": "ProveedorA" },
  { "from": "ProveedorD", "to": "ProveedorE" }
]
```

## Output Format

The system returns a comprehensive analysis with the following structure:

```json
{
  "cycles": {
    "hasCycles": true,
    "cycles": [["ProveedorA", "ProveedorB", "ProveedorC", "ProveedorA"]]
  },
  "bridges": {
    "bridges": ["ProveedorD"]
  },
  "communities": {
    "communities": [
      ["ProveedorA", "ProveedorB", "ProveedorC"],
      ["ProveedorD", "ProveedorE"]
    ]
  },
  "riskScores": {
    "providerScores": {
      "ProveedorA": 85,
      "ProveedorB": 85,
      "ProveedorC": 85,
      "ProveedorD": 45,
      "ProveedorE": 30
    }
  }
}
```

## Algorithm Complexity

- **Time Complexity**: All main algorithms run in O(V + E) time, where V is the number of vertices (suppliers) and E is the number of edges (relationships).
- **Space Complexity**: O(V + E) for storing the graph and algorithm-specific data structures.

## Project Structure

```
src/
├── algorithms/         # Core graph algorithms
│   ├── cycleDetection.ts
│   ├── bridgeDetection.ts
│   ├── communityDetection.ts
│   └── riskScoring.ts
├── models/             # Data models
│   └── Graph.ts
├── utils/              # Utility functions
│   ├── graphBuilder.ts
│   └── fraudDetection.ts
├── tests/              # Unit tests
│   ├── cycleDetection.test.ts
│   ├── bridgeDetection.test.ts
│   ├── communityDetection.test.ts
│   ├── riskScoring.test.ts
│   └── fraudDetection.test.ts
├── index.ts            # CLI entry point
└── api.ts              # API entry point
```

## License

This project is licensed under the ISC License.