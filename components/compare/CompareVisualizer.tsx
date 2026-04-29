'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { SortingStep, SortingAlgorithm, getSortingGenerator } from '@/algorithms/sorting'
import { sortingAlgorithmInfo } from '@/data/algorithmInfo'
import { generateRandomArray } from '@/utils/arrayUtils'

const algorithms: SortingAlgorithm[] = ['bubble', 'merge', 'quick', 'heap']

// Static initial array to avoid hydration mismatch
const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90, 45, 78, 33, 56, 19, 87, 42, 68]

type AlgorithmState = {
  algorithm: SortingAlgorithm
  steps: SortingStep[]
  currentStepIndex: number
  isComplete: boolean
}

export function CompareVisualizer() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<SortingAlgorithm[]>(['bubble', 'merge'])
  const [array, setArray] = useState<number[]>(INITIAL_ARRAY)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmState[]>([])
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const maxValue = Math.max(...array)

  // Initialize algorithm states
  const initializeStates = useCallback(() => {
    const states: AlgorithmState[] = selectedAlgorithms.map((algorithm) => {
      const generator = getSortingGenerator(algorithm, array)
      const steps: SortingStep[] = []
      
      let result = generator.next()
      while (!result.done) {
        steps.push(result.value)
        result = generator.next()
      }
      
      return {
        algorithm,
        steps,
        currentStepIndex: -1,
        isComplete: false,
      }
    })
    
    setAlgorithmStates(states)
    setIsPlaying(false)
  }, [selectedAlgorithms, array])

  useEffect(() => {
    initializeStates()
  }, [initializeStates])

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
        setAlgorithmStates((prev) => {
          const allComplete = prev.every((s) => s.isComplete)
          if (allComplete) {
            setIsPlaying(false)
            return prev
          }

          return prev.map((state) => {
            if (state.isComplete) return state
            
            const nextIndex = state.currentStepIndex + 1
            if (nextIndex >= state.steps.length) {
              return { ...state, isComplete: true }
            }
            
            return {
              ...state,
              currentStepIndex: nextIndex,
            }
          })
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
  }, [isPlaying, speed])

  const toggleAlgorithm = (algorithm: SortingAlgorithm) => {
    setSelectedAlgorithms((prev) => {
      if (prev.includes(algorithm)) {
        if (prev.length <= 2) return prev // Keep at least 2
        return prev.filter((a) => a !== algorithm)
      }
      if (prev.length >= 4) return prev // Max 4
      return [...prev, algorithm]
    })
  }

  const handleRandomize = () => {
    setArray(generateRandomArray(15))
  }

  const handleReset = () => {
    setIsPlaying(false)
    setAlgorithmStates((prev) =>
      prev.map((state) => ({
        ...state,
        currentStepIndex: -1,
        isComplete: false,
      }))
    )
  }

  const getBarColor = (step: SortingStep | null, index: number) => {
    if (!step) return 'bg-primary/40'
    
    if (step.sorted.includes(index)) return 'bg-sorted'
    if (step.pivot === index) return 'bg-pivot'
    if (step.swapping.includes(index)) return 'bg-swapping'
    if (step.comparing.includes(index)) return 'bg-comparing'
    return 'bg-primary/40'
  }

  const allComplete = algorithmStates.every((s) => s.isComplete)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Algorithm Comparison</h2>
          <p className="text-sm text-muted-foreground">Compare sorting algorithms side-by-side in real-time</p>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="glass-card rounded-2xl p-4">
        <label className="text-sm text-muted-foreground mb-3 block">Select Algorithms (2-4)</label>
        <div className="flex flex-wrap gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo}
              onClick={() => toggleAlgorithm(algo)}
              disabled={isPlaying}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                selectedAlgorithms.includes(algo)
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {sortingAlgorithmInfo[algo].name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className={cn(
        'grid gap-4',
        selectedAlgorithms.length === 2 && 'md:grid-cols-2',
        selectedAlgorithms.length === 3 && 'md:grid-cols-3',
        selectedAlgorithms.length === 4 && 'md:grid-cols-2 lg:grid-cols-4'
      )}>
        {algorithmStates.map((state) => {
          const info = sortingAlgorithmInfo[state.algorithm]
          const currentStep = state.currentStepIndex >= 0 ? state.steps[state.currentStepIndex] : null
          const displayArray = currentStep?.array || array
          const progress = state.steps.length > 0 
            ? ((state.currentStepIndex + 1) / state.steps.length) * 100 
            : 0

          return (
            <div key={state.algorithm} className="glass-card rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{info.name}</h3>
                {state.isComplete && (
                  <span className="rounded-full bg-sorted/20 px-2 py-0.5 text-xs font-medium text-sorted">
                    Complete
                  </span>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Step {state.currentStepIndex + 1} / {state.steps.length}</span>
                  <span>{info.timeComplexity.average}</span>
                </div>
              </div>

              {/* Mini Bars */}
              <div className="flex h-32 items-end justify-center gap-0.5">
                {displayArray.map((value, index) => {
                  const heightPercent = (value / maxValue) * 100
                  return (
                    <div
                      key={index}
                      className={cn(
                        'rounded-t transition-all duration-200',
                        getBarColor(currentStep, index)
                      )}
                      style={{ 
                        height: `${heightPercent}%`,
                        width: `${Math.max(100 / displayArray.length - 0.5, 3)}%`
                      }}
                    />
                  )
                })}
              </div>

              {/* Status */}
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                {currentStep?.description || 'Ready to start'}
              </p>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={handleRandomize}
            disabled={isPlaying}
            variant="secondary"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            New Array
          </Button>
          
          <Button
            onClick={handleReset}
            variant="secondary"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={allComplete}
            className={cn(
              'min-w-[120px]',
              isPlaying
                ? 'bg-destructive hover:bg-destructive/80'
                : 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
            )}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {allComplete ? 'Finished' : 'Start Race'}
              </>
            )}
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Speed: {speed}x</span>
            <Slider
              value={[speed]}
              onValueChange={([v]) => setSpeed(v)}
              min={0.5}
              max={4}
              step={0.5}
              className="w-32 [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-primary [&_[role=slider]]:to-accent"
            />
          </div>
        </div>
      </div>

      {/* Complexity Comparison Table */}
      <div className="glass-card rounded-2xl p-4 overflow-x-auto">
        <h3 className="font-semibold text-foreground mb-4">Complexity Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Algorithm</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Best</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Average</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Worst</th>
              <th className="text-center py-2 px-3 text-muted-foreground font-medium">Space</th>
            </tr>
          </thead>
          <tbody>
            {selectedAlgorithms.map((algo) => {
              const info = sortingAlgorithmInfo[algo]
              return (
                <tr key={algo} className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-foreground">{info.name}</td>
                  <td className="py-2 px-3 text-center font-mono text-sorted">{info.timeComplexity.best}</td>
                  <td className="py-2 px-3 text-center font-mono text-swapping">{info.timeComplexity.average}</td>
                  <td className="py-2 px-3 text-center font-mono text-comparing">{info.timeComplexity.worst}</td>
                  <td className="py-2 px-3 text-center font-mono text-accent">{info.spaceComplexity}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
