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
        description: `Comparing ${array[j]} and ${array[j + 1]}`,
        codeLineHighlight: 3,
      }

      if (array[j] > array[j + 1]) {
        yield {
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          pivot: null,
          description: `Swapping ${array[j]} and ${array[j + 1]}`,
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
      description: `Dividing array (${start}-${end})`,
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

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        array[k] = left[i++]
      } else {
        array[k] = right[j++]
      }

      yield {
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted],
        pivot: null,
        description: `Placed ${array[k]} at index ${k}`,
        codeLineHighlight: 6,
      }
      k++
    }

    while (i < left.length) {
      array[k++] = left[i++]
    }

    while (j < right.length) {
      array[k++] = right[j++]
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
      const p = yield* partition(low, high)
      yield* quickSortHelper(low, p - 1)
      yield* quickSortHelper(p + 1, high)
    } else if (low === high) {
      sorted.push(low)
    }
  }

  function* partition(low: number, high: number): Generator<SortingStep, number> {
    const pivot = array[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      if (array[j] < pivot) {
        i++
        ;[array[i], array[j]] = [array[j], array[i]]
      }
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

    if (left < size && array[left] > array[largest]) {
      largest = left
    }

    if (right < size && array[right] > array[largest]) {
      largest = right
    }

    if (largest !== root) {
      ;[array[root], array[largest]] = [array[largest], array[root]]
      yield* heapify(size, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i)
  }

  for (let i = n - 1; i > 0; i--) {
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

// Selector
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