'use client'

import { useMemo } from 'react'
import { BarChart3, ArrowLeftRight, Eye, Zap } from 'lucide-react'
import { SortingStep, SortingAlgorithm } from '@/algorithms/sorting'
import { sortingAlgorithmInfo } from '@/data/algorithmInfo'

type StatisticsPanelProps = {
  steps: SortingStep[]
  currentStepIndex: number
  algorithm: SortingAlgorithm
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
  // Show last 20 data points or all if less
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

export function StatisticsPanel({ steps, currentStepIndex, algorithm }: StatisticsPanelProps) {
  const algorithmInfo = sortingAlgorithmInfo[algorithm]
  
  // Calculate cumulative comparisons and swaps at each step
  const { comparisons, swaps, comparisonHistory, swapHistory, totalComparisons, totalSwaps } = useMemo(() => {
    let compCount = 0
    let swapCount = 0
    const compHistory: number[] = []
    const swapHistory: number[] = []
    
    steps.forEach((step) => {
      if (step.comparing.length > 0) compCount++
      if (step.swapping.length > 0) swapCount++
      compHistory.push(compCount)
      swapHistory.push(swapCount)
    })
    
    // Current values at this step
    const currentComparisons = currentStepIndex >= 0 ? compHistory[currentStepIndex] || 0 : 0
    const currentSwaps = currentStepIndex >= 0 ? swapHistory[currentStepIndex] || 0 : 0
    
    return {
      comparisons: currentComparisons,
      swaps: currentSwaps,
      comparisonHistory: compHistory,
      swapHistory: swapHistory,
      totalComparisons: compCount,
      totalSwaps: swapCount,
    }
  }, [steps, currentStepIndex])

  // Per-step comparison/swap counts for mini charts
  const perStepComparisons = useMemo(() => {
    return steps.map((step) => (step.comparing.length > 0 ? 1 : 0))
  }, [steps])

  const perStepSwaps = useMemo(() => {
    return steps.map((step) => (step.swapping.length > 0 ? 1 : 0))
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
          label="Comparisons"
          value={comparisons}
          maxValue={totalComparisons}
          color="bg-comparing"
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricBar
          label="Swaps"
          value={swaps}
          maxValue={totalSwaps}
          color="bg-swapping"
          icon={<ArrowLeftRight className="h-4 w-4" />}
        />
      </div>

      {/* Mini bar charts */}
      <div className="pt-2 border-t border-border/50 space-y-3">
        <MiniBarChart
          data={perStepComparisons}
          maxValue={1}
          label="Comparisons per step"
          currentIndex={currentStepIndex}
        />
        <MiniBarChart
          data={perStepSwaps}
          maxValue={1}
          label="Swaps per step"
          currentIndex={currentStepIndex}
        />
      </div>

      {/* Summary stats */}
      <div className="pt-2 border-t border-border/50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-secondary/30 p-2 text-center">
            <div className="text-muted-foreground">Steps</div>
            <div className="font-mono font-medium text-foreground">
              {currentStepIndex + 1} / {steps.length}
            </div>
          </div>
          <div className="rounded-lg bg-secondary/30 p-2 text-center">
            <div className="text-muted-foreground">Efficiency</div>
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
