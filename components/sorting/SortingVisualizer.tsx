'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { SortingBars } from './SortingBars'
import { SortingControls } from './SortingControls'
import { ControlPanel } from '@/components/ControlPanel'
import { InfoPanels } from '@/components/InfoPanels'
import { StatusBadge, Legend } from '@/components/StatusBadge'
import { StatisticsPanel } from '@/components/StatisticsPanel'
import { SortingStep, SortingAlgorithm, getSortingGenerator } from '@/algorithms/sorting'
import { sortingAlgorithmInfo } from '@/data/algorithmInfo'
import { generateRandomArray } from '@/utils/arrayUtils'

// Static initial array to avoid hydration mismatch
const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90, 45, 78, 33, 56, 19, 87, 42, 68]

export function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble')
  const [array, setArray] = useState<number[]>(INITIAL_ARRAY)
  const [arraySize, setArraySize] = useState(15)
  const [isClient, setIsClient] = useState(false)

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [steps, setSteps] = useState<SortingStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [status, setStatus] = useState<'idle' | 'comparing' | 'swapping' | 'sorted'>('idle')
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const maxValue = Math.max(...array)

  // Generate all steps when array or algorithm changes
  const generateSteps = useCallback(() => {
    const generator = getSortingGenerator(algorithm, array)
    const newSteps: SortingStep[] = []
    
    let result = generator.next()
    while (!result.done) {
      newSteps.push(result.value)
      result = generator.next()
    }
    
    setSteps(newSteps)
    setCurrentStepIndex(-1)
    setIsPlaying(false)
    setStatus('idle')
  }, [algorithm, array])

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
      const interval = 1000 / speed
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            setStatus('sorted')
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

    if (step.sorted.length === array.length) {
      setStatus('sorted')
    } else if (step.swapping.length > 0) {
      setStatus('swapping')
    } else if (step.comparing.length > 0) {
      setStatus('comparing')
    } else {
      setStatus('idle')
    }
  }, [currentStepIndex, steps, array.length])

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

  const handleAlgorithmChange = (newAlgorithm: SortingAlgorithm) => {
    setIsPlaying(false)
    setAlgorithm(newAlgorithm)
  }

  const handleArrayChange = (newArray: number[]) => {
    setIsPlaying(false)
    setArray(newArray)
  }

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null
  const algorithmInfo = sortingAlgorithmInfo[algorithm]

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

        {/* Visualization */}
        <SortingBars array={array} step={currentStep} maxValue={maxValue} />
        
        {/* Legend */}
        <Legend />

        {/* Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SortingControls
            algorithm={algorithm}
            arraySize={arraySize}
            onAlgorithmChange={handleAlgorithmChange}
            onArrayChange={handleArrayChange}
            onSizeChange={setArraySize}
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
        <StatisticsPanel
          steps={steps}
          currentStepIndex={currentStepIndex}
          algorithm={algorithm}
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
