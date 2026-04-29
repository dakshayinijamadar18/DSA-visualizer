'use client'

import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

type ControlPanelProps = {
  isPlaying: boolean
  canStepBack: boolean
  canStepForward: boolean
  speed: number
  currentStep: number
  totalSteps: number
  onPlay: () => void
  onPause: () => void
  onStepForward: () => void
  onStepBack: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
}

export function ControlPanel({
  isPlaying,
  canStepBack,
  canStepForward,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
}: ControlPanelProps) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex flex-col gap-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono text-foreground">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-10 w-10 rounded-full hover:bg-secondary"
          >
            <RotateCcw className="h-5 w-5" />
            <span className="sr-only">Reset</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStepBack}
            disabled={!canStepBack}
            className="h-10 w-10 rounded-full hover:bg-secondary disabled:opacity-30"
          >
            <SkipBack className="h-5 w-5" />
            <span className="sr-only">Step Back</span>
          </Button>
          <Button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!canStepForward && !isPlaying}
            className={cn(
              'h-14 w-14 rounded-full transition-all',
              isPlaying
                ? 'bg-destructive hover:bg-destructive/80'
                : 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
            )}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStepForward}
            disabled={!canStepForward}
            className="h-10 w-10 rounded-full hover:bg-secondary disabled:opacity-30"
          >
            <SkipForward className="h-5 w-5" />
            <span className="sr-only">Step Forward</span>
          </Button>
        </div>

        {/* Speed control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Speed</span>
            <span className="font-mono text-foreground">{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([v]) => onSpeedChange(v)}
            min={0.25}
            max={4}
            step={0.25}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-primary [&_[role=slider]]:to-accent"
          />
        </div>
      </div>
    </div>
  )
}
