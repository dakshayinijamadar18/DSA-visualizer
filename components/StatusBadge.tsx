'use client'

import { cn } from '@/lib/utils'

type StatusBadgeProps = {
  status: 'idle' | 'comparing' | 'swapping' | 'sorted' | 'visiting' | 'visited' | 'path'
}

const statusConfig = {
  idle: {
    label: 'Ready',
    className: 'bg-secondary text-secondary-foreground',
  },
  comparing: {
    label: 'Comparing',
    className: 'bg-comparing text-white animate-pulse',
  },
  swapping: {
    label: 'Swapping',
    className: 'bg-swapping text-black animate-pulse',
  },
  sorted: {
    label: 'Sorted',
    className: 'bg-sorted text-white',
  },
  visiting: {
    label: 'Visiting',
    className: 'bg-visiting text-white animate-pulse',
  },
  visited: {
    label: 'Visited',
    className: 'bg-visited text-white',
  },
  path: {
    label: 'Path Found',
    className: 'bg-path text-white',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300',
        config.className
      )}
    >
      <span className={cn(
        'h-2 w-2 rounded-full',
        status === 'idle' ? 'bg-muted-foreground' : 'bg-current'
      )} />
      {config.label}
    </span>
  )
}

export function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-comparing" />
        <span className="text-muted-foreground">Comparing</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-swapping" />
        <span className="text-muted-foreground">Swapping</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-sorted" />
        <span className="text-muted-foreground">Sorted</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-pivot" />
        <span className="text-muted-foreground">Pivot</span>
      </div>
    </div>
  )
}
