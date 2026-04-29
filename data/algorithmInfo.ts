import { SortingAlgorithm } from '@/algorithms/sorting'
import { GraphAlgorithm } from '@/algorithms/graph'

export type AlgorithmInfo = {
  name: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  description: string
  steps: string[]
  cppCode: string
  javaCode: string
}

export const sortingAlgorithmInfo: Record<SortingAlgorithm, AlgorithmInfo> = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    steps: [
      'Start from the first element',
      'Compare adjacent elements',
      'Swap if left element is greater than right',
      'Move to next pair and repeat',
      'After each pass, largest element bubbles to the end',
      'Repeat until no swaps are needed',
    ],
    cppCode: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    javaCode: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.',
    steps: [
      'Divide the array into two halves',
      'Recursively sort the left half',
      'Recursively sort the right half',
      'Merge the two sorted halves',
      'Compare elements from both halves',
      'Place smaller element first',
      'Continue until all elements are merged',
    ],
    cppCode: `void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int i = 0; i < n2; i++) R[i] = arr[m + 1 + i];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    javaCode: `void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1, n2 = r - m;
    int[] L = new int[n1], R = new int[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int i = 0; i < n2; i++) R[i] = arr[m + 1 + i];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
  },
  quick: {
    name: 'Quick Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    description: 'Quick Sort picks a pivot element and partitions the array around it, placing smaller elements to the left and larger elements to the right, then recursively sorts the partitions.',
    steps: [
      'Choose a pivot element (usually last)',
      'Partition array around pivot',
      'Elements smaller than pivot go left',
      'Elements larger than pivot go right',
      'Place pivot in correct position',
      'Recursively sort left and right partitions',
    ],
    cppCode: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            swap(arr[++i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    javaCode: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
  },
  heap: {
    name: 'Heap Sort',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(1)',
    description: 'Heap Sort builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end, reducing the heap size each time.',
    steps: [
      'Build a max heap from the array',
      'The largest element is at the root',
      'Swap root with last element',
      'Reduce heap size by one',
      'Heapify the root to maintain heap property',
      'Repeat until heap size is 1',
    ],
    cppCode: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
    javaCode: `void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        heapify(arr, n, largest);
    }
}

void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
  },
}

export const graphAlgorithmInfo: Record<GraphAlgorithm, AlgorithmInfo> = {
  bfs: {
    name: 'Breadth-First Search',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
    description: 'BFS explores all vertices at the current depth before moving to vertices at the next depth level. It uses a queue to keep track of vertices to visit.',
    steps: [
      'Start from the source vertex',
      'Mark it as visited and enqueue it',
      'Dequeue a vertex and process it',
      'Enqueue all unvisited neighbors',
      'Repeat until queue is empty',
      'Guarantees shortest path in unweighted graphs',
    ],
    cppCode: `void BFS(vector<int> adj[], int V, int s) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[s] = true;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        cout << u << " ";
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
    javaCode: `void BFS(List<List<Integer>> adj, int V, int s) {
    boolean[] visited = new boolean[V];
    Queue<Integer> queue = new LinkedList<>();
    visited[s] = true;
    queue.add(s);
    while (!queue.isEmpty()) {
        int u = queue.poll();
        System.out.print(u + " ");
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true;
                queue.add(v);
            }
        }
    }
}`,
  },
  dfs: {
    name: 'Depth-First Search',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
    description: 'DFS explores as far as possible along each branch before backtracking. It uses a stack (or recursion) to keep track of vertices.',
    steps: [
      'Start from the source vertex',
      'Mark it as visited',
      'Visit an unvisited neighbor',
      'Recursively apply DFS to the neighbor',
      'Backtrack when no unvisited neighbors',
      'Continue until all reachable vertices are visited',
    ],
    cppCode: `void DFS(vector<int> adj[], int V, int s, 
         vector<bool>& visited) {
    visited[s] = true;
    cout << s << " ";
    for (int v : adj[s]) {
        if (!visited[v]) {
            DFS(adj, V, v, visited);
        }
    }
}`,
    javaCode: `void DFS(List<List<Integer>> adj, int s, 
         boolean[] visited) {
    visited[s] = true;
    System.out.print(s + " ");
    for (int v : adj.get(s)) {
        if (!visited[v]) {
            DFS(adj, v, visited);
        }
    }
}`,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    timeComplexity: {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O((V + E) log V)',
    },
    spaceComplexity: 'O(V)',
    description: "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative edge weights.",
    steps: [
      'Set distance to source as 0, others as infinity',
      'Create a priority queue with source',
      'Extract vertex with minimum distance',
      'For each neighbor, calculate new distance',
      'If new distance is smaller, update it',
      'Repeat until all vertices are processed',
    ],
    cppCode: `void dijkstra(vector<pair<int,int>> adj[], 
             int V, int src) {
    priority_queue<pair<int,int>, 
        vector<pair<int,int>>, 
        greater<pair<int,int>>> pq;
    vector<int> dist(V, INT_MAX);
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}`,
    javaCode: `void dijkstra(List<List<int[]>> adj, 
             int V, int src) {
    PriorityQueue<int[]> pq = 
        new PriorityQueue<>((a,b) -> a[0] - b[0]);
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    pq.add(new int[]{0, src});
    while (!pq.isEmpty()) {
        int u = pq.poll()[1];
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.add(new int[]{dist[v], v});
            }
        }
    }
}`,
  },
}
