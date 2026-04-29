import { GraphNode, GraphEdge } from '@/algorithms/graph'

export type SampleGraph = {
  name: string
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export const sampleGraphs: SampleGraph[] = [
  {
    name: 'Simple Graph',
    nodes: [
      { id: 'A', x: 150, y: 50 },
      { id: 'B', x: 50, y: 150 },
      { id: 'C', x: 250, y: 150 },
      { id: 'D', x: 100, y: 250 },
      { id: 'E', x: 200, y: 250 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 3 },
      { from: 'C', to: 'E', weight: 1 },
      { from: 'D', to: 'E', weight: 5 },
      { from: 'B', to: 'C', weight: 1 },
    ],
  },
  {
    name: 'Binary Tree',
    nodes: [
      { id: '1', x: 150, y: 30 },
      { id: '2', x: 75, y: 100 },
      { id: '3', x: 225, y: 100 },
      { id: '4', x: 40, y: 180 },
      { id: '5', x: 110, y: 180 },
      { id: '6', x: 190, y: 180 },
      { id: '7', x: 260, y: 180 },
    ],
    edges: [
      { from: '1', to: '2', weight: 1 },
      { from: '1', to: '3', weight: 1 },
      { from: '2', to: '4', weight: 1 },
      { from: '2', to: '5', weight: 1 },
      { from: '3', to: '6', weight: 1 },
      { from: '3', to: '7', weight: 1 },
    ],
  },
  {
    name: 'Grid Graph',
    nodes: [
      { id: 'A', x: 50, y: 50 },
      { id: 'B', x: 150, y: 50 },
      { id: 'C', x: 250, y: 50 },
      { id: 'D', x: 50, y: 150 },
      { id: 'E', x: 150, y: 150 },
      { id: 'F', x: 250, y: 150 },
      { id: 'G', x: 50, y: 250 },
      { id: 'H', x: 150, y: 250 },
      { id: 'I', x: 250, y: 250 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'D', weight: 3 },
      { from: 'B', to: 'E', weight: 1 },
      { from: 'C', to: 'F', weight: 4 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'E', to: 'F', weight: 3 },
      { from: 'D', to: 'G', weight: 1 },
      { from: 'E', to: 'H', weight: 2 },
      { from: 'F', to: 'I', weight: 1 },
      { from: 'G', to: 'H', weight: 4 },
      { from: 'H', to: 'I', weight: 2 },
    ],
  },
  {
    name: 'Dense Graph',
    nodes: [
      { id: 'A', x: 150, y: 30 },
      { id: 'B', x: 270, y: 100 },
      { id: 'C', x: 220, y: 220 },
      { id: 'D', x: 80, y: 220 },
      { id: 'E', x: 30, y: 100 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 2 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'A', to: 'D', weight: 4 },
      { from: 'A', to: 'E', weight: 3 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 6 },
      { from: 'B', to: 'E', weight: 4 },
      { from: 'C', to: 'D', weight: 2 },
      { from: 'C', to: 'E', weight: 3 },
      { from: 'D', to: 'E', weight: 1 },
    ],
  },
]

export function generateRandomGraph(nodeCount: number): SampleGraph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  
  const centerX = 150
  const centerY = 150
  const radius = 120
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2
    nodes.push({
      id: String.fromCharCode(65 + i),
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    })
  }
  
  // Create a connected graph
  for (let i = 0; i < nodeCount - 1; i++) {
    edges.push({
      from: nodes[i].id,
      to: nodes[i + 1].id,
      weight: Math.floor(Math.random() * 9) + 1,
    })
  }
  
  // Add some random edges
  const extraEdges = Math.floor(nodeCount / 2)
  for (let i = 0; i < extraEdges; i++) {
    const from = Math.floor(Math.random() * nodeCount)
    let to = Math.floor(Math.random() * nodeCount)
    while (to === from) {
      to = Math.floor(Math.random() * nodeCount)
    }
    
    const edgeExists = edges.some(
      e => (e.from === nodes[from].id && e.to === nodes[to].id) ||
           (e.from === nodes[to].id && e.to === nodes[from].id)
    )
    
    if (!edgeExists) {
      edges.push({
        from: nodes[from].id,
        to: nodes[to].id,
        weight: Math.floor(Math.random() * 9) + 1,
      })
    }
  }
  
  return {
    name: 'Random Graph',
    nodes,
    edges,
  }
}
