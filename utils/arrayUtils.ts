export function generateRandomArray(size: number, min: number = 5, max: number = 100): number[] {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

export function parseCustomArray(input: string): number[] | null {
  try {
    const numbers = input
      .split(/[,\s]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => parseInt(s, 10))
    
    if (numbers.some(isNaN)) {
      return null
    }
    
    if (numbers.length < 2 || numbers.length > 50) {
      return null
    }
    
    return numbers
  } catch {
    return null
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}
