import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
//  GLOBAL CSS (keyframes, glassmorphism, custom scrollbars, etc.)
// ═══════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    height: 100%;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #05050f;
    color: #e8e8f0;
    overflow: hidden;
  }

  /* ── Animated blobs ── */
  @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(50px,-40px) scale(1.08)} 66%{transform:translate(-30px,30px) scale(0.94)} }
  @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-40px,50px) scale(1.06)} 66%{transform:translate(35px,-25px) scale(0.96)} }
  @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1.04)} 50%{transform:translate(25px,-35px) scale(0.97)} }

  .blob1 { animation: blob1 12s ease-in-out infinite; }
  .blob2 { animation: blob2 15s ease-in-out infinite; }
  .blob3 { animation: blob3 18s ease-in-out infinite; }

  /* ── Fade / slide entrances ── */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  @keyframes gradPan  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .anim-fadeup  { animation: fadeUp  0.45s ease both; }
  .anim-fadein  { animation: fadeUp  0.35s ease both; }
  .anim-scalein { animation: scaleIn 0.35s ease both; }

  /* ── Glassmorphism ── */
  .glass {
    background: rgba(12, 12, 32, 0.55);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .glass-card {
    background: rgba(16, 16, 42, 0.52);
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
  }
  .glass-nav {
    background: rgba(6, 6, 20, 0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .glass-pill {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* ── Buttons ── */
  .btn { cursor:pointer; border:none; font-family:'Outfit',sans-serif; font-weight:500; transition:all 0.2s ease; display:inline-flex; align-items:center; gap:6px; }
  .btn:disabled { opacity:0.45; cursor:not-allowed; transform:none !important; }

  .btn-primary {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #fff; border-radius: 10px; padding: 9px 20px; font-size: 13.5px;
    box-shadow: 0 2px 16px rgba(99,102,241,0.28);
  }
  .btn-primary:hover:not(:disabled) { filter:brightness(1.15); transform:translateY(-1px); box-shadow:0 6px 24px rgba(99,102,241,0.45); }
  .btn-primary:active:not(:disabled) { transform:translateY(0); }

  .btn-secondary {
    background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 18px; font-size: 13.5px;
  }
  .btn-secondary:hover:not(:disabled) { background:rgba(255,255,255,0.11); transform:translateY(-1px); }

  .btn-success {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: #fff; border-radius: 10px; padding: 9px 20px; font-size: 13.5px;
    box-shadow: 0 2px 12px rgba(16,185,129,0.25);
  }
  .btn-success:hover:not(:disabled) { filter:brightness(1.12); transform:translateY(-1px); }

  .btn-danger {
    background: rgba(239,68,68,0.12); color: #f87171;
    border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 9px 18px; font-size: 13.5px;
  }
  .btn-danger:hover:not(:disabled) { background:rgba(239,68,68,0.2); transform:translateY(-1px); }

  .btn-icon { padding:8px; border-radius:8px; }

  /* ── Custom range slider ── */
  input[type=range] { -webkit-appearance:none; appearance:none; background:transparent; cursor:pointer; width:100%; }
  input[type=range]::-webkit-slider-runnable-track { background:rgba(255,255,255,0.1); height:4px; border-radius:2px; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:linear-gradient(135deg,#4f46e5,#7c3aed); margin-top:-6px; box-shadow:0 0 10px rgba(99,102,241,0.6); }
  input[type=range]::-moz-range-track { background:rgba(255,255,255,0.1); height:4px; border-radius:2px; }
  input[type=range]::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:linear-gradient(135deg,#4f46e5,#7c3aed); border:none; box-shadow:0 0 10px rgba(99,102,241,0.6); }

  /* ── Custom select ── */
  select { appearance:none; -webkit-appearance:none; cursor:pointer; outline:none; font-family:'Outfit',sans-serif; }
  select option { background:#0f0f2e; color:#e8e8f0; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.35); border-radius:2px; }

  /* ── Bar animation ── */
  @keyframes comparePulse { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.4)} }
  .bar-comparing { animation: comparePulse 0.35s ease-in-out infinite; }

  /* ── Code block ── */
  .code-block {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 11.5px; line-height: 1.75; tab-size: 2;
    white-space: pre; overflow-x: auto; overflow-y: auto;
  }

  /* ── Node pulse animation ── */
  @keyframes nodePulse { 0%,100%{opacity:0.85;r:16} 50%{opacity:1;r:19} }
  .node-current circle { animation: nodePulse 0.6s ease-in-out infinite; }

  /* ── Tab active ── */
  .tab-btn { cursor:pointer; border:none; font-family:'Outfit',sans-serif; transition:all 0.2s ease; }
  .tab-active-sort { background:linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.25)); color:#a78bfa; border-color:rgba(99,102,241,0.4) !important; }
  .tab-active-graph { background:linear-gradient(135deg,rgba(20,184,166,0.2),rgba(6,182,212,0.2)); color:#5eead4; border-color:rgba(20,184,166,0.4) !important; }
  .tab-active-compare { background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(251,191,36,0.2)); color:#fcd34d; border-color:rgba(245,158,11,0.4) !important; }

  /* ── Glow text ── */
  .glow-text {
    background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #60a5fa 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: gradPan 4s linear infinite;
  }

  /* ── Complexity badges ── */
  .badge-good  { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.25); }
  .badge-avg   { background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.25); }
  .badge-bad   { background:rgba(239,68,68,0.15);  color:#f87171; border:1px solid rgba(239,68,68,0.25); }
  .badge-info  { background:rgba(99,102,241,0.15); color:#818cf8; border:1px solid rgba(99,102,241,0.25); }
`;

// ═══════════════════════════════════════════════════════════════
//  SORTING ALGORITHM STEP GENERATORS
// ═══════════════════════════════════════════════════════════════

function genBubbleSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const sorted = new Set();
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ arr: [...a], comparing: [j, j + 1], sorted: new Set(sorted) });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ arr: [...a], swapped: [j, j + 1], sorted: new Set(sorted) });
      }
    }
    sorted.add(n - 1 - i);
  }
  sorted.add(0);
  steps.push({ arr: [...a], sorted: new Set(Array.from({ length: n }, (_, k) => k)), done: true });
  return steps;
}

function genMergeSort(arr) {
  const steps = [];
  const a = [...arr];
  function merge(l, m, r) {
    const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < L.length && j < R.length) {
      steps.push({ arr: [...a], comparing: [l + i, m + 1 + j], sorted: new Set() });
      if (L[i] <= R[j]) a[k++] = L[i++];
      else a[k++] = R[j++];
      steps.push({ arr: [...a], merging: [k - 1], sorted: new Set() });
    }
    while (i < L.length) { a[k++] = L[i++]; steps.push({ arr: [...a], merging: [k - 1], sorted: new Set() }); }
    while (j < R.length) { a[k++] = R[j++]; steps.push({ arr: [...a], merging: [k - 1], sorted: new Set() }); }
  }
  function ms(l, r) {
    if (l < r) { const m = (l + r) >> 1; ms(l, m); ms(m + 1, r); merge(l, m, r); }
  }
  ms(0, a.length - 1);
  steps.push({ arr: [...a], sorted: new Set(Array.from({ length: a.length }, (_, k) => k)), done: true });
  return steps;
}

function genQuickSort(arr) {
  const steps = [];
  const a = [...arr];
  function partition(lo, hi) {
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      steps.push({ arr: [...a], comparing: [j, hi], pivot: hi, sorted: new Set() });
      if (a[j] <= pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; steps.push({ arr: [...a], swapped: [i, j], pivot: hi, sorted: new Set() }); }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    steps.push({ arr: [...a], swapped: [i + 1, hi], sorted: new Set([i + 1]), pivot: i + 1 });
    return i + 1;
  }
  function qs(lo, hi) { if (lo < hi) { const p = partition(lo, hi); qs(lo, p - 1); qs(p + 1, hi); } }
  qs(0, a.length - 1);
  steps.push({ arr: [...a], sorted: new Set(Array.from({ length: a.length }, (_, k) => k)), done: true });
  return steps;
}

function genHeapSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const sorted = new Set();
  function heapify(sz, i) {
    let lg = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < sz) { steps.push({ arr: [...a], comparing: [l, lg], sorted: new Set(sorted) }); if (a[l] > a[lg]) lg = l; }
    if (r < sz) { steps.push({ arr: [...a], comparing: [r, lg], sorted: new Set(sorted) }); if (a[r] > a[lg]) lg = r; }
    if (lg !== i) { [a[i], a[lg]] = [a[lg], a[i]]; steps.push({ arr: [...a], swapped: [i, lg], sorted: new Set(sorted) }); heapify(sz, lg); }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    steps.push({ arr: [...a], swapped: [0, i], sorted: new Set(sorted) });
    heapify(i, 0);
  }
  sorted.add(0);
  steps.push({ arr: [...a], sorted: new Set(Array.from({ length: n }, (_, k) => k)), done: true });
  return steps;
}

const SORT_GENERATORS = {
  "Bubble Sort": genBubbleSort,
  "Merge Sort": genMergeSort,
  "Quick Sort": genQuickSort,
  "Heap Sort": genHeapSort,
};

// ═══════════════════════════════════════════════════════════════
//  GRAPH SETUP + GRAPH ALGORITHM STEP GENERATORS
// ═══════════════════════════════════════════════════════════════

const DEFAULT_GRAPH = {
  nodes: [
    { id: 0, x: 310, y: 80,  label: "A" },
    { id: 1, x: 160, y: 200, label: "B" },
    { id: 2, x: 460, y: 200, label: "C" },
    { id: 3, x: 80,  y: 340, label: "D" },
    { id: 4, x: 255, y: 340, label: "E" },
    { id: 5, x: 390, y: 340, label: "F" },
    { id: 6, x: 550, y: 340, label: "G" },
  ],
  edges: [
    { u: 0, v: 1, w: 4 }, { u: 0, v: 2, w: 2 },
    { u: 1, v: 3, w: 5 }, { u: 1, v: 4, w: 1 },
    { u: 2, v: 4, w: 8 }, { u: 2, v: 5, w: 10 }, { u: 2, v: 6, w: 6 },
    { u: 3, v: 4, w: 3 }, { u: 5, v: 6, w: 7 },
  ],
};

function getNeighbors(graph, nodeId) {
  const nbrs = [];
  for (const e of graph.edges) {
    if (e.u === nodeId) nbrs.push({ id: e.v, w: e.w });
    else if (e.v === nodeId) nbrs.push({ id: e.u, w: e.w });
  }
  return nbrs;
}

function genBFS(graph, start) {
  const steps = [];
  const visited = new Set([start]);
  const queue = [start];
  const path = [];
  const activeEdges = new Set();
  while (queue.length) {
    const node = queue.shift();
    path.push(node);
    steps.push({ visited: new Set(visited), current: node, path: [...path], queue: [...queue], activeEdges: new Set(activeEdges), distances: {} });
    for (const { id } of getNeighbors(graph, node)) {
      if (!visited.has(id)) {
        visited.add(id);
        queue.push(id);
        activeEdges.add(`${Math.min(node, id)}-${Math.max(node, id)}`);
        steps.push({ visited: new Set(visited), current: node, exploring: id, path: [...path], queue: [...queue], activeEdges: new Set(activeEdges), distances: {} });
      }
    }
  }
  return steps;
}

function genDFS(graph, start) {
  const steps = [];
  const visited = new Set();
  const path = [];
  const activeEdges = new Set();
  function dfs(node, parent) {
    visited.add(node);
    path.push(node);
    if (parent !== null) activeEdges.add(`${Math.min(node, parent)}-${Math.max(node, parent)}`);
    steps.push({ visited: new Set(visited), current: node, path: [...path], activeEdges: new Set(activeEdges), distances: {} });
    for (const { id } of getNeighbors(graph, node)) {
      if (!visited.has(id)) {
        steps.push({ visited: new Set(visited), current: node, exploring: id, path: [...path], activeEdges: new Set(activeEdges), distances: {} });
        dfs(id, node);
      }
    }
  }
  dfs(start, null);
  return steps;
}

function genDijkstra(graph, start) {
  const steps = [];
  const dist = {};
  const visited = new Set();
  const activeEdges = new Set();
  graph.nodes.forEach(n => { dist[n.id] = n.id === start ? 0 : Infinity; });
  for (let iter = 0; iter < graph.nodes.length; iter++) {
    let u = -1;
    for (const n of graph.nodes) {
      if (!visited.has(n.id) && (u === -1 || dist[n.id] < dist[u])) u = n.id;
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited.add(u);
    steps.push({ visited: new Set(visited), current: u, distances: { ...dist }, activeEdges: new Set(activeEdges), path: [], exploring: -1 });
    for (const { id, w } of getNeighbors(graph, u)) {
      if (!visited.has(id) && dist[u] + w < dist[id]) {
        dist[id] = dist[u] + w;
        activeEdges.add(`${Math.min(u, id)}-${Math.max(u, id)}`);
        steps.push({ visited: new Set(visited), current: u, relaxed: id, distances: { ...dist }, activeEdges: new Set(activeEdges), path: [], exploring: id });
      }
    }
  }
  return steps;
}

const GRAPH_GENERATORS = { "BFS": genBFS, "DFS": genDFS, "Dijkstra's": genDijkstra };

// ═══════════════════════════════════════════════════════════════
//  COMPLEXITY DATA
// ═══════════════════════════════════════════════════════════════

const COMPLEXITY = {
  "Bubble Sort":  { avg: "O(n²)",      best: "O(n)",         worst: "O(n²)",           space: "O(1)",     stable: true,  avgClass: "badge-bad",  bestClass: "badge-avg",  worstClass: "badge-bad"  },
  "Merge Sort":   { avg: "O(n log n)", best: "O(n log n)",   worst: "O(n log n)",      space: "O(n)",     stable: true,  avgClass: "badge-avg",  bestClass: "badge-avg",  worstClass: "badge-avg"  },
  "Quick Sort":   { avg: "O(n log n)", best: "O(n log n)",   worst: "O(n²)",           space: "O(log n)", stable: false, avgClass: "badge-avg",  bestClass: "badge-avg",  worstClass: "badge-bad"  },
  "Heap Sort":    { avg: "O(n log n)", best: "O(n log n)",   worst: "O(n log n)",      space: "O(1)",     stable: false, avgClass: "badge-avg",  bestClass: "badge-avg",  worstClass: "badge-avg"  },
  "BFS":          { avg: "O(V + E)",   best: "O(V + E)",     worst: "O(V + E)",        space: "O(V)",     stable: true,  avgClass: "badge-avg",  bestClass: "badge-avg",  worstClass: "badge-avg"  },
  "DFS":          { avg: "O(V + E)",   best: "O(V + E)",     worst: "O(V + E)",        space: "O(V)",     stable: true,  avgClass: "badge-avg",  bestClass: "badge-avg",  worstClass: "badge-avg"  },
  "Dijkstra's":   { avg: "O((V+E)logV)", best: "O(E log V)", worst: "O((V+E) log V)",  space: "O(V)",     stable: true,  avgClass: "badge-avg",  bestClass: "badge-avg",  worstClass: "badge-avg"  },
};

// ═══════════════════════════════════════════════════════════════
//  CODE SNIPPETS
// ═══════════════════════════════════════════════════════════════

const CODE = {
  "Bubble Sort": {
    cpp: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    bool swapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
        swapped = true;
      }
    }
    // Optimization: stop if no swap
    if (!swapped) break;
  }
}`,
    java: `void bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    boolean swapped = false;
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  },
  "Merge Sort": {
    cpp: `void merge(int arr[], int l, int m, int r) {
  int n1 = m - l + 1, n2 = r - m;
  vector<int> L(n1), R(n2);
  for (int i = 0; i < n1; i++) L[i] = arr[l + i];
  for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2)
    arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
  if (l >= r) return;
  int m = l + (r - l) / 2;
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}`,
    java: `void mergeSort(int[] arr, int l, int r) {
  if (l >= r) return;
  int m = l + (r - l) / 2;
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}

void merge(int[] arr, int l, int m, int r) {
  int[] L = Arrays.copyOfRange(arr, l, m + 1);
  int[] R = Arrays.copyOfRange(arr, m + 1, r + 1);
  int i = 0, j = 0, k = l;
  while (i < L.length && j < R.length)
    arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
  while (i < L.length) arr[k++] = L[i++];
  while (j < R.length) arr[k++] = R[j++];
}`,
  },
  "Quick Sort": {
    cpp: `int partition(int arr[], int lo, int hi) {
  int pivot = arr[hi], i = lo - 1;
  for (int j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      swap(arr[++i], arr[j]);
    }
  }
  swap(arr[i + 1], arr[hi]);
  return i + 1;
}

void quickSort(int arr[], int lo, int hi) {
  if (lo < hi) {
    int pi = partition(arr, lo, hi);
    quickSort(arr, lo, pi - 1);
    quickSort(arr, pi + 1, hi);
  }
}`,
    java: `int partition(int[] arr, int lo, int hi) {
  int pivot = arr[hi], i = lo - 1;
  for (int j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      int tmp = arr[++i];
      arr[i] = arr[j]; arr[j] = tmp;
    }
  }
  int tmp = arr[i + 1];
  arr[i + 1] = arr[hi]; arr[hi] = tmp;
  return i + 1;
}

void quickSort(int[] arr, int lo, int hi) {
  if (lo < hi) {
    int pi = partition(arr, lo, hi);
    quickSort(arr, lo, pi - 1);
    quickSort(arr, pi + 1, hi);
  }
}`,
  },
  "Heap Sort": {
    cpp: `void heapify(int arr[], int n, int i) {
  int largest = i;
  int l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    swap(arr[i], arr[largest]);
    heapify(arr, n, largest);
  }
}

void heapSort(int arr[], int n) {
  // Build max-heap
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  // Extract elements
  for (int i = n - 1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}`,
    java: `void heapify(int[] arr, int n, int i) {
  int largest = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    int tmp = arr[i];
    arr[i] = arr[largest]; arr[largest] = tmp;
    heapify(arr, n, largest);
  }
}

void heapSort(int[] arr) {
  int n = arr.length;
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (int i = n - 1; i > 0; i--) {
    int tmp = arr[0];
    arr[0] = arr[i]; arr[i] = tmp;
    heapify(arr, i, 0);
  }
}`,
  },
  "BFS": {
    cpp: `void bfs(vector<vector<int>>& adj, int start) {
  int n = adj.size();
  vector<bool> visited(n, false);
  queue<int> q;

  visited[start] = true;
  q.push(start);

  while (!q.empty()) {
    int node = q.front(); q.pop();
    cout << node << " ";

    for (int nbr : adj[node]) {
      if (!visited[nbr]) {
        visited[nbr] = true;
        q.push(nbr);
      }
    }
  }
}`,
    java: `void bfs(List<List<Integer>> adj, int start) {
  int n = adj.size();
  boolean[] visited = new boolean[n];
  Queue<Integer> q = new LinkedList<>();

  visited[start] = true;
  q.add(start);

  while (!q.isEmpty()) {
    int node = q.poll();
    System.out.print(node + " ");

    for (int nbr : adj.get(node)) {
      if (!visited[nbr]) {
        visited[nbr] = true;
        q.add(nbr);
      }
    }
  }
}`,
  },
  "DFS": {
    cpp: `void dfs(vector<vector<int>>& adj,
         vector<bool>& visited, int node) {
  visited[node] = true;
  cout << node << " ";

  for (int nbr : adj[node]) {
    if (!visited[nbr]) {
      dfs(adj, visited, nbr);
    }
  }
}

// Call: vector<bool> vis(n, false); dfs(adj, vis, 0);`,
    java: `void dfs(List<List<Integer>> adj,
         boolean[] visited, int node) {
  visited[node] = true;
  System.out.print(node + " ");

  for (int nbr : adj.get(node)) {
    if (!visited[nbr]) {
      dfs(adj, visited, nbr);
    }
  }
}

// Call: boolean[] vis = new boolean[n]; dfs(adj, vis, 0);`,
  },
  "Dijkstra's": {
    cpp: `vector<int> dijkstra(
    vector<pair<int,int>> adj[], int n, int src) {
  priority_queue<pair<int,int>,
    vector<pair<int,int>>, greater<>> pq;
  vector<int> dist(n, INT_MAX);

  dist[src] = 0;
  pq.push({0, src});

  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;

    for (auto [v, w] : adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push({dist[v], v});
      }
    }
  }
  return dist;
}`,
    java: `int[] dijkstra(List<int[]>[] adj, int n, int src) {
  int[] dist = new int[n];
  Arrays.fill(dist, Integer.MAX_VALUE);
  PriorityQueue<int[]> pq =
    new PriorityQueue<>((a, b) -> a[0] - b[0]);

  dist[src] = 0;
  pq.offer(new int[]{0, src});

  while (!pq.isEmpty()) {
    int[] cur = pq.poll();
    int d = cur[0], u = cur[1];
    if (d > dist[u]) continue;
    for (int[] e : adj[u]) {
      int v = e[0], w = e[1];
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.offer(new int[]{dist[v], v});
      }
    }
  }
  return dist;
}`,
  },
};

