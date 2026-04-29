'use client'

import { useMemo } from 'react'
import { BarChart3, Circle, GitBranch, Route, Zap } from 'lucide-react'
import { GraphStep, GraphAlgorithm } from '@/algorithms/graph'
import { graphAlgorithmInfo } from '@/data/algorithmInfo'

type GraphStatisticsPanelProps = {
  steps: GraphStep[]
  currentStepIndex: number
  algorithm: GraphAlgorithm
  totalNodes: number
  totalEdges: number
}

type MetricBarProps = {
  label: string
  value: number
  maxValue: number
  color: string
  icon: React.ReactNode
}

function MetricBar({ label, value, maxValue, color, icon }: MetricBarProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-mono font-medium text-foreground">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary/50">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

type MiniBarChartProps = {
  data: number[]
  maxValue: number
  label: string
  currentIndex: number
}

function MiniBarChart({ data, maxValue, label, currentIndex }: MiniBarChartProps) {
  const displayData = data.slice(-20)
  const offset = Math.max(0, data.length - 20)
  
  return (
    <div className="space-y-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex h-12 items-end gap-px">
        {displayData.map((value, index) => {
          const actualIndex = offset + index
          const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0
          const isActive = actualIndex === currentIndex
          const isPast = actualIndex < currentIndex
          
          return (
            <div
              key={actualIndex}
              className={`flex-1 min-w-[2px] rounded-t transition-all duration-150 ${
                isActive
                  ? 'bg-primary'
                  : isPast
                  ? 'bg-primary/40'
                  : 'bg-secondary/30'
              }`}
              style={{ height: `${Math.max(heightPercent, 4)}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function GraphStatisticsPanel({ 
  steps, 
  currentStepIndex, 
  algorithm,
  totalNodes,
  totalEdges 
}: GraphStatisticsPanelProps) {
  const algorithmInfo = graphAlgorithmInfo[algorithm]
  
  // Calculate visited nodes and edges at current step
  const { visitedNodes, edgesTraversed, queueStackSize, nodeHistory, pathLength } = useMemo(() => {
    let visited = 0
    let edges = 0
    let queueSize = 0
    let pathLen = 0
    const nodeHist: number[] = []
    
    steps.forEach((step, index) => {
      // Count unique visited nodes
      const visitedCount = Object.values(step.nodeStates).filter(
        (s) => s === 'visited' || s === 'current' || s === 'path'
      ).length
      
      // Count edges traversed (simplified: based on visiting state changes)
      if (step.visiting) edges++
      
      // Queue/stack size
      const qsLen = (step.queue?.length || 0) + (step.stack?.length || 0)
      
      // Path nodes
      const pathCount = Object.values(step.nodeStates).filter((s) => s === 'path').length
      
      if (index <= currentStepIndex) {
        visited = visitedCount
        queueSize = qsLen
        pathLen = pathCount
      }
      
      nodeHist.push(visitedCount)
    })
    
    return {
      visitedNodes: currentStepIndex >= 0 ? visited : 0,
      edgesTraversed: currentStepIndex >= 0 ? edges : 0,
      queueStackSize: currentStepIndex >= 0 ? queueSize : 0,
      nodeHistory: nodeHist,
      pathLength: currentStepIndex >= 0 ? pathLen : 0,
    }
  }, [steps, currentStepIndex])

  // Queue/Stack history for mini chart
  const queueStackHistory = useMemo(() => {
    return steps.map((step) => (step.queue?.length || 0) + (step.stack?.length || 0))
  }, [steps])

  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0

  return (
    <div className="glass-card rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Statistics</h3>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Metrics with mini bars */}
      <div className="space-y-3">
        <MetricBar
          label="Nodes Visited"
          value={visitedNodes}
          maxValue={totalNodes}
          color="bg-visiting"
          icon={<Circle className="h-4 w-4" />}
        />
        <MetricBar
          label="Queue/Stack"
          value={queueStackHistory[currentStepIndex] || 0}
          maxValue={totalNodes}
          color="bg-visited"
          icon={<GitBranch className="h-4 w-4" />}
        />
        {pathLength > 0 && (
          <MetricBar
            label="Path Length"
            value={pathLength}
            maxValue={totalNodes}
            color="bg-path"
            icon={<Route className="h-4 w-4" />}
          />
        )}
      </div>

      {/* Mini bar charts */}
      <div className="pt-2 border-t border-border/50 space-y-3">
        <MiniBarChart
          data={nodeHistory}
          maxValue={totalNodes}
          label="Visited nodes over time"
          currentIndex={currentStepIndex}
        />
        <MiniBarChart
          data={queueStackHistory}
          maxValue={Math.max(...queueStackHistory, 1)}
          label={algorithm === 'bfs' ? 'Queue size' : algorithm === 'dfs' ? 'Stack size' : 'Priority queue'}
          currentIndex={currentStepIndex}
        />
      </div>

      {/* Summary stats */}
      <div className="pt-2 border-t border-border/50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-secondary/30 p-2 text-center">
            <div className="text-muted-foreground">Graph Size</div>
            <div className="font-mono font-medium text-foreground">
              {totalNodes}V / {totalEdges}E
            </div>
          </div>
          <div className="rounded-lg bg-secondary/30 p-2 text-center">
            <div className="text-muted-foreground">Complexity</div>
            <div className="font-mono font-medium text-accent flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              {algorithmInfo.timeComplexity.average}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
