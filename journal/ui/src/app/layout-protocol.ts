import { forceLayout } from './force-layout'
import type { GraphEdge, GraphNode } from './types'

/**
 * What crosses the worker boundary. Only what the solver reads is sent, so a
 * chunk of five thousand records copies its ids and shape rather than its
 * bodies, and results come back as transferable buffers.
 */

/** The fields `forceLayout` reads. Everything else stays on the reading thread. */
export type WireNode = Pick<GraphNode, 'id' | 'kind' | 'label' | 'parent_id' | 'pinned' | 'x' | 'y'>
    & { metadata?: { x?: unknown; y?: unknown } }

export interface LayoutRequest {
  generation: number
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
  emphasis: string[]
  previous: Array<[string, number, number]>
  held: Array<[string, number, number]>
  /** Ignore persisted x/y for this solve; a reader-requested re-layout. */
  unpin?: boolean
}

export interface LayoutResult {
  generation: number
  ids: string[]
  labels: string[][]
  /** x, y per record, in solve order. */
  positions: Float32Array
  /** radius, halfWidth, top, bottom, degree per record, in solve order. */
  geometry: Float32Array
  width: number
  height: number
  ms: number
}

export const GEOMETRY_STRIDE = 5

/** Strips a projected record down to what the solve needs. */
export function wireNode(node: GraphNode): GraphNode {
  const value: WireNode = {
    id: node.id,
    kind: node.kind,
    label: node.label,
    parent_id: node.parent_id,
    pinned: node.pinned,
    x: node.x,
    y: node.y,
  }
  const x = node.metadata?.x
  const y = node.metadata?.y
  if (x !== undefined || y !== undefined) value.metadata = { x, y }
  return value as GraphNode
}

/** Strips a relation down to the endpoints and the kind the solve reads. */
export function wireEdge(edge: GraphEdge): GraphEdge {
  return { id: edge.id, from: edge.from, to: edge.to, kind: edge.kind } as GraphEdge
}

/**
 * One solve, packed for transfer. The worker and the direct call share this
 * body, so a runtime without workers reads exactly the same layout rather than
 * a second, quieter implementation of it.
 */
export function solveLayout(request: LayoutRequest): LayoutResult {
  const started = Date.now()
  const previous = new Map(request.previous.map(([id, x, y]) => [id, { px: x, py: y }]))
  const held = new Map(request.held.map(([id, x, y]) => [id, { px: x, py: y }]))
  const placed = forceLayout(
    request.nodes, request.edges, request.width, request.height,
    new Set(request.emphasis), previous, held, { unpin: request.unpin },
  )
  const ids: string[] = new Array(placed.length)
  const labels: string[][] = new Array(placed.length)
  const positions = new Float32Array(placed.length * 2)
  const geometry = new Float32Array(placed.length * GEOMETRY_STRIDE)
  for (let index = 0; index < placed.length; index++) {
    const node = placed[index]
    ids[index] = node.id
    labels[index] = node.box.lines
    positions[index * 2] = node.px
    positions[index * 2 + 1] = node.py
    const at = index * GEOMETRY_STRIDE
    geometry[at] = node.box.radius
    geometry[at + 1] = node.box.halfWidth
    geometry[at + 2] = node.box.top
    geometry[at + 3] = node.box.bottom
    geometry[at + 4] = node.degree
  }
  return {
    generation: request.generation,
    ids,
    labels,
    positions,
    geometry,
    width: request.width,
    height: request.height,
    ms: Date.now() - started,
  }
}
