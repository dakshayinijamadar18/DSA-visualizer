export type GraphNode = {
  id: string
  x: number
  y: number
}

export type GraphEdge = {
  from: string
  to: string
  weight: number
}

export type NodeState = 'default' | 'visiting' | 'visited' | 'path' | 'current'

export type GraphStep = {
  nodeStates: Record<string, NodeState>
  edgeStates: Record<string, 'default' | 'visiting' | 'visited' | 'path'>
  currentNode: string | null
  description: string
  codeLineHighlight: number
  distances?: Record<string, number>
  queue?: string[]
  stack?: string[]
}

// BFS Algorithm
export function* bfs(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string,
  endId?: string
): Generator<GraphStep> {
  const adjacencyList: Record<string, { node: string; weight: number }[]> = {}
  
  nodes.forEach(node => {
    adjacencyList[node.id] = []
  })
  
  edges.forEach(edge => {
    adjacencyList[edge.from].push({ node: edge.to, weight: edge.weight })
    adjacencyList[edge.to].push({ node: edge.from, weight: edge.weight })
  })

  const visited: Set<string> = new Set()
  const queue: string[] = [startId]
  const parent: Record<string, string | null> = { [startId]: null }
  const nodeStates: Record<string, NodeState> = {}
  const edgeStates: Record<string, 'default' | 'visiting' | 'visited' | 'path'> = {}

  nodes.forEach(node => {
    nodeStates[node.id] = 'default'
  })

  yield {
    nodeStates: { ...nodeStates, [startId]: 'visiting' },
    edgeStates: { ...edgeStates },
    currentNode: startId,
    description: `Starting BFS from node ${startId}`,
    codeLineHighlight: 2,
    queue: [...queue],
  }

  while (queue.length > 0) {
    const current = queue.shift()!
    
    if (visited.has(current)) continue
    visited.add(current)
    nodeStates[current] = 'current'

    yield {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      currentNode: current,
      description: `Visiting node ${current}`,
      codeLineHighlight: 4,
      queue: [...queue],
    }

    if (current === endId) {
      // Reconstruct path
      const path: string[] = []
      let node: string | null = current
      while (node !== null) {
        path.unshift(node)
        node = parent[node]
      }

      for (let i = 0; i < path.length; i++) {
        nodeStates[path[i]] = 'path'
        if (i > 0) {
          const edgeKey = [path[i - 1], path[i]].sort().join('-')
          edgeStates[edgeKey] = 'path'
        }
      }

      yield {
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        currentNode: null,
        description: `Found path to ${endId}: ${path.join(' → ')}`,
        codeLineHighlight: 8,
        queue: [],
      }
      return
    }

    for (const neighbor of adjacencyList[current]) {
      if (!visited.has(neighbor.node)) {
        const edgeKey = [current, neighbor.node].sort().join('-')
        edgeStates[edgeKey] = 'visiting'
        
        if (!queue.includes(neighbor.node)) {
          queue.push(neighbor.node)
          parent[neighbor.node] = current
          nodeStates[neighbor.node] = 'visiting'
        }

        yield {
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          currentNode: current,
          description: `Adding neighbor ${neighbor.node} to queue`,
          codeLineHighlight: 5,
          queue: [...queue],
        }
      }
    }

    nodeStates[current] = 'visited'
    Object.keys(edgeStates).forEach(key => {
      if (edgeStates[key] === 'visiting') {
        edgeStates[key] = 'visited'
      }
    })
  }

  yield {
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    currentNode: null,
    description: 'BFS traversal complete',
    codeLineHighlight: 9,
    queue: [],
  }
}

// DFS Algorithm
export function* dfs(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string,
  endId?: string
): Generator<GraphStep> {
  const adjacencyList: Record<string, { node: string; weight: number }[]> = {}
  
  nodes.forEach(node => {
    adjacencyList[node.id] = []
  })
  
  edges.forEach(edge => {
    adjacencyList[edge.from].push({ node: edge.to, weight: edge.weight })
    adjacencyList[edge.to].push({ node: edge.from, weight: edge.weight })
  })

  const visited: Set<string> = new Set()
  const stack: string[] = [startId]
  const parent: Record<string, string | null> = { [startId]: null }
  const nodeStates: Record<string, NodeState> = {}
  const edgeStates: Record<string, 'default' | 'visiting' | 'visited' | 'path'> = {}

  nodes.forEach(node => {
    nodeStates[node.id] = 'default'
  })

  yield {
    nodeStates: { ...nodeStates, [startId]: 'visiting' },
    edgeStates: { ...edgeStates },
    currentNode: startId,
    description: `Starting DFS from node ${startId}`,
    codeLineHighlight: 2,
    stack: [...stack],
  }

  while (stack.length > 0) {
    const current = stack.pop()!
    
    if (visited.has(current)) continue
    visited.add(current)
    nodeStates[current] = 'current'

    yield {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      currentNode: current,
      description: `Visiting node ${current}`,
      codeLineHighlight: 4,
      stack: [...stack],
    }

    if (current === endId) {
      const path: string[] = []
      let node: string | null = current
      while (node !== null) {
        path.unshift(node)
        node = parent[node]
      }

      for (let i = 0; i < path.length; i++) {
        nodeStates[path[i]] = 'path'
        if (i > 0) {
          const edgeKey = [path[i - 1], path[i]].sort().join('-')
          edgeStates[edgeKey] = 'path'
        }
      }

      yield {
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        currentNode: null,
        description: `Found path to ${endId}: ${path.join(' → ')}`,
        codeLineHighlight: 8,
        stack: [],
      }
      return
    }

    const neighbors = adjacencyList[current].slice().reverse()
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.node)) {
        const edgeKey = [current, neighbor.node].sort().join('-')
        edgeStates[edgeKey] = 'visiting'
        
        stack.push(neighbor.node)
        parent[neighbor.node] = current
        nodeStates[neighbor.node] = 'visiting'

        yield {
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          currentNode: current,
          description: `Adding neighbor ${neighbor.node} to stack`,
          codeLineHighlight: 5,
          stack: [...stack],
        }
      }
    }

    nodeStates[current] = 'visited'
  }

  yield {
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    currentNode: null,
    description: 'DFS traversal complete',
    codeLineHighlight: 9,
    stack: [],
  }
}