// ═══════════════════════════════════════════════════════════════
//  EXPLANATIONS
// ═══════════════════════════════════════════════════════════════

const EXPLANATIONS = {
  "Bubble Sort": {
    summary: "Repeatedly swaps adjacent elements that are in the wrong order, causing large elements to \"bubble\" to the end.",
    steps: [
      "Compare each adjacent pair in the array.",
      "Swap them if left > right.",
      "After each pass, the largest unsorted element is in its correct position.",
      "Repeat for n-1 passes. Early termination if no swaps occur.",
    ],
    useCase: "Educational purposes; rarely used in production due to O(n²) average complexity.",
  },
  "Merge Sort": {
    summary: "Divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges them.",
    steps: [
      "Divide the array into two halves at the midpoint.",
      "Recursively sort the left half.",
      "Recursively sort the right half.",
      "Merge both sorted halves into a single sorted array.",
    ],
    useCase: "Preferred for linked lists, stable sorting needs, and external sorting of large datasets.",
  },
  "Quick Sort": {
    summary: "Selects a pivot, partitions the array around it, then recursively sorts the sub-arrays.",
    steps: [
      "Choose a pivot element (last element here).",
      "Partition: move elements ≤ pivot to the left, > pivot to the right.",
      "Pivot is now in its final sorted position.",
      "Recursively apply to left and right sub-arrays.",
    ],
    useCase: "Default sorting in most standard libraries. Extremely fast in practice due to excellent cache behavior.",
  },
  "Heap Sort": {
    summary: "Builds a max-heap from the array, then repeatedly extracts the maximum element to sort.",
    steps: [
      "Build a max-heap from the entire array.",
      "Swap root (maximum) with last element.",
      "Reduce heap size by 1 and heapify the root.",
      "Repeat until heap size is 1.",
    ],
    useCase: "When O(n log n) worst-case is required with O(1) extra space. Used in systems with strict memory constraints.",
  },
  "BFS": {
    summary: "Explores a graph level by level using a queue, guaranteeing shortest path in unweighted graphs.",
    steps: [
      "Enqueue the start node and mark it visited.",
      "Dequeue a node and process it.",
      "Enqueue all unvisited neighbors.",
      "Repeat until queue is empty.",
    ],
    useCase: "Shortest path in unweighted graphs, web crawlers, social network connections, level-order traversal.",
  },
  "DFS": {
    summary: "Explores as far as possible along each branch before backtracking, using recursion or a stack.",
    steps: [
      "Mark the current node as visited.",
      "Recursively visit each unvisited neighbor.",
      "Backtrack when no unvisited neighbors remain.",
      "Continue until all reachable nodes are visited.",
    ],
    useCase: "Topological sort, cycle detection, maze solving, finding connected components, and path finding.",
  },
  "Dijkstra's": {
    summary: "Finds shortest paths from a source to all vertices in a weighted graph using a priority queue.",
    steps: [
      "Initialize all distances to ∞ except source (0).",
      "Use a min-priority queue; extract minimum-distance node.",
      "Relax all neighbors: update distance if shorter path found.",
      "Repeat until all nodes are processed.",
    ],
    useCase: "GPS navigation, network routing protocols (OSPF), shortest path in maps with positive weights.",
  },
};

