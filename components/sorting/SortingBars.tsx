'use client'

import { cn } from '@/lib/utils'
import { SortingStep } from '@/algorithms/sorting'

type SortingBarsProps = {
  array: number[]
  step: SortingStep | null
  maxValue: number
}

export function SortingBars({ array, step, maxValue }: SortingBarsProps) {
  const getBarColor = (index: number) => {
    if (!step) return 'from-primary/60 to-primary'
    
    if (step.sorted.includes(index)) {
      return 'from-sorted/80 to-sorted'
    }
    if (step.pivot === index) {
      return 'from-pivot/80 to-pivot animate-pulse-glow'
    }
    if (step.swapping.includes(index)) {
      return 'from-swapping/80 to-swapping animate-pulse-glow'
    }
    if (step.comparing.includes(index)) {
      return 'from-comparing/80 to-comparing animate-pulse-glow'
    }
    return 'from-primary/40 to-primary/60'
  }

  const displayArray = step?.array || array

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex h-64 items-end justify-center gap-1">
        {displayArray.map((value, index) => {
          const heightPercent = (value / maxValue) * 100
          const barColor = getBarColor(index)
          
          return (
            <div
              key={index}
              className="relative flex flex-col items-center"
              style={{ 
                width: `${Math.max(100 / displayArray.length - 1, 8)}%`,
                maxWidth: '40px'
              }}
            >
              <div
                className={cn(
                  'w-full rounded-t-lg bg-gradient-to-t bar-transition',
                  barColor
                )}
                style={{ height: `${heightPercent}%` }}
              >
                {displayArray.length <= 20 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-foreground">
                    {value}
                  </span>
                )}
              </div>
              {displayArray.length <= 30 && (
                <span className="mt-2 text-xs text-muted-foreground font-mono">
                  {index}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
