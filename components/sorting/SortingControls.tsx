'use client'

import { useState } from 'react'
import { Shuffle, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SortingAlgorithm } from '@/algorithms/sorting'
import { generateRandomArray, parseCustomArray } from '@/utils/arrayUtils'

type SortingControlsProps = {
  algorithm: SortingAlgorithm
  arraySize: number
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void
  onArrayChange: (array: number[]) => void
  onSizeChange: (size: number) => void
  disabled?: boolean
}

const algorithms: { id: SortingAlgorithm; name: string }[] = [
  { id: 'bubble', name: 'Bubble Sort' },
  { id: 'merge', name: 'Merge Sort' },
  { id: 'quick', name: 'Quick Sort' },
  { id: 'heap', name: 'Heap Sort' },
]

const sizes = [8, 15, 25, 40]

export function SortingControls({
  algorithm,
  arraySize,
  onAlgorithmChange,
  onArrayChange,
  onSizeChange,
  disabled,
}: SortingControlsProps) {
  const [customInput, setCustomInput] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRandomize = () => {
    const newArray = generateRandomArray(arraySize)
    onArrayChange(newArray)
    setError(null)
  }

  const handleCustomSubmit = () => {
    const parsed = parseCustomArray(customInput)
    if (parsed) {
      onArrayChange(parsed)
      onSizeChange(parsed.length)
      setShowCustomInput(false)
      setCustomInput('')
      setError(null)
    } else {
      setError('Invalid input. Enter 2-50 numbers separated by commas.')
    }
  }

  return (
    <div className="glass-card rounded-2xl p-4 space-y-4">
      {/* Algorithm Selection */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Algorithm</label>
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => onAlgorithmChange(algo.id)}
              disabled={disabled}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                algorithm === algo.id
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                  : 'bg-secondary/50 text-foreground hover:bg-secondary disabled:opacity-50'
              )}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Array Size */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Array Size</label>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                onSizeChange(size)
                onArrayChange(generateRandomArray(size))
              }}
              disabled={disabled}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                arraySize === size
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-foreground hover:bg-secondary disabled:opacity-50'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Array Generation */}
      <div className="flex gap-2">
        <Button
          onClick={handleRandomize}
          disabled={disabled}
          variant="secondary"
          className="flex-1"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Randomize
        </Button>
        <Button
          onClick={() => setShowCustomInput(!showCustomInput)}
          disabled={disabled}
          variant="outline"
          className="flex-1"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Custom
        </Button>
      </div>

      {/* Custom Input */}
      {showCustomInput && (
        <div className="space-y-2">
          <Input
            placeholder="Enter numbers: 5, 2, 8, 1, 9"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={disabled}
            className="bg-secondary/50 border-border"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button
            onClick={handleCustomSubmit}
            disabled={disabled || !customInput}
            size="sm"
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}
