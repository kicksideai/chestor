import { GEOMETRY_STRIDE, solveLayout, wireEdge, wireNode } from './layout-protocol'
import type { LayoutRequest, LayoutResult } from './layout-protocol'
import type { GraphEdge, GraphNode } from './types'

/**
 * The reading thread's half of the layout.
 *
 * It owns one worker, keeps the last solved positions as the memory the next
 * solve starts from — so an arriving chunk is seated against what is already on
 * screen rather than reshuffling the graph — and answers with plain arrays the
 * canvas can walk without allocating per frame.
 */

export interface Placement {
  ids: string[]
  index: Map<string, number>
  /** x, y per record. */
  positions: Float32Array
  /** radius, halfWidth, top, bottom, degree per record. */
  geometry: Float32Array
  labels: string[][]
  width: number
  height: number
  ms: number
}

export const EMPTY_PLACEMENT: Placement = {
  ids: [], index: new Map(), positions: new Float32Array(0), geometry: new Float32Array(0),
  labels: [], width: 0, height: 0, ms: 0,
}

function placementOf(result: LayoutResult): Placement {
  const index = new Map<string, number>()
  for (let at = 0; at < result.ids.length; at++) index.set(result.ids[at], at)
  return {
    ids: result.ids,
    index,
    positions: result.positions,
    geometry: result.geometry,
    labels: result.labels,
    width: result.width,
    height: result.height,
    ms: result.ms,
  }
}

export function positionOf(placement: Placement, id: string): { x: number; y: number } | null {
  const at = placement.index.get(id)
  if (at === undefined) return null
  return { x: placement.positions[at * 2], y: placement.positions[at * 2 + 1] }
}

export function extentOf(placement: Placement, at: number): { x: number; y: number; halfWidth: number; halfHeight: number } {
  const geometry = at * GEOMETRY_STRIDE
  const top = placement.geometry[geometry + 2]
  const bottom = placement.geometry[geometry + 3]
  return {
    x: placement.positions[at * 2],
    y: placement.positions[at * 2 + 1] + (bottom - top) / 2,
    halfWidth: placement.geometry[geometry + 1],
    halfHeight: (top + bottom) / 2,
  }
}

export interface SolveInput {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
  emphasis: ReadonlySet<string>
  held: ReadonlyMap<string, { px: number; py: number }>
  /** Ignore remembered positions and solve the graph from scratch. */
  fresh?: boolean
  /** Also ignore persisted x/y — the reader asked for a full re-layout. */
  unpin?: boolean
}

export class LayoutEngine {
  private worker: Worker | null = null
  private generation = 0
  private memory: Array<[string, number, number]> = []
  private busy = false
  private pending: { input: SolveInput; settle: (value: Placement | null) => void } | null = null
  /** Abandons the solve currently in the worker, so nothing waits on a dead one. */
  private abandon: (() => void) | null = null
  private disposed = false
  /**
   * A reader's re-layout is a promise, not a race entrant: once asked for, it
   * rides every request until a solve actually reaches the screen. Without
   * this, a routine refresh arriving mid-solve would supersede the re-layout
   * and quietly leave the old arrangement in force.
   */
  private sticky = { fresh: false, unpin: false }

  constructor(private readonly makeWorker?: () => Worker) {}

  /** Positions from the previous solve, so the next one keeps spatial memory. */
  remembered(): ReadonlyArray<[string, number, number]> { return this.memory }

  private remember(placement: Placement) {
    const memory: Array<[string, number, number]> = new Array(placement.ids.length)
    for (let at = 0; at < placement.ids.length; at++) {
      memory[at] = [placement.ids[at], placement.positions[at * 2], placement.positions[at * 2 + 1]]
    }
    this.memory = memory
  }