// Dijkstra's Algorithm
export function* dijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string,
  endId?: string
): Generator<GraphStep> {
  const adjacencyList: Record<string, { node: string; weight: number }[]> = {}
  
  nodes.forEach(node => {
    adjacencyList[node.id] = []
  })
  
  edges.forEach(edge => {
    adjacencyList[edge.from].push({ node: edge.to, weight: edge.weight })
    adjacencyList[edge.to].push({ node: edge.from, weight: edge.weight })
  })

  const distances: Record<string, number> = {}
  const visited: Set<string> = new Set()
  const parent: Record<string, string | null> = {}
  const nodeStates: Record<string, NodeState> = {}
  const edgeStates: Record<string, 'default' | 'visiting' | 'visited' | 'path'> = {}

  nodes.forEach(node => {
    distances[node.id] = Infinity
    parent[node.id] = null
    nodeStates[node.id] = 'default'
  })
  distances[startId] = 0

  yield {
    nodeStates: { ...nodeStates, [startId]: 'visiting' },
    edgeStates: { ...edgeStates },
    currentNode: startId,
    description: `Starting Dijkstra from node ${startId}, distance set to 0`,
    codeLineHighlight: 2,
    distances: { ...distances },
  }

  while (visited.size < nodes.length) {
    // Find minimum distance unvisited node
    let minDist = Infinity
    let current: string | null = null
    
    for (const node of nodes) {
      if (!visited.has(node.id) && distances[node.id] < minDist) {
        minDist = distances[node.id]
        current = node.id
      }
    }

    if (current === null || minDist === Infinity) break

    visited.add(current)
    nodeStates[current] = 'current'

    yield {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      currentNode: current,
      description: `Selecting node ${current} with minimum distance ${distances[current]}`,
      codeLineHighlight: 4,
      distances: { ...distances },
    }

    if (current === endId) {
      const path: string[] = []
      let node: string | null = current
      while (node !== null) {
        path.unshift(node)
        node = parent[node]
      }

      for (let i = 0; i < path.length; i++) {
        nodeStates[path[i]] = 'path'
        if (i > 0) {
          const edgeKey = [path[i - 1], path[i]].sort().join('-')
          edgeStates[edgeKey] = 'path'
        }
      }

      yield {
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        currentNode: null,
        description: `Shortest path to ${endId}: ${path.join(' → ')} with distance ${distances[endId]}`,
        codeLineHighlight: 9,
        distances: { ...distances },
      }
      return
    }

    for (const neighbor of adjacencyList[current]) {
      if (!visited.has(neighbor.node)) {
        const newDist = distances[current] + neighbor.weight
        const edgeKey = [current, neighbor.node].sort().join('-')
        edgeStates[edgeKey] = 'visiting'

        yield {
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          currentNode: current,
          description: `Checking edge to ${neighbor.node}: current distance ${distances[neighbor.node] === Infinity ? '∞' : distances[neighbor.node]}, new distance ${newDist}`,
          codeLineHighlight: 5,
          distances: { ...distances },
        }

        if (newDist < distances[neighbor.node]) {
          distances[neighbor.node] = newDist
          parent[neighbor.node] = current
          nodeStates[neighbor.node] = 'visiting'

          yield {
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            currentNode: current,
            description: `Updated distance to ${neighbor.node}: ${newDist}`,
            codeLineHighlight: 6,
            distances: { ...distances },
          }
        }

        edgeStates[edgeKey] = 'visited'
      }
    }

    nodeStates[current] = 'visited'
  }

  yield {
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    currentNode: null,
    description: 'Dijkstra algorithm complete',
    codeLineHighlight: 10,
    distances: { ...distances },
  }
}

export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra'

export function getGraphGenerator(
  algorithm: GraphAlgorithm,
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string,
  endId?: string
) {
  switch (algorithm) {
    case 'bfs':
      return bfs(nodes, edges, startId, endId)
    case 'dfs':
      return dfs(nodes, edges, startId, endId)
    case 'dijkstra':
      return dijkstra(nodes, edges, startId, endId)
    default:
      return bfs(nodes, edges, startId, endId)
  }
}
