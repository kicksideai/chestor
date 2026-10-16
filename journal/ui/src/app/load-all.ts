import type { GraphEdge, GraphNode } from './types'

/**
 * Loading a whole graph.
 *
 * A bounded window is a reading aid, never a wall. Every bounded view offers to
 * fetch the rest, and this module drives that fetch: fixed-size pages, a
 * running count against the manifest the server states, a partial result the
 * canvas can draw after every chunk, and a stop that keeps what already
 * arrived. Nothing here decides what to hide.
 */

/** One page of a whole-graph read, as `mode=bundle` publishes it. */
export interface GraphBundlePage {
  manifest?: { node_count?: number; edge_count?: number; revision?: number }
  nodes?: GraphNode[]
  edges?: GraphEdge[]
  complete?: boolean
  omissions?: {
    nodes?: { returned?: number; offset?: number; omitted?: number; continuation?: unknown }
    edges?: { returned?: number; offset?: number; omitted?: number; continuation?: unknown }
  }
}

export interface BundleRequest { nodeOffset: number; edgeOffset: number }

export interface LoadState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  /**
   * Where each accumulated record sits. The accumulator owns its own index and
   * updates it as pages fold in, so folding a page costs the page rather than
   * the whole graph read so far.
   */
  nodeIndex: Map<string, number>
  edgeIndex: Map<string, number>
  nodeOffset: number
  edgeOffset: number
  totalNodes: number
  totalEdges: number
  chunks: number
  done: boolean
  cancelled: boolean
  error: string
}

export interface Cancellation { cancelled: boolean }

export function newLoadState(): LoadState {
  return {
    nodes: [], edges: [], nodeIndex: new Map(), edgeIndex: new Map(), nodeOffset: 0, edgeOffset: 0,
    totalNodes: 0, totalEdges: 0, chunks: 0, done: false, cancelled: false, error: '',
  }
}

function keep<T extends { id: string; revision?: number }>(existing: T | undefined, arriving: T): boolean {
  if (!existing) return true
  return (arriving.revision || 0) >= (existing.revision || 0)
}

/** Appends what is new and replaces what a newer revision supersedes, in place. */
function fold<T extends { id: string; revision?: number }>(
  into: T[], index: Map<string, number>, arriving: T[] | undefined,
): void {
  for (const record of arriving || []) {
    const at = index.get(record.id)
    if (at === undefined) {
      index.set(record.id, into.length)
      into.push(record)
    } else if (keep(into[at], record)) {
      into[at] = record
    }
  }
}

/**
 * Folds one page into the accumulating graph. A record that arrives twice —
 * pages overlap whenever the graph is written while it is being read — keeps
 * the newest revision rather than doubling.
 */
export function mergePage(state: LoadState, page: GraphBundlePage): LoadState {
  fold(state.nodes, state.nodeIndex, page.nodes)
  fold(state.edges, state.edgeIndex, page.edges)
  state.nodeOffset += (page.nodes || []).length
  state.edgeOffset += (page.edges || []).length
  state.totalNodes = Math.max(state.totalNodes, Number(page.manifest?.node_count) || 0, state.nodes.length)
  state.totalEdges = Math.max(state.totalEdges, Number(page.manifest?.edge_count) || 0, state.edges.length)
  state.chunks += 1
  return state
}

/** True while either collection still has a continuation to follow. */
export function hasMore(page: GraphBundlePage): boolean {
  return Boolean(page.omissions?.nodes?.continuation) || Boolean(page.omissions?.edges?.continuation)
}

/** What a progress bar shows: whole records, never a spinner with no number. */
export function progressOf(state: LoadState): { loaded: number; total: number; ratio: number } {
  const loaded = state.nodes.length + state.edges.length
  const total = Math.max(loaded, state.totalNodes + state.totalEdges)
  return { loaded, total, ratio: total ? Math.min(1, loaded / total) : 0 }
}

export interface LoadOptions {
  onChunk?: (state: LoadState) => void
  cancellation?: Cancellation
  /** Guards against a server that never stops offering continuations. */
  maxChunks?: number
}

/**
 * Drives `fetchPage` until the server reports the graph complete, the reader
 * stops it, or the chunk ceiling is reached. The state it returns is always
 * usable: a stopped load keeps every record that arrived.
 */
export async function loadWholeGraph(
  fetchPage: (request: BundleRequest) => Promise<GraphBundlePage>,
  options: LoadOptions = {},
): Promise<LoadState> {
  const state = newLoadState()
  const ceiling = options.maxChunks ?? 400
  try {
    for (;;) {
      if (options.cancellation?.cancelled) { state.cancelled = true; break }
      const page = await fetchPage({ nodeOffset: state.nodeOffset, edgeOffset: state.edgeOffset })
      const before = { nodes: state.nodeOffset, edges: state.edgeOffset }
      mergePage(state, page)
      options.onChunk?.(state)
      if (options.cancellation?.cancelled) { state.cancelled = true; break }
      if (!hasMore(page)) { state.done = true; break }
      // The offsets are what carries the read forward, so they are what decides
      // whether it can. A page that returns no records at all leaves them where
      // they were and the next request would be the request just made, so the
      // read stops and says the graph is as loaded as the server offers. A page
      // whose records were all seen before still moves the offsets and is still
      // followed: overlap is what a graph written during a read looks like, and
      // reading it as completion truncates the graph.
      if (state.nodeOffset === before.nodes && state.edgeOffset === before.edges) { state.done = true; break }
      if (state.chunks >= ceiling) { state.done = true; break }
    }
  } catch (cause) {
    state.error = cause instanceof Error ? cause.message : 'Loading the whole graph failed.'
  }
  return state
}
