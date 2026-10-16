/**
 * The windowing maths for long lists.
 *
 * A journal outline is a ledger of every record in the focus window, so the
 * rendered range has to shrink while the scrollbar keeps reporting the whole
 * list. The window is the slice the reader can resolve plus a margin of
 * overscan; the two pads carry the rows that are not drawn, so the scroll
 * length never depends on how much is currently in the document.
 */

export interface Window {
  /** First rendered row. */
  start: number
  /** One past the last rendered row. */
  end: number
  /** Pixels standing in for the rows above the window. */
  padTop: number
  /** Pixels standing in for the rows below it. */
  padBottom: number
}

/** Rows kept beyond each edge so a scroll reveals drawn rows, not blanks. */
export const OVERSCAN = 4

const EMPTY: Window = { start: 0, end: 0, padTop: 0, padBottom: 0 }

/**
 * The rows to render for a scroll position, and the pads that hold the
 * scrollbar at its full length. A viewport taller than the list answers the
 * whole range; a scroll position past either end is pulled back inside it.
 */
export function windowFor(scrollTop: number, viewportHeight: number, rowHeight: number, count: number, overscan = OVERSCAN): Window {
  if (count <= 0 || rowHeight <= 0) return EMPTY
  const top = Math.max(0, scrollTop)
  const height = Math.max(0, viewportHeight)
  const first = Math.floor(top / rowHeight) - overscan
  const last = Math.ceil((top + height) / rowHeight) + overscan
  const start = Math.min(count - 1, Math.max(0, first))
  const end = Math.min(count, Math.max(start + 1, last))
  return { start, end, padTop: start * rowHeight, padBottom: (count - end) * rowHeight }
}

/** The row a pixel offset lands on, held inside the list. */
export function indexAt(offset: number, rowHeight: number, count: number): number {
  if (count <= 0 || rowHeight <= 0) return 0
  return Math.min(count - 1, Math.max(0, Math.floor(Math.max(0, offset) / rowHeight)))
}

/** Where a row starts, measured from the top of the list. */
export function offsetOf(index: number, rowHeight: number): number {
  return Math.max(0, index) * Math.max(0, rowHeight)
}

/**
 * The scroll position that brings a row into view, moving as little as
 * possible: a row already standing fully inside the viewport leaves the scroll
 * where the reader left it.
 */
export function scrollToShow(index: number, scrollTop: number, viewportHeight: number, rowHeight: number): number {
  const top = offsetOf(index, rowHeight)
  const bottom = top + Math.max(0, rowHeight)
  if (top < scrollTop) return top
  if (bottom > scrollTop + Math.max(0, viewportHeight)) return Math.max(0, bottom - Math.max(0, viewportHeight))
  return Math.max(0, scrollTop)
}
