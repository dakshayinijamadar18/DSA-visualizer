export type SortingStep = {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  pivot: number | null
  description: string
  codeLineHighlight: number
}

export type SortingAlgorithm = 'bubble' | 'merge' | 'quick' | 'heap'

// Bubble Sort
export function* bubbleSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        pivot: null,
        description: `Comparing elements at index ${j} (${array[j]}) and ${j + 1} (${array[j + 1]})`,
        codeLineHighlight: 3,
      }

      if (array[j] > array[j + 1]) {
        yield {
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          pivot: null,
          description: `Swapping ${array[j]} and ${array[j + 1]} since ${array[j]} > ${array[j + 1]}`,
          codeLineHighlight: 4,
        }
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
      }
    }
    sorted.unshift(n - 1 - i)
  }

  sorted.unshift(0)
  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    pivot: null,
    description: 'Array is now sorted!',
    codeLineHighlight: 7,
  }
}

// Merge Sort
export function* mergeSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr]
  const sorted: number[] = []
  
  function* mergeSortHelper(start: number, end: number): Generator<SortingStep> {
    if (start >= end) return

    const mid = Math.floor((start + end) / 2)
    
    yield {
      array: [...array],
      comparing: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      swapping: [],
      sorted: [...sorted],
      pivot: mid,
      description: `Dividing array from index ${start} to ${end}, mid point at ${mid}`,
      codeLineHighlight: 2,
    }

    yield* mergeSortHelper(start, mid)
    yield* mergeSortHelper(mid + 1, end)
    yield* merge(start, mid, end)
  }

  function* merge(start: number, mid: number, end: number): Generator<SortingStep> {
    const left = array.slice(start, mid + 1)
    const right = array.slice(mid + 1, end + 1)
    let i = 0, j = 0, k = start

    yield {
      array: [...array],
      comparing: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
      swapping: [],
      sorted: [...sorted],
      pivot: null,
      description: `Merging subarrays [${left.join(', ')}] and [${right.join(', ')}]`,
      codeLineHighlight: 5,
    }

    while (i < left.length && j < right.length) {
      yield {
        array: [...array],
        comparing: [start + i, mid + 1 + j],
        swapping: [],
        sorted: [...sorted],
        pivot: null,
        description: `Comparing ${left[i]} and ${right[j]}`,
        codeLineHighlight: 6,
      }

      if (left[i] <= right[j]) {
        array[k] = left[i]
        i++
      } else {
        array[k] = right[j]
        j++
      }
      
      yield {
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted],
        pivot: null,
        description: `Placed ${array[k]} at index ${k}`,
        codeLineHighlight: 7,
      }
      k++
    }

    while (i < left.length) {
      array[k] = left[i]
      yield {
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted],
        pivot: null,
        description: `Placed remaining element ${array[k]} at index ${k}`,
        codeLineHighlight: 8,
      }
      i++
      k++
    }

    while (j < right.length) {
      array[k] = right[j]
      yield {
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted],
        pivot: null,
        description: `Placed remaining element ${array[k]} at index ${k}`,
        codeLineHighlight: 8,
      }
      j++
      k++
    }
  }

  yield* mergeSortHelper(0, array.length - 1)

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    pivot: null,
    description: 'Array is now sorted!',
    codeLineHighlight: 10,
  }
}

// Quick Sort
export function* quickSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr]
  const sorted: number[] = []

  function* quickSortHelper(low: number, high: number): Generator<SortingStep> {
    if (low < high) {
      const pivotResult = yield* partition(low, high)
      yield* quickSortHelper(low, pivotResult - 1)
      yield* quickSortHelper(pivotResult + 1, high)
    } else if (low === high) {
      sorted.push(low)
    }
  }

  function* partition(low: number, high: number): Generator<SortingStep, number> {
    const pivot = array[high]
    
    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      pivot: high,
      description: `Selecting pivot element ${pivot} at index ${high}`,
      codeLineHighlight: 3,
    }

    let i = low - 1

    for (let j = low; j < high; j++) {
      yield {
        array: [...array],
        comparing: [j, high],
        swapping: [],
        sorted: [...sorted],
        pivot: high,
        description: `Comparing ${array[j]} with pivot ${pivot}`,
        codeLineHighlight: 5,
      }

      if (array[j] < pivot) {
        i++
        if (i !== j) {
          yield {
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
            pivot: high,
            description: `Swapping ${array[i]} and ${array[j]}`,
            codeLineHighlight: 6,
          }
          ;[array[i], array[j]] = [array[j], array[i]]
        }
      }
    }

    yield {
      array: [...array],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [...sorted],
      pivot: high,
      description: `Placing pivot ${pivot} at correct position ${i + 1}`,
      codeLineHighlight: 7,
    }
    ;[array[i + 1], array[high]] = [array[high], array[i + 1]]
    
    sorted.push(i + 1)
    return i + 1
  }

  yield* quickSortHelper(0, array.length - 1)

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    pivot: null,
    description: 'Array is now sorted!',
    codeLineHighlight: 9,
  }
}

// Heap Sort
export function* heapSort(arr: number[]): Generator<SortingStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []

  function* heapify(size: number, root: number): Generator<SortingStep> {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < size) {
      yield {
        array: [...array],
        comparing: [largest, left],
        swapping: [],
        sorted: [...sorted],
        pivot: root,
        description: `Comparing ${array[largest]} with left child ${array[left]}`,
        codeLineHighlight: 4,
      }
      if (array[left] > array[largest]) {
        largest = left
      }
    }

    if (right < size) {
      yield {
        array: [...array],
        comparing: [largest, right],
        swapping: [],
        sorted: [...sorted],rmdir /s /q .git
        pivot: root,
        description: `Comparing ${array[largest]} with right child ${array[right]}`,
        codeLineHighlight: 5,
      }
      if (array[right] > array[largest]) {
        largest = right
      }
    }

    if (largest !== root) {
      yield {
        array: [...array],
        comparing: [],
        swapping: [root, largest],
        sorted: [...sorted],
        pivot: null,
        description: `Swapping ${array[root]} and ${array[largest]} to maintain heap property`,
        codeLineHighlight: 6,
      }
      ;[array[root], array[largest]] = [array[largest], array[root]]
      yield* heapify(size, largest)
    }
  }

  // Build max heap
  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    pivot: null,
    description: 'Building max heap from the array',
    codeLineHighlight: 2,
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i)
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    yield {
      array: [...array],
      comparing: [],
      swapping: [0, i],
      sorted: [...sorted],
      pivot: null,
      description: `Moving max element ${array[0]} to position ${i}`,
      codeLineHighlight: 8,
    }
    ;[array[0], array[i]] = [array[i], array[0]]
    sorted.unshift(i)
    yield* heapify(i, 0)
  }

  sorted.unshift(0)
  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    pivot: null,
    description: 'Array is now sorted!',
    codeLineHighlight: 10,
  }
}

export function getSortingGenerator(algorithm: SortingAlgorithm, array: number[]) {
  switch (algorithm) {
    case 'bubble':
      return bubbleSort(array)
    case 'merge':
      return mergeSort(array)
    case 'quick':
      return quickSort(array)
    case 'heap':
      return heapSort(array)
    default:
      return bubbleSort(array)
  }
}
