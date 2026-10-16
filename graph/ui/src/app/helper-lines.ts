// Smart alignment guides for node dragging. While a node moves, its edges and
// center are compared against every other visible node; within tolerance the
// position snaps and a guide line reports why. Pure geometry — the canvas layer
// renders the guides and applies the snapped position.
export interface Rect {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface Guide {
  axis: 'x' | 'y'
  // The aligned coordinate in flow space (a vertical line at x, or horizontal at y).
  at: number
  // Span of the guide along the other axis, covering both aligned rects.
  from: number
  to: number
}

export interface SnapResult {
  x: number
  y: number
  guides: Guide[]
}

// index 1 is the center; centers align only with centers, edges only with
// edges — a mixed pair draws a guide nobody asked for.
function edgesX(r: Rect): number[] { return [r.x, r.x + r.width / 2, r.x + r.width] }
function edgesY(r: Rect): number[] { return [r.y, r.y + r.height / 2, r.y + r.height] }
function compatible(i: number, j: number): boolean { return (i === 1) === (j === 1) }

// Snap the dragged rect against the others. Returns the (possibly adjusted)
// position and the guides to draw. Guides report only for the winning snap on
// each axis, so at most one vertical and one horizontal line render at a time.
export function snapToGuides(dragged: Rect, others: Rect[], tolerance = 6): SnapResult {
  let bestX: { delta: number; at: number; other: Rect } | null = null
  let bestY: { delta: number; at: number; other: Rect } | null = null

  for (const other of others) {
    if (other.id === dragged.id || !other.width || !other.height) continue
    const ox = edgesX(other), dx = edgesX(dragged)
    for (let i = 0; i < ox.length; i++) {
      for (let j = 0; j < dx.length; j++) {
        if (!compatible(i, j)) continue
        const delta = ox[i] - dx[j]
        if (Math.abs(delta) <= tolerance && (!bestX || Math.abs(delta) < Math.abs(bestX.delta))) {
          bestX = { delta, at: ox[i], other }
        }
      }
    }
    const oy = edgesY(other), dy = edgesY(dragged)
    for (let i = 0; i < oy.length; i++) {
      for (let j = 0; j < dy.length; j++) {
        if (!compatible(i, j)) continue
        const delta = oy[i] - dy[j]
        if (Math.abs(delta) <= tolerance && (!bestY || Math.abs(delta) < Math.abs(bestY.delta))) {
          bestY = { delta, at: oy[i], other }
        }
      }
    }
  }

  const x = dragged.x + (bestX ? bestX.delta : 0)
  const y = dragged.y + (bestY ? bestY.delta : 0)
  const guides: Guide[] = []
  if (bestX) {
    guides.push({
      axis: 'x',
      at: bestX.at,
      from: Math.min(y, bestX.other.y),
      to: Math.max(y + dragged.height, bestX.other.y + bestX.other.height),
    })
  }
  if (bestY) {
    guides.push({
      axis: 'y',
      at: bestY.at,
      from: Math.min(x, bestY.other.x),
      to: Math.max(x + dragged.width, bestY.other.x + bestY.other.width),
    })
  }
  return { x, y, guides }
}
