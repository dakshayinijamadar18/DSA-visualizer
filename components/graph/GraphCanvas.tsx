'use client'

import { useRef, useEffect } from 'react'
import { GraphNode, GraphEdge, GraphStep, NodeState } from '@/algorithms/graph'
import { cn } from '@/lib/utils'

type GraphCanvasProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  step: GraphStep | null
  selectedStart: string | null
  selectedEnd: string | null
  onNodeClick: (nodeId: string) => void
}

const nodeColors: Record<NodeState, string> = {
  default: '#6366f1',
  visiting: '#a855f7',
  visited: '#64748b',
  path: '#22c55e',
  current: '#f59e0b',
}

const edgeColors = {
  default: '#475569',
  visiting: '#a855f7',
  visited: '#64748b',
  path: '#22c55e',
}

export function GraphCanvas({
  nodes,
  edges,
  step,
  selectedStart,
  selectedEnd,
  onNodeClick,
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)
      if (!fromNode || !toNode) return

      const edgeKey = [edge.from, edge.to].sort().join('-')
      const edgeState = step?.edgeStates[edgeKey] || 'default'
      const color = edgeColors[edgeState]

      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.strokeStyle = color
      ctx.lineWidth = edgeState === 'path' ? 4 : edgeState === 'visiting' ? 3 : 2
      ctx.stroke()

      // Draw weight
      const midX = (fromNode.x + toNode.x) / 2
      const midY = (fromNode.y + toNode.y) / 2

      ctx.fillStyle = '#1e1b4b'
      ctx.beginPath()
      ctx.arc(midX, midY, 12, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#e2e8f0'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(edge.weight), midX, midY)
    })

    // Draw nodes
    nodes.forEach((node) => {
      const nodeState = step?.nodeStates[node.id] || 'default'
      let color = nodeColors[nodeState]

      // Override color for selected start/end
      if (node.id === selectedStart) {
        color = '#22c55e'
      } else if (node.id === selectedEnd) {
        color = '#ef4444'
      }

      const isActive = nodeState === 'current' || nodeState === 'visiting'
      const radius = isActive ? 24 : 20

      // Glow effect for active nodes
      if (isActive) {
        ctx.shadowColor = color
        ctx.shadowBlur = 15
      } else {
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      // Node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Node border
      ctx.strokeStyle = '#1e1b4b'
      ctx.lineWidth = 3
      ctx.stroke()

      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0

      // Node label
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.id, node.x, node.y)
    })

    // Draw distances if available (for Dijkstra)
    if (step?.distances) {
      nodes.forEach((node) => {
        const dist = step.distances![node.id]
        const label = dist === Infinity ? '∞' : String(dist)

        ctx.fillStyle = '#fbbf24'
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, node.x, node.y - 35)
      })
    }
  }, [nodes, edges, step, selectedStart, selectedEnd])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if click is on a node
    for (const node of nodes) {
      const dx = x - node.x
      const dy = y - node.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= 24) {
        onNodeClick(node.id)
        return
      }
    }
  }

  return (
    <div className="glass-card rounded-2xl p-4 overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-72 cursor-pointer"
        style={{ width: '100%', height: '288px' }}
      />
    </div>
  )
}

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-visiting" />
        <span className="text-muted-foreground">Visiting</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-visited" />
        <span className="text-muted-foreground">Visited</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-path" />
        <span className="text-muted-foreground">Path</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-sorted" />
        <span className="text-muted-foreground">Start</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-comparing" />
        <span className="text-muted-foreground">End</span>
      </div>
    </div>
  )
}
