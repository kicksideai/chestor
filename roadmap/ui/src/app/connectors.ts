// Dependency arrows. Both lenses that draw edges hand in rects measured from
// the rendered DOM, so an arrow always lands on the box the reader sees rather
// than on a second, independent guess at the layout.

import type { Dependency, DependencyKind, Rect } from './types'

export type Orientation = 'horizontal' | 'vertical'

export interface Connector {
  id: string
  d: string
  kind: DependencyKind
  /** On the traced chain of the current selection. */
  hot: boolean
}

/**
 * `from` → `to`. Horizontal runs right edge to left edge across time;
 * vertical runs the top of the lower band to the bottom of the upper one,
 * which is the direction a build order is read in.
 */
export function connectorPath(from: Rect, to: Rect, orientation: Orientation): string {
  if (orientation === 'vertical') {
    const x1 = from.x + from.width / 2
    const y1 = from.y
    const x2 = to.x + to.width / 2
    const y2 = to.y + to.height
    const my = (y1 + y2) / 2
    return `M${round(x1)},${round(y1)} C${round(x1)},${round(my)} ${round(x2)},${round(my)} ${round(x2)},${round(y2)}`
  }
  const x1 = from.x + from.width
  const y1 = from.y + from.height / 2
  const x2 = to.x
  const y2 = to.y + to.height / 2
  const reach = Math.max(16, (x2 - x1) / 2)
  return `M${round(x1)},${round(y1)} C${round(x1 + reach)},${round(y1)} ${round(x2 - reach)},${round(y2)} ${round(x2)},${round(y2)}`
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

export interface ConnectorOptions {
  orientation: Orientation
  /** Ids on the current chain; edges between two of them are drawn hot. */
  chain?: Set<string>
  /** With a selection set, only edges touching it are built (the timeline rule). */
  selectedOnly?: string | null
}

export function buildConnectors(edges: Dependency[], rects: Map<string, Rect>, options: ConnectorOptions): Connector[] {
  const chain = options.chain
  const selected = options.selectedOnly || ''
  const out: Connector[] = []
  for (const edge of edges || []) {
    if (selected && edge.from_id !== selected && edge.to_id !== selected) continue
    const from = rects.get(edge.from_id)
    const to = rects.get(edge.to_id)
    if (!from || !to) continue
    out.push({
      id: edge.id,
      d: connectorPath(from, to, options.orientation),
      kind: edge.kind,
      hot: Boolean(chain && chain.has(edge.from_id) && chain.has(edge.to_id)),
    })
  }
  return out
}
