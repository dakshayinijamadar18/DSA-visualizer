'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { GraphCanvas, GraphLegend } from './GraphCanvas'
import { GraphControls } from './GraphControls'
import { ControlPanel } from '@/components/ControlPanel'
import { InfoPanels } from '@/components/InfoPanels'
import { StatusBadge } from '@/components/StatusBadge'
import { GraphStatisticsPanel } from '@/components/GraphStatisticsPanel'
import { GraphStep, GraphAlgorithm, getGraphGenerator } from '@/algorithms/graph'
import { graphAlgorithmInfo } from '@/data/algorithmInfo'
import { SampleGraph, sampleGraphs } from '@/data/sampleGraphs'

export function GraphVisualizer() {
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>('bfs')
  const [selectedGraph, setSelectedGraph] = useState<SampleGraph>(sampleGraphs[0])
  const [selectedStart, setSelectedStart] = useState<string | null>('A')
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [steps, setSteps] = useState<GraphStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [status, setStatus] = useState<'idle' | 'visiting' | 'visited' | 'path'>('idle')

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Generate all steps when graph, algorithm, or nodes change
  const generateSteps = useCallback(() => {
    if (!selectedStart) {
      setSteps([])
      return
    }

    const generator = getGraphGenerator(
      algorithm,
      selectedGraph.nodes,
      selectedGraph.edges,
      selectedStart,
      selectedEnd || undefined
    )
    
    const newSteps: GraphStep[] = []
    let result = generator.next()
    while (!result.done) {
      newSteps.push(result.value)
      result = generator.next()
    }
    
    setSteps(newSteps)
    setCurrentStepIndex(-1)
    setIsPlaying(false)
    setStatus('idle')
  }, [algorithm, selectedGraph, selectedStart, selectedEnd])

  useEffect(() => {
    generateSteps()
  }, [generateSteps])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [])

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      const interval = 1200 / speed
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, interval)
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [isPlaying, speed, steps.length])

  // Update status based on current step
  useEffect(() => {
    if (currentStepIndex < 0) {
      setStatus('idle')
      return
    }
    
    const step = steps[currentStepIndex]
    if (!step) return

    const hasPath = Object.values(step.nodeStates).some((s) => s === 'path')
    const hasVisiting = Object.values(step.nodeStates).some((s) => s === 'visiting' || s === 'current')

    if (hasPath) {
      setStatus('path')
    } else if (hasVisiting) {
      setStatus('visiting')
    } else {
      setStatus('visited')
    }
  }, [currentStepIndex, steps])

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }
  
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }
  
  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(-1)
    setStatus('idle')
  }

  const handleAlgorithmChange = (newAlgorithm: GraphAlgorithm) => {
    setIsPlaying(false)
    setAlgorithm(newAlgorithm)
  }

  const handleGraphChange = (newGraph: SampleGraph) => {
    setIsPlaying(false)
    setSelectedGraph(newGraph)
    setSelectedStart(newGraph.nodes[0]?.id || null)
    setSelectedEnd(null)
  }

  const handleNodeClick = (nodeId: string) => {
    if (isPlaying) return
    
    if (!selectedStart || selectedStart === nodeId) {
      setSelectedStart(nodeId)
      setSelectedEnd(null)
    } else if (selectedEnd === nodeId) {
      setSelectedEnd(null)
    } else {
      setSelectedEnd(nodeId)
    }
  }

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null
  const algorithmInfo = graphAlgorithmInfo[algorithm]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{algorithmInfo.name}</h2>
            <p className="text-sm text-muted-foreground">{algorithmInfo.description.slice(0, 80)}...</p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Graph Visualization */}
        <GraphCanvas
          nodes={selectedGraph.nodes}
          edges={selectedGraph.edges}
          step={currentStep}
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          onNodeClick={handleNodeClick}
        />

        {/* Legend */}
        <GraphLegend />

        {/* Data Structure Display */}
        {currentStep && (currentStep.queue || currentStep.stack) && (
          <div className="glass-card rounded-xl p-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {currentStep.queue ? 'Queue:' : 'Stack:'}
              </span>
              <div className="flex gap-1">
                {(currentStep.queue || currentStep.stack || []).map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary"
                  >
                    {item}
                  </span>
                ))}
                {(currentStep.queue || currentStep.stack || []).length === 0 && (
                  <span className="text-muted-foreground">Empty</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          <GraphControls
            algorithm={algorithm}
            selectedGraph={selectedGraph}
            selectedStart={selectedStart}
            selectedEnd={selectedEnd}
            onAlgorithmChange={handleAlgorithmChange}
            onGraphChange={handleGraphChange}
            onStartChange={setSelectedStart}
            onEndChange={setSelectedEnd}
            disabled={isPlaying}
          />
          <ControlPanel
            isPlaying={isPlaying}
            canStepBack={currentStepIndex > 0}
            canStepForward={currentStepIndex < steps.length - 1}
            speed={speed}
            currentStep={currentStepIndex + 1}
            totalSteps={steps.length}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onStepBack={handleStepBack}
            onReset={handleReset}
            onSpeedChange={setSpeed}
          />
        </div>
      </div>

      {/* Info Panels */}
      <aside className="space-y-4">
        <GraphStatisticsPanel
          steps={steps}
          currentStepIndex={currentStepIndex}
          algorithm={algorithm}
          totalNodes={selectedGraph.nodes.length}
          totalEdges={selectedGraph.edges.length}
        />
        <InfoPanels
          algorithmInfo={algorithmInfo}
          currentDescription={currentStep?.description || ''}
          highlightedLine={currentStep?.codeLineHighlight}
        />
      </aside>
    </div>
  )
}
