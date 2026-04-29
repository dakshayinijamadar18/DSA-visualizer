'use client'

import { Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GraphAlgorithm } from '@/algorithms/graph'
import { SampleGraph, sampleGraphs, generateRandomGraph } from '@/data/sampleGraphs'

type GraphControlsProps = {
  algorithm: GraphAlgorithm
  selectedGraph: SampleGraph
  selectedStart: string | null
  selectedEnd: string | null
  onAlgorithmChange: (algorithm: GraphAlgorithm) => void
  onGraphChange: (graph: SampleGraph) => void
  onStartChange: (nodeId: string | null) => void
  onEndChange: (nodeId: string | null) => void
  disabled?: boolean
}

const algorithms: { id: GraphAlgorithm; name: string; description: string }[] = [
  { id: 'bfs', name: 'BFS', description: 'Breadth-First Search' },
  { id: 'dfs', name: 'DFS', description: 'Depth-First Search' },
  { id: 'dijkstra', name: 'Dijkstra', description: 'Shortest Path' },
]

export function GraphControls({
  algorithm,
  selectedGraph,
  selectedStart,
  selectedEnd,
  onAlgorithmChange,
  onGraphChange,
  onStartChange,
  onEndChange,
  disabled,
}: GraphControlsProps) {
  const handleRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 4) + 5 // 5-8 nodes
    const graph = generateRandomGraph(nodeCount)
    onGraphChange(graph)
    onStartChange(null)
    onEndChange(null)
  }

  return (
    <div className="glass-card rounded-2xl p-4 space-y-4">
      {/* Algorithm Selection */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Algorithm</label>
        <div className="grid grid-cols-3 gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => onAlgorithmChange(algo.id)}
              disabled={disabled}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all flex flex-col items-center',
                algorithm === algo.id
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                  : 'bg-secondary/50 text-foreground hover:bg-secondary disabled:opacity-50'
              )}
            >
              <span className="font-bold">{algo.name}</span>
              <span className="text-xs opacity-75">{algo.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Graph Selection */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Graph Preset</label>
        <div className="grid grid-cols-2 gap-2">
          {sampleGraphs.map((graph) => (
            <button
              key={graph.name}
              onClick={() => {
                onGraphChange(graph)
                onStartChange(null)
                onEndChange(null)
              }}
              disabled={disabled}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                selectedGraph.name === graph.name
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-foreground hover:bg-secondary disabled:opacity-50'
              )}
            >
              {graph.name}
            </button>
          ))}
        </div>
        <Button
          onClick={handleRandomGraph}
          disabled={disabled}
          variant="secondary"
          className="w-full mt-2"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Random Graph
        </Button>
      </div>

      {/* Node Selection */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Start Node</label>
          <div className="flex flex-wrap gap-1">
            {selectedGraph.nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onStartChange(node.id)}
                disabled={disabled || node.id === selectedEnd}
                className={cn(
                  'h-8 w-8 rounded-full text-xs font-bold transition-all',
                  selectedStart === node.id
                    ? 'bg-sorted text-white ring-2 ring-sorted ring-offset-2 ring-offset-background'
                    : node.id === selectedEnd
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                )}
              >
                {node.id}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">End Node (Optional)</label>
          <div className="flex flex-wrap gap-1">
            {selectedGraph.nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onEndChange(selectedEnd === node.id ? null : node.id)}
                disabled={disabled || node.id === selectedStart}
                className={cn(
                  'h-8 w-8 rounded-full text-xs font-bold transition-all',
                  selectedEnd === node.id
                    ? 'bg-comparing text-white ring-2 ring-comparing ring-offset-2 ring-offset-background'
                    : node.id === selectedStart
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                )}
              >
                {node.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center">
        Click on nodes in the canvas or use buttons above to select start/end nodes
      </p>
    </div>
  )
}
