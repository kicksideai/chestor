// Alignment and distribution over a selection — pure geometry returning the new
// positions, so the caller commits them through the command pipeline and one
// undo restores the lot.
import type { Rect } from './helper-lines'

export type AlignMode = 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom'

export function alignRects(rects: Rect[], mode: AlignMode): Array<{ id: string; x: number; y: number }> {
  if (rects.length < 2) return []
  const left = Math.min(...rects.map(r => r.x))
  const right = Math.max(...rects.map(r => r.x + r.width))
  const top = Math.min(...rects.map(r => r.y))
  const bottom = Math.max(...rects.map(r => r.y + r.height))
  const cx = (left + right) / 2
  const cy = (top + bottom) / 2
  return rects.map(r => {
    let x = r.x
    let y = r.y
    if (mode === 'left') x = left
    else if (mode === 'right') x = right - r.width
    else if (mode === 'center-h') x = Math.round(cx - r.width / 2)
    else if (mode === 'top') y = top
    else if (mode === 'bottom') y = bottom - r.height
    else if (mode === 'center-v') y = Math.round(cy - r.height / 2)
    return { id: r.id, x, y }
  })
}

// Distribute keeps the first and last (by position) fixed and spaces the rest
// with equal gaps between neighbors.
export function distributeRects(rects: Rect[], axis: 'h' | 'v'): Array<{ id: string; x: number; y: number }> {
  if (rects.length < 3) return []
  const sorted = [...rects].sort((a, b) => (axis === 'h' ? a.x - b.x : a.y - b.y))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const sizes = sorted.reduce((sum, r) => sum + (axis === 'h' ? r.width : r.height), 0)
  const span = axis === 'h'
    ? (last.x + last.width) - first.x
    : (last.y + last.height) - first.y
  const gap = (span - sizes) / (sorted.length - 1)
  const out: Array<{ id: string; x: number; y: number }> = []
  let cursor = axis === 'h' ? first.x : first.y
  for (const r of sorted) {
    out.push({ id: r.id, x: axis === 'h' ? Math.round(cursor) : r.x, y: axis === 'v' ? Math.round(cursor) : r.y })
    cursor += (axis === 'h' ? r.width : r.height) + gap
  }
  return out
}