  private request(input: SolveInput): LayoutRequest {
    return {
      generation: ++this.generation,
      nodes: input.nodes.map(wireNode),
      edges: input.edges.map(wireEdge),
      width: Math.max(1, Math.round(input.width)),
      height: Math.max(1, Math.round(input.height)),
      emphasis: [...input.emphasis],
      previous: input.fresh ? [] : this.memory,
      held: [...input.held].map(([id, point]) => [id, point.px, point.py] as [string, number, number]),
      unpin: input.unpin,
    }
  }

  /**
   * One solve at a time, with at most one request held behind it.
   *
   * A solve over a large journal costs real time, and the things that ask for
   * one arrive in bursts: a projection refresh, a drag on the pane edge, a
   * chunk of a whole-graph read. Queuing a solve per event would run them all
   * and repaint each superseded layout in turn on the way to the current one.
   *
   * So the newest request is the only one worth answering. It replaces whatever
   * was waiting, and it supersedes whatever is running — a superseded solve
   * answers `null`, which says the caller has nothing to paint because a newer
   * layout is already on its way.
   */
  solve(input: SolveInput): Promise<Placement | null> {
    if (this.disposed) return Promise.resolve(null)
    if (input.fresh) this.sticky.fresh = true
    if (input.unpin) this.sticky.unpin = true
    const carried: SolveInput = { ...input, fresh: this.sticky.fresh, unpin: this.sticky.unpin }
    if (this.busy) {
      this.pending?.settle(null)
      return new Promise<Placement | null>(settle => { this.pending = { input: carried, settle } })
    }
    return this.run(carried)
  }

  private async run(input: SolveInput): Promise<Placement | null> {
    this.busy = true
    try {
      const placement = await this.dispatch(input)
      // A request accepted while this one was solving names a newer graph or a
      // newer pane, so this result is already history and is never painted.
      if (this.pending || this.disposed) return null
      // This solve reached the screen; the promised re-layout is delivered.
      if (placement && input.fresh) this.sticky.fresh = false
      if (placement && input.unpin) this.sticky.unpin = false
      return placement
    } finally {
      this.busy = false
      const next = this.pending
      if (next && !this.disposed) {
        this.pending = null
        void this.run(next.input).then(next.settle)
      }
    }
  }

  /**
   * Runs one solve in the worker when the runtime has one, and on this thread
   * when it does not. Both run the same projection; only the thread differs.
   */
  private dispatch(input: SolveInput): Promise<Placement | null> {
    const request = this.request(input)
    if (!this.worker && this.makeWorker) {
      try { this.worker = this.makeWorker() } catch { this.worker = null }
    }
    if (!this.worker) {
      const placement = placementOf(solveLayout(request))
      this.remember(placement)
      return Promise.resolve(placement)
    }
    return new Promise<Placement | null>(resolve => {
      const worker = this.worker!
      const close = (value: Placement | null) => {
        worker.removeEventListener('message', settle)
        worker.removeEventListener('error', failed)
        this.abandon = null
        resolve(value)
      }
      const settle = (event: MessageEvent<LayoutResult>) => {
        if (event.data.generation !== request.generation) return
        const placement = placementOf(event.data)
        this.remember(placement)
        close(placement)
      }
      // A worker that cannot answer must not leave the canvas saying it is
      // still laying the graph out. The broken worker is dropped and this very
      // solve runs on the reading thread instead, so the caller always gets a
      // layout — null stays reserved for a solve that was superseded.
      const failed = () => {
        this.worker?.terminate()
        this.worker = null
        const placement = placementOf(solveLayout(request))
        this.remember(placement)
        close(placement)
      }
      this.abandon = () => close(null)
      worker.addEventListener('message', settle)
      worker.addEventListener('error', failed)
      worker.postMessage(request)
    })
  }

  /** Drops remembered positions so the next solve lays the graph out afresh. */
  forget() { this.memory = [] }

  dispose() {
    this.disposed = true
    const waiting = this.pending
    this.pending = null
    waiting?.settle(null)
    // Terminating the worker means no answer is coming, so anything waiting on
    // one is settled here rather than left holding its scene forever.
    this.abandon?.()
    this.worker?.terminate()
    this.worker = null
  }
}