// ═══════════════════════════════════════════════════════════════
//  HELPER: generate random array
// ═══════════════════════════════════════════════════════════════

function randomArray(n = 28, min = 10, max = 95) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// ═══════════════════════════════════════════════════════════════
//  SYNTAX HIGHLIGHTER (minimal, for code panel)
// ═══════════════════════════════════════════════════════════════

const KEYWORDS_CPP  = /\b(void|int|bool|auto|return|while|for|if|else|true|false|class|vector|queue|pair|swap|break|continue|new|nullptr)\b/g;
const KEYWORDS_JAVA = /\b(void|int|boolean|return|while|for|if|else|true|false|class|new|Arrays|List|Queue|LinkedList|PriorityQueue|Integer|MAX_VALUE)\b/g;

function highlightCode(code, lang) {
  const kw = lang === "cpp" ? KEYWORDS_CPP : KEYWORDS_JAVA;
  kw.lastIndex = 0;
  const escaped = code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const commented = escaped.replace(/(\/\/[^\n]*)/g, '<span style="color:#6b7280;font-style:italic">$1</span>');
  const strings = commented.replace(/"[^"]*"/g, s => `<span style="color:#a3e635">${s}</span>`);
  const kws = strings.replace(kw.source.replace('\\b', '\\b'), m => `<span style="color:#818cf8;font-weight:500">${m}</span>`);
  const nums = kws.replace(/\b(\d+)\b/g, '<span style="color:#fb923c">$1</span>');
  return nums;
}

// ═══════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── Animated background blobs ────────────────────────────────
function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <div className="blob1" style={{ position: "absolute", top: "-15%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="blob2" style={{ position: "absolute", bottom: "-20%", right: "-8%", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="blob3" style={{ position: "absolute", top: "30%", left: "40%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.08) 0%, transparent 60%)" }} />
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────
function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "sorting", label: "Sorting", icon: "⟨⟩", color: "tab-active-sort" },
    { id: "graph",   label: "Graph",   icon: "◎",  color: "tab-active-graph" },
    { id: "compare", label: "Compare", icon: "⊞",  color: "tab-active-compare" },
  ];
  return (
    <nav className="glass-nav" style={{ position: "relative", zIndex: 10, height: 56, display: "flex", alignItems: "center", padding: "0 20px", gap: 8, justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
        <span className="glow-text" style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>DSA Visualizer</span>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn glass-pill ${activeTab === t.id ? t.color : ""}`}
            onClick={() => setActiveTab(t.id)}
            style={{ padding: "6px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, color: activeTab === t.id ? undefined : "rgba(255,255,255,0.55)", border: "1px solid transparent", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "right" }}>
          <div>Premium Edition</div>
          <div style={{ color: "#4f46e5" }}>v2.0</div>
        </div>
      </div>
    </nav>
  );
}

// ── Complexity Panel ─────────────────────────────────────────
function ComplexityPanel({ algorithm }) {
  const cx = COMPLEXITY[algorithm];
  if (!cx) return null;
  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 10 }}>COMPLEXITY</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
        {[
          { label: "Best", val: cx.best, cls: cx.bestClass },
          { label: "Average", val: cx.avg, cls: cx.avgClass },
          { label: "Worst", val: cx.worst, cls: cx.worstClass },
          { label: "Space", val: cx.space, cls: "badge-info" },
        ].map(({ label, val, cls }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{label}</span>
            <span className={`badge-el ${cls}`} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, display: "inline-block", fontFamily: "JetBrains Mono, monospace" }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>Stable:</span>
        <span className={cx.stable ? "badge-good" : "badge-bad"} style={{ padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{cx.stable ? "Yes" : "No"}</span>
      </div>
    </div>
  );
}

// ── Code Panel ───────────────────────────────────────────────
function CodePanel({ algorithm }) {
  const [lang, setLang] = useState("cpp");
  const snippet = CODE[algorithm]?.[lang] || "";
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>CODE</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["cpp", "java"].map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, cursor: "pointer", border: "1px solid", fontFamily: "JetBrains Mono, monospace",
                background: lang === l ? "rgba(99,102,241,0.2)" : "transparent",
                color: lang === l ? "#818cf8" : "rgba(255,255,255,0.35)",
                borderColor: lang === l ? "rgba(99,102,241,0.35)" : "transparent" }}>
              {l === "cpp" ? "C++" : "Java"}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
        <div className="code-block" style={{ color: "#c8d3f5" }}
          dangerouslySetInnerHTML={{ __html: highlightCode(snippet, lang) }} />
      </div>
    </div>
  );
}

// ── Explanation Panel ────────────────────────────────────────
function ExplanationPanel({ algorithm }) {
  const ex = EXPLANATIONS[algorithm];
  if (!ex) return null;
  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 8 }}>HOW IT WORKS</div>
      <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "rgba(255,255,255,0.65)", marginBottom: 10 }}>{ex.summary}</p>
      <ol style={{ paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        {ex.steps.map((s, i) => (
          <li key={i} style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.55)" }}>{s}</li>
        ))}
      </ol>
      {ex.useCase && (
        <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#818cf8" }}>USE CASE  </span>
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>{ex.useCase}</span>
        </div>
      )}
    </div>
  );
}

// ── Sorting Bar Chart ────────────────────────────────────────
function SortingBars({ step, maxVal }) {
  if (!step) return null;
  const { arr, comparing = [], swapped = [], sorted = new Set(), merging = [], pivot } = step;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: "100%", padding: "0 8px", paddingBottom: 4 }}>
      {arr.map((v, i) => {
        const isComparing = comparing.includes(i);
        const isSwapped   = swapped.includes(i);
        const isSorted    = sorted.has(i);
        const isMerging   = merging.includes(i);
        const isPivot     = pivot === i;

        let bg = "linear-gradient(180deg, #4f46e5 0%, #3730a3 100%)"; // default blue
        let boxShadow = "0 0 6px rgba(79,70,229,0.3)";

        if (isSorted) { bg = "linear-gradient(180deg, #10b981 0%, #059669 100%)"; boxShadow = "0 0 8px rgba(16,185,129,0.4)"; }
        else if (isSwapped || isMerging) { bg = "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)"; boxShadow = "0 0 10px rgba(245,158,11,0.5)"; }
        else if (isComparing) { bg = "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)"; boxShadow = "0 0 10px rgba(239,68,68,0.5)"; }
        else if (isPivot) { bg = "linear-gradient(180deg, #a855f7 0%, #9333ea 100%)"; boxShadow = "0 0 10px rgba(168,85,247,0.5)"; }

        const heightPct = Math.max(4, (v / maxVal) * 100);
        return (
          <div key={i} className={`bar-el ${isComparing ? "bar-comparing" : ""}`}
            style={{ flex: 1, height: `${heightPct}%`, background: bg, boxShadow, minWidth: 4, position: "relative" }}>
            {arr.length <= 20 && (
              <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{v}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Sorting Visualizer ───────────────────────────────────────
function SortingVisualizer({ isCompare = false, forcedAlgo = null }) {
  const algos = Object.keys(SORT_GENERATORS);
  const [algo, setAlgo] = useState(forcedAlgo || "Bubble Sort");
  const [arrSize, setArrSize] = useState(isCompare ? 22 : 28);
  const [speed, setSpeed] = useState(50); // ms per step
  const [arr, setArr] = useState(() => randomArray(isCompare ? 22 : 28));
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const intervalRef = useRef(null);
  const stepIdxRef  = useRef(0);
  const stepsRef    = useRef([]);

  const currentStep = steps[stepIdx] || { arr, comparing: [], sorted: new Set() };
  const maxVal = Math.max(...(currentStep.arr || arr), 1);

  const buildSteps = useCallback((a, algorithm) => {
    const gen = SORT_GENERATORS[algorithm];
    return gen ? gen(a) : [];
  }, []);

  const reset = useCallback((newArr = null, newAlgo = null) => {
    clearInterval(intervalRef.current);
    const a = newArr || arr;
    const alg = newAlgo || algo;
    const s = buildSteps(a, alg);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
    setFinished(false);
    stepsRef.current = s;
    stepIdxRef.current = 0;
  }, [arr, algo, buildSteps]);

  useEffect(() => { reset(arr, algo); }, []);

  const play = useCallback(() => {
    if (stepIdxRef.current >= stepsRef.current.length - 1) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      stepIdxRef.current++;
      setStepIdx(stepIdxRef.current);
      if (stepIdxRef.current >= stepsRef.current.length - 1) {
        clearInterval(intervalRef.current);
        setPlaying(false);
        setFinished(true);
      }
    }, speed);
  }, [speed]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    if (stepIdxRef.current < stepsRef.current.length - 1) {
      stepIdxRef.current++;
      setStepIdx(stepIdxRef.current);
      if (stepIdxRef.current >= stepsRef.current.length - 1) setFinished(true);
    }
  }, []);

  const stepBack = useCallback(() => {
    if (stepIdxRef.current > 0) {
      stepIdxRef.current--;
      setStepIdx(stepIdxRef.current);
      setFinished(false);
    }
  }, []);

  const handleNewRandom = () => {
    const a = randomArray(arrSize);
    setArr(a);
    reset(a, algo);
  };

  const handleAlgoChange = (a) => {
    setAlgo(a);
    reset(arr, a);
  };

  const handleCustomApply = () => {
    try {
      const parsed = customInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 100);
      if (parsed.length >= 2) { setArr(parsed); reset(parsed, algo); setShowCustom(false); }
    } catch {}
  };

  const progress = steps.length > 0 ? (stepIdx / (steps.length - 1)) * 100 : 0;
  const stepInfo = currentStep;

  const statusLabel = () => {
    if (!stepInfo || (!stepInfo.comparing?.length && !stepInfo.swapped?.length && !stepInfo.merging?.length)) return { text: "Ready", color: "#818cf8" };
    if (stepInfo.done) return { text: "Sorted!", color: "#10b981" };
    if (stepInfo.swapped?.length) return { text: "Swapping", color: "#f59e0b" };
    if (stepInfo.merging?.length) return { text: "Merging", color: "#f59e0b" };
    if (stepInfo.comparing?.length) return { text: "Comparing", color: "#ef4444" };
    return { text: "Running", color: "#818cf8" };
  };
  const status = statusLabel();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 10 }}>
      {!isCompare && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <select value={algo} onChange={e => handleAlgoChange(e.target.value)}
            style={{ flex: "0 0 auto", background: "rgba(255,255,255,0.05)", color: "#e8e8f0", borderRadius: 10, padding: "7px 28px 7px 12px", fontSize: 13, border: "1px solid rgba(255,255,255,0.1)" }}>
            {algos.map(a => <option key={a}>{a}</option>)}
          </select>

          <button className="btn btn-secondary btn-icon" onClick={handleNewRandom} title="New Random Array" style={{ fontSize: 14 }}>🔀</button>

          <button className="btn btn-secondary btn-icon" onClick={() => setShowCustom(!showCustom)} title="Custom Array" style={{ fontSize: 13 }}>✏️</button>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            <span>Size:</span>
            <input type="range" min={8} max={50} value={arrSize}
              onChange={e => setArrSize(Number(e.target.value))}
              onMouseUp={() => { const a = randomArray(arrSize); setArr(a); reset(a, algo); }}
              style={{ width: 80 }} />
            <span style={{ minWidth: 20, color: "#818cf8", fontWeight: 600 }}>{arrSize}</span>
          </div>
        </div>
      )}

      {showCustom && !isCompare && (
        <div className="anim-fadein" style={{ display: "flex", gap: 8 }}>
          <input value={customInput} onChange={e => setCustomInput(e.target.value)}
            placeholder="e.g. 34,12,56,8,90,23"
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "7px 12px", fontSize: 12.5, color: "#e8e8f0", outline: "none", fontFamily: "JetBrains Mono, monospace" }} />
          <button className="btn btn-primary" onClick={handleCustomApply} style={{ fontSize: 12.5, padding: "7px 14px" }}>Apply</button>
        </div>
      )}

      {/* Visualization area */}
      <div className="glass-card" style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: isCompare ? 180 : 260 }}>
        {/* Progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#4f46e5,#7c3aed)", transition: "width 0.1s ease" }} />
        </div>

        {/* Status badge */}
        <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.4)", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: status.color, border: `1px solid ${status.color}44` }}>
          {status.text}
        </div>

        {/* Step counter */}
        <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.4)", padding: "3px 10px", borderRadius: 20, fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono, monospace" }}>
          {stepIdx}/{steps.length - 1}
        </div>

        {/* Bars */}
        <div style={{ position: "absolute", inset: "30px 0 0 0" }}>
          <SortingBars step={currentStep} maxVal={maxVal} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <button className="btn btn-secondary btn-icon" onClick={stepBack} disabled={stepIdx === 0 || playing} style={{ fontSize: 14, padding: "7px 12px" }}>⏮</button>
        <button className="btn btn-secondary btn-icon" onClick={stepForward} disabled={finished || playing} style={{ fontSize: 14, padding: "7px 12px" }}>⏭</button>

        {playing
          ? <button className="btn btn-danger" onClick={pause} style={{ padding: "7px 14px", fontSize: 13 }}>⏸ Pause</button>
          : <button className="btn btn-primary" onClick={play} disabled={finished} style={{ fontSize: 13, padding: "7px 14px" }}>▶ Play</button>
        }

        <button className="btn btn-secondary" onClick={() => reset()} style={{ fontSize: 13, padding: "7px 14px" }}>↺ Reset</button>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
          <span>Speed:</span>
          <input type="range" min={10} max={300} value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ width: isCompare ? 60 : 90 }} />
          <span style={{ minWidth: 32, color: "#818cf8", fontWeight: 600, fontSize: 11 }}>{speed}ms</span>
        </div>
      </div>

      {!isCompare && (
        <div style={{ display: "flex", gap: 10, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          {[["#4f46e5", "Default"], ["#ef4444", "Comparing"], ["#f59e0b", "Swapping/Merging"], ["#a855f7", "Pivot"], ["#10b981", "Sorted"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <span>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Graph Canvas ─────────────────────────────────────────────
function GraphCanvas({ step, graph, startNode, onNodeClick }) {
  const { visited = new Set(), current = -1, exploring = -1, distances = {}, activeEdges = new Set() } = step || {};

  const getNodeColor = (id) => {
    if (id === current) return { fill: "#f59e0b", stroke: "#fbbf24", glow: "drop-shadow(0 0 10px #f59e0b)" };
    if (id === exploring) return { fill: "#a855f7", stroke: "#c084fc", glow: "drop-shadow(0 0 10px #a855f7)" };
    if (visited.has(id)) return { fill: "#10b981", stroke: "#34d399", glow: "drop-shadow(0 0 8px #10b981)" };
    if (id === startNode) return { fill: "#3b82f6", stroke: "#60a5fa", glow: "drop-shadow(0 0 8px #3b82f6)" };
    return { fill: "#1e1b4b", stroke: "#4f46e5", glow: "drop-shadow(0 0 4px rgba(79,70,229,0.4))" };
  };

  const edgeKey = (u, v) => `${Math.min(u, v)}-${Math.max(u, v)}`;

  return (
    <svg viewBox="0 0 640 430" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* Edges */}
      {graph.edges.map((e, i) => {
        const nu = graph.nodes[e.u], nv = graph.nodes[e.v];
        const key = edgeKey(e.u, e.v);
        const isActive = activeEdges.has(key);
        const mx = (nu.x + nv.x) / 2, my = (nu.y + nv.y) / 2;
        return (
          <g key={i}>
            <line x1={nu.x} y1={nu.y} x2={nv.x} y2={nv.y}
              stroke={isActive ? "#818cf8" : "rgba(255,255,255,0.12)"}
              strokeWidth={isActive ? 2.5 : 1.5}
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              strokeDasharray={isActive ? "none" : "none"} />
            <text x={mx} y={my - 5} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="JetBrains Mono, monospace">{e.w}</text>
          </g>
        );
      })}

      {/* Nodes */}
      {graph.nodes.map(n => {
        const col = getNodeColor(n.id);
        const dist = distances[n.id];
        return (
          <g key={n.id} onClick={() => onNodeClick(n.id)} style={{ cursor: "pointer" }}>
            <circle cx={n.x} cy={n.y} r={22} fill={col.fill} stroke={col.stroke} strokeWidth={2}
              style={{ filter: col.glow, transition: "fill 0.3s, filter 0.3s" }} />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize="14" fontWeight="700" fontFamily="Outfit, sans-serif">{n.label}</text>
            {dist !== undefined && dist !== Infinity && (
              <text x={n.x} y={n.y + 34} textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600">{dist}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Graph Visualizer ─────────────────────────────────────────
function GraphVisualizer() {
  const algos = Object.keys(GRAPH_GENERATORS);
  const [algo, setAlgo] = useState("BFS");
  const [startNode, setStartNode] = useState(0);
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [finished, setFinished] = useState(false);

  const intervalRef  = useRef(null);
  const stepIdxRef   = useRef(0);
  const stepsRef     = useRef([]);

  const buildSteps = useCallback((alg, start) => {
    const gen = GRAPH_GENERATORS[alg];
    return gen ? gen(DEFAULT_GRAPH, start) : [];
  }, []);

  const reset = useCallback((alg = algo, start = startNode) => {
    clearInterval(intervalRef.current);
    const s = buildSteps(alg, start);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
    setFinished(false);
    stepsRef.current = s;
    stepIdxRef.current = 0;
  }, [algo, startNode, buildSteps]);

  useEffect(() => { reset(); }, []);

  const play = () => {
    if (stepIdxRef.current >= stepsRef.current.length - 1) return;
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      stepIdxRef.current++;
      setStepIdx(stepIdxRef.current);
      if (stepIdxRef.current >= stepsRef.current.length - 1) {
        clearInterval(intervalRef.current);
        setPlaying(false);
        setFinished(true);
      }
    }, speed);
  };

  const pause = () => { clearInterval(intervalRef.current); setPlaying(false); };

  const stepF = () => {
    if (stepIdxRef.current < stepsRef.current.length - 1) {
      stepIdxRef.current++;
      setStepIdx(stepIdxRef.current);
      if (stepIdxRef.current >= stepsRef.current.length - 1) setFinished(true);
    }
  };

  const stepB = () => {
    if (stepIdxRef.current > 0) { stepIdxRef.current--; setStepIdx(stepIdxRef.current); setFinished(false); }
  };

  const handleNodeClick = (id) => {
    if (!playing) { setStartNode(id); reset(algo, id); }
  };

  const handleAlgoChange = (a) => { setAlgo(a); reset(a, startNode); };

  const currentStep = steps[stepIdx] || {};
  const visitOrder  = currentStep.path || [];
  const progress    = steps.length > 0 ? (stepIdx / (steps.length - 1)) * 100 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 10 }}>
      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <select value={algo} onChange={e => handleAlgoChange(e.target.value)}
          style={{ background: "rgba(255,255,255,0.05)", color: "#e8e8f0", borderRadius: 10, padding: "7px 28px 7px 12px", fontSize: 13, border: "1px solid rgba(255,255,255,0.1)" }}>
          {algos.map(a => <option key={a}>{a}</option>)}
        </select>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          Start: <span style={{ color: "#818cf8", fontWeight: 600 }}>{DEFAULT_GRAPH.nodes[startNode]?.label}</span>
          <span style={{ marginLeft: 6, fontSize: 11 }}>(click a node)</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
          <span>Speed:</span>
          <input type="range" min={200} max={2000} step={100} value={speed}
            onChange={e => setSpeed(Number(e.target.value))} style={{ width: 80 }} />
          <span style={{ minWidth: 40, color: "#818cf8", fontWeight: 600, fontSize: 11 }}>{speed}ms</span>
        </div>
      </div>

      {/* Graph */}
      <div className="glass-card" style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 280 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.05)" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#14b8a6,#06b6d4)", transition: "width 0.2s ease" }} />
        </div>

        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 6 }}>
          <div style={{ background: "rgba(0,0,0,0.4)", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
            <span style={{ color: "#14b8a6" }}>Step {stepIdx}</span><span style={{ color: "rgba(255,255,255,0.3)" }}> / {steps.length - 1}</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 8, fontSize: 10 }}>
          {[["#4f46e5","Start"],["#f59e0b","Current"],["#a855f7","Exploring"],["#10b981","Visited"]].map(([c,l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} /><span style={{ color: "rgba(255,255,255,0.4)" }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", inset: "30px 0 0 0", padding: "0 10px" }}>
          <GraphCanvas step={currentStep} graph={DEFAULT_GRAPH} startNode={startNode} onNodeClick={handleNodeClick} />
        </div>
      </div>

      {/* Traversal order */}
      {visitOrder.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>TRAVERSAL:</span>
          {visitOrder.map((id, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {i > 0 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>→</span>}
              <span style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace" }}>
                {DEFAULT_GRAPH.nodes[id].label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dijkstra distances */}
      {algo === "Dijkstra's" && Object.keys(currentStep.distances || {}).length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DEFAULT_GRAPH.nodes.map(n => {
            const d = currentStep.distances[n.id];
            return (
              <div key={n.id} style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "4px 10px", fontSize: 11, textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 1 }}>{n.label}</div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: d === Infinity ? "rgba(255,255,255,0.2)" : "#fbbf24" }}>
                  {d === Infinity ? "∞" : d}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Playback controls */}
      <div style={{ display: "flex", gap: 6 }}>
        <button className="btn btn-secondary btn-icon" onClick={stepB} disabled={stepIdx === 0 || playing} style={{ fontSize: 14, padding: "7px 12px" }}>⏮</button>
        <button className="btn btn-secondary btn-icon" onClick={stepF} disabled={finished || playing} style={{ fontSize: 14, padding: "7px 12px" }}>⏭</button>
        {playing
          ? <button className="btn btn-danger" onClick={pause} style={{ fontSize: 13, padding: "7px 14px" }}>⏸ Pause</button>
          : <button className="btn btn-success" onClick={play} disabled={finished} style={{ fontSize: 13, padding: "7px 14px" }}>▶ Play</button>
        }
        <button className="btn btn-secondary" onClick={() => reset()} style={{ fontSize: 13, padding: "7px 14px" }}>↺ Reset</button>
      </div>
    </div>
  );
}

// ── Right Panel (Code + Explanation + Complexity) ────────────
function RightPanel({ algorithm }) {
  const [activeSection, setActiveSection] = useState("code");
  const sections = [
    { id: "code", label: "Code" },
    { id: "explain", label: "Explain" },
    { id: "complexity", label: "Complexity" },
  ];

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Section tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ flex: 1, padding: "10px 6px", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", fontFamily: "Outfit, sans-serif",
              background: "transparent", transition: "all 0.2s",
              color: activeSection === s.id ? "#818cf8" : "rgba(255,255,255,0.4)",
              borderBottom: activeSection === s.id ? "2px solid #818cf8" : "2px solid transparent" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {activeSection === "code" && <CodePanel algorithm={algorithm} />}
        {activeSection === "explain" && <ExplanationPanel algorithm={algorithm} />}
        {activeSection === "complexity" && <ComplexityPanel algorithm={algorithm} />}
      </div>
    </div>
  );
}

// ── Compare View ─────────────────────────────────────────────
function CompareView() {
  const sortAlgos  = Object.keys(SORT_GENERATORS);
  const graphAlgos = Object.keys(GRAPH_GENERATORS);
  const [type, setType] = useState("sorting");
  const [leftAlgo,  setLeftAlgo]  = useState("Bubble Sort");
  const [rightAlgo, setRightAlgo] = useState("Merge Sort");
  const [leftArr,  setLeftArr]  = useState(() => randomArray(22));
  const [rightArr, setRightArr] = useState(null); // null = same as left

  const sharedArr = leftArr;

  // Shared random generator
  const newRandom = () => {
    const a = randomArray(22);
    setLeftArr(a);
  };

  const algos = type === "sorting" ? sortAlgos : graphAlgos;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 12 }}>
      {/* Header controls */}
      <div className="glass-card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4 }}>
          {["sorting", "graph"].map(t => (
            <button key={t} onClick={() => { setType(t); setLeftAlgo(t === "sorting" ? "Bubble Sort" : "BFS"); setRightAlgo(t === "sorting" ? "Merge Sort" : "DFS"); }}
              style={{ padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "Outfit, sans-serif",
                background: type === t ? "rgba(99,102,241,0.25)" : "transparent",
                color: type === t ? "#818cf8" : "rgba(255,255,255,0.4)" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          <select value={leftAlgo} onChange={e => setLeftAlgo(e.target.value)}
            style={{ background: "rgba(99,102,241,0.12)", color: "#a78bfa", borderRadius: 8, padding: "5px 20px 5px 10px", fontSize: 12, border: "1px solid rgba(99,102,241,0.25)" }}>
            {algos.map(a => <option key={a}>{a}</option>)}
          </select>

          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>vs</span>

          <select value={rightAlgo} onChange={e => setRightAlgo(e.target.value)}
            style={{ background: "rgba(245,158,11,0.1)", color: "#fcd34d", borderRadius: 8, padding: "5px 20px 5px 10px", fontSize: 12, border: "1px solid rgba(245,158,11,0.2)" }}>
            {algos.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        {type === "sorting" && (
          <button className="btn btn-secondary" onClick={newRandom} style={{ fontSize: 12.5, padding: "6px 14px" }}>🔀 New Array</button>
        )}
      </div>

      {/* Side-by-side panels */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, minHeight: 0 }}>
        {/* Left */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: 14, overflow: "hidden" }}>
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#818cf8" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa" }}>{leftAlgo}</span>
            <span className="badge-info" style={{ marginLeft: "auto", fontSize: 10, padding: "2px 8px", borderRadius: 6, fontFamily: "JetBrains Mono, monospace" }}>
              {COMPLEXITY[leftAlgo]?.avg}
            </span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {type === "sorting"
              ? <SortingVisualizer isCompare key={`l-${leftAlgo}-${sharedArr.join(",")}`} />
              : <GraphVisualizer />
            }
          </div>
        </div>

        {/* Right */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: 14, overflow: "hidden" }}>
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fcd34d" }}>{rightAlgo}</span>
            <span className="badge-avg" style={{ marginLeft: "auto", fontSize: 10, padding: "2px 8px", borderRadius: 6, fontFamily: "JetBrains Mono, monospace" }}>
              {COMPLEXITY[rightAlgo]?.avg}
            </span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {type === "sorting"
              ? <SortingVisualizer isCompare key={`r-${rightAlgo}-${sharedArr.join(",")}`} />
              : <GraphVisualizer />
            }
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="glass-card" style={{ padding: "10px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: 1, marginBottom: 8 }}>COMPLEXITY COMPARISON</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: 4, fontSize: 11, textAlign: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Algorithm</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Best</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Average</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Worst</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Space</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Stable</div>

          {[leftAlgo, rightAlgo].map((alg, ri) => {
            const cx = COMPLEXITY[alg];
            if (!cx) return null;
            return [
              <div key={`${ri}-n`} style={{ color: ri === 0 ? "#a78bfa" : "#fcd34d", fontWeight: 600, textAlign: "left" }}>{alg}</div>,
              <div key={`${ri}-b`} className={cx.bestClass} style={{ borderRadius: 6, padding: "2px 6px", fontFamily: "JetBrains Mono, monospace" }}>{cx.best}</div>,
              <div key={`${ri}-a`} className={cx.avgClass}  style={{ borderRadius: 6, padding: "2px 6px", fontFamily: "JetBrains Mono, monospace" }}>{cx.avg}</div>,
              <div key={`${ri}-w`} className={cx.worstClass} style={{ borderRadius: 6, padding: "2px 6px", fontFamily: "JetBrains Mono, monospace" }}>{cx.worst}</div>,
              <div key={`${ri}-s`} className="badge-info"  style={{ borderRadius: 6, padding: "2px 6px", fontFamily: "JetBrains Mono, monospace" }}>{cx.space}</div>,
              <div key={`${ri}-st`} className={cx.stable ? "badge-good" : "badge-bad"} style={{ borderRadius: 6, padding: "2px 6px" }}>{cx.stable ? "✓" : "✗"}</div>,
            ];
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState("sorting");
  const [sortAlgo, setSortAlgo]   = useState("Bubble Sort");
  const [graphAlgo, setGraphAlgo] = useState("BFS");

  const currentAlgo = activeTab === "sorting" ? sortAlgo : activeTab === "graph" ? graphAlgo : sortAlgo;

  return (
    <>
      {/* Inject global CSS */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Additional badge styles */}
      <style>{`
        .badge-good  { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.25); }
        .badge-avg   { background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.25); }
        .badge-bad   { background:rgba(239,68,68,0.15);  color:#f87171; border:1px solid rgba(239,68,68,0.25); }
        .badge-info  { background:rgba(99,102,241,0.15); color:#818cf8; border:1px solid rgba(99,102,241,0.25); }
        .badge-el    { display:inline-block; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative", overflow: "hidden" }}>
        <Background />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main content */}
          <div style={{ flex: 1, overflow: "hidden", padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 0 }}>

            {/* ── Sorting Tab ── */}
            {activeTab === "sorting" && (
              <div className="anim-fadeup" style={{ display: "grid", gridTemplateColumns: "220px 1fr 260px", gap: 12, height: "100%" }}>
                {/* Left: Algorithm selector */}
                <div className="glass-card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>ALGORITHMS</div>
                  {Object.keys(SORT_GENERATORS).map(a => (
                    <button key={a} onClick={() => setSortAlgo(a)}
                      style={{ textAlign: "left", padding: "10px 12px", borderRadius: 10, border: "1px solid", cursor: "pointer",
                        fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                        background: sortAlgo === a ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                        color: sortAlgo === a ? "#a78bfa" : "rgba(255,255,255,0.6)",
                        borderColor: sortAlgo === a ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)" }}>
                      <div style={{ fontWeight: 600 }}>{a}</div>
                      <div style={{ fontSize: 11, marginTop: 2, color: sortAlgo === a ? "#818cf8" : "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>
                        {COMPLEXITY[a]?.avg}
                      </div>
                    </button>
                  ))}

                  <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>QUICK STATS</div>
                    {sortAlgo && (() => {
                      const cx = COMPLEXITY[sortAlgo];
                      return (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                            <span style={{ color: "rgba(255,255,255,0.4)" }}>Space</span>
                            <span className="badge-info" style={{ padding: "1px 6px", borderRadius: 5, fontFamily: "JetBrains Mono, monospace" }}>{cx.space}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                            <span style={{ color: "rgba(255,255,255,0.4)" }}>Stable</span>
                            <span className={cx.stable ? "badge-good" : "badge-bad"} style={{ padding: "1px 6px", borderRadius: 5 }}>{cx.stable ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Center: Visualization */}
                <div className="glass-card" style={{ padding: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="glow-text" style={{ fontSize: 16, fontWeight: 700 }}>{sortAlgo}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Visualization</span>
                  </div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <SortingVisualizer key={sortAlgo} />
                  </div>
                </div>

                {/* Right: Code + Explanation + Complexity */}
                <RightPanel algorithm={sortAlgo} />
              </div>
            )}

            {/* ── Graph Tab ── */}
            {activeTab === "graph" && (
              <div className="anim-fadeup" style={{ display: "grid", gridTemplateColumns: "200px 1fr 260px", gap: 12, height: "100%" }}>
                {/* Left */}
                <div className="glass-card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>ALGORITHMS</div>
                  {Object.keys(GRAPH_GENERATORS).map(a => (
                    <button key={a} onClick={() => setGraphAlgo(a)}
                      style={{ textAlign: "left", padding: "10px 12px", borderRadius: 10, border: "1px solid", cursor: "pointer",
                        fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                        background: graphAlgo === a ? "rgba(20,184,166,0.15)" : "rgba(255,255,255,0.03)",
                        color: graphAlgo === a ? "#5eead4" : "rgba(255,255,255,0.6)",
                        borderColor: graphAlgo === a ? "rgba(20,184,166,0.35)" : "rgba(255,255,255,0.06)" }}>
                      <div style={{ fontWeight: 600 }}>{a}</div>
                      <div style={{ fontSize: 11, marginTop: 2, color: graphAlgo === a ? "#2dd4bf" : "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>
                        {COMPLEXITY[a]?.avg}
                      </div>
                    </button>
                  ))}

                  <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>GRAPH INFO</div>
                    <div>7 nodes (A–G)</div>
                    <div>9 weighted edges</div>
                    <div style={{ marginTop: 4 }}>Click any node to set it as the traversal starting point.</div>
                  </div>
                </div>

                {/* Center */}
                <div className="glass-card" style={{ padding: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#5eead4" }}>{graphAlgo}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Graph Traversal</span>
                  </div>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <GraphVisualizer key={graphAlgo} />
                  </div>
                </div>

                {/* Right */}
                <RightPanel algorithm={graphAlgo} />
              </div>
            )}

            {/* ── Compare Tab ── */}
            {activeTab === "compare" && (
              <div className="anim-fadeup" style={{ height: "100%", overflow: "auto" }}>
                <CompareView />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
