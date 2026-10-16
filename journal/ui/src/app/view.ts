/**
 * The reading transform for the graph canvas.
 *
 * A journal graph is laid out in world units and drawn through one uniform
 * scale plus a translation. Fitting uses the real viewport on both axes, so a
 * wide pane shows a wide graph rather than a square inscribed in it, and the
 * detail drawn per frame is chosen from the scale alone — every record stays
 * loaded whatever the reader can currently resolve.
 */

import { LABEL_RESOLVE_MAX } from './force-layout'

export interface Viewport { width: number; height: number }
export interface Bounds { minX: number; minY: number; maxX: number; maxY: number }
export interface Transform { zoom: number; x: number; y: number }
export interface Extent { x: number; y: number; halfWidth: number; halfHeight: number }

export const MIN_ZOOM = 0.04
export const MAX_ZOOM = 3.2

export function clampZoom(zoom: number): number {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
}

/** The rectangle the drawn marks occupy, label boxes included. */
export function boundsOf(items: Extent[]): Bounds | null {
  if (!items.length) return null
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const item of items) {
    minX = Math.min(minX, item.x - item.halfWidth)
    maxX = Math.max(maxX, item.x + item.halfWidth)
    minY = Math.min(minY, item.y - item.halfHeight)
    maxY = Math.max(maxY, item.y + item.halfHeight)
  }
  return { minX, minY, maxX, maxY }
}

/**
 * The scale that puts `bounds` inside `viewport` with `pad` device pixels of
 * air, and the translation that centres it. Both axes are measured, so the fit
 * follows the pane's aspect ratio instead of assuming a square.
 */
export function fitTransform(bounds: Bounds | null, viewport: Viewport, pad = 44, maxZoom = 1.5): Transform {
  const width = Math.max(1, viewport.width)
  const height = Math.max(1, viewport.height)
  if (!bounds) return { zoom: 1, x: width / 2, y: height / 2 }
  const spanX = Math.max(1, bounds.maxX - bounds.minX)
  const spanY = Math.max(1, bounds.maxY - bounds.minY)
  const room = { width: Math.max(1, width - pad * 2), height: Math.max(1, height - pad * 2) }
  const zoom = clampZoom(Math.min(maxZoom, Math.min(room.width / spanX, room.height / spanY)))
  const centreX = (bounds.minX + bounds.maxX) / 2
  const centreY = (bounds.minY + bounds.maxY) / 2
  return { zoom, x: width / 2 - centreX * zoom, y: height / 2 - centreY * zoom }
}

/**
 * The world the layout solves in.
 *
 * The solver clamps every record inside the box it is given, so that box has to
 * be the shape of the pane the result will be read in — otherwise a wide pane
 * shows a square graph with air down both sides. Area grows with the record
 * count so a large graph gets room to spread instead of collapsing into a mat.
 *
 * The footprint follows the drawing tier: a reading-scale record occupies its
 * label block, not just its mark, and a world sized for marks squeezes the
 * label boxes until the surplus piles into a wall along the clamp edges.
 */
export const READING_FOOTPRINT = 11000
export const MARK_FOOTPRINT = 2600

export function layoutWorld(count: number, viewport: Viewport, perNode?: number): Viewport {
  const width = Math.max(320, viewport.width)
  const height = Math.max(240, viewport.height)
  const aspect = width / height
  const footprint = perNode ?? (count <= LABEL_RESOLVE_MAX ? READING_FOOTPRINT : MARK_FOOTPRINT)
  const area = Math.max(width * height, Math.max(1, count) * footprint)
  return { width: Math.round(Math.sqrt(area * aspect)), height: Math.round(Math.sqrt(area / aspect)) }
}

/** Zooms about a point in screen space, so the point under the cursor holds. */
export function zoomAbout(transform: Transform, factor: number, screenX: number, screenY: number): Transform {
  const zoom = clampZoom(transform.zoom * factor)
  const ratio = zoom / transform.zoom
  return { zoom, x: screenX - (screenX - transform.x) * ratio, y: screenY - (screenY - transform.y) * ratio }
}

export function toWorld(transform: Transform, screenX: number, screenY: number): { x: number; y: number } {
  return { x: (screenX - transform.x) / transform.zoom, y: (screenY - transform.y) / transform.zoom }
}

export function toScreen(transform: Transform, worldX: number, worldY: number): { x: number; y: number } {
  return { x: worldX * transform.zoom + transform.x, y: worldY * transform.zoom + transform.y }
}

/** The world rectangle currently on screen, grown by `margin` screen pixels. */
export function visibleWorld(transform: Transform, viewport: Viewport, margin = 96): Bounds {
  const grow = margin / transform.zoom
  const topLeft = toWorld(transform, 0, 0)
  const bottomRight = toWorld(transform, viewport.width, viewport.height)
  return {
    minX: topLeft.x - grow,
    minY: topLeft.y - grow,
    maxX: bottomRight.x + grow,
    maxY: bottomRight.y + grow,
  }
}

/**
 * The same test as `intersects`, taken on plain numbers. A frame culls every
 * record in the scene before it draws any of them, and a frame loop that has to
 * build an object per record to ask this question allocates once per record in
 * the whole graph on every repaint.
 */
export function intersectsBox(bounds: Bounds, x: number, y: number, halfWidth: number, halfHeight: number): boolean {
  return x + halfWidth >= bounds.minX
    && x - halfWidth <= bounds.maxX
    && y + halfHeight >= bounds.minY
    && y - halfHeight <= bounds.maxY
}

export function intersects(bounds: Bounds, item: Extent): boolean {
  return intersectsBox(bounds, item.x, item.y, item.halfWidth, item.halfHeight)
}

/**
 * What a frame draws. Every tier renders the same loaded data; only the ink
 * changes, so nothing is ever hidden by zooming out — the envelope tier says
 * how many records each territory holds instead of dropping them.
 */
export type Detail = 'envelope' | 'dot' | 'mark' | 'full'

/** The scale at which a 9px label is still legible. */
export const READING_ZOOM = 0.78

export function detailFor(zoom: number, visibleCount: number): Detail {
  if (zoom < 0.22 || (visibleCount > 2400 && zoom < 0.4)) return 'envelope'
  if (zoom < 0.42 || visibleCount > 1600) return 'dot'
  if (zoom < READING_ZOOM || visibleCount > 420) return 'mark'
  return 'full'
}

/**
 * How many names a frame can carry. Below reading scale only landmarks are
 * named; a dense frame names fewer so the type never overlaps into noise.
 */
export function labelBudget(zoom: number, visibleCount: number): number {
  if (zoom < 0.42) return 0
  // A frame denser than reading scale carries landmark names only: four
  // hundred labels over five hundred marks is ink, not names.
  if (zoom >= READING_ZOOM) return visibleCount <= 420 ? visibleCount : 48
  return Math.max(0, Math.min(48, Math.round(48 * ((zoom - 0.42) / (READING_ZOOM - 0.42)))))
}

/** Edges stop carrying arrowheads before they stop being drawn. */
export function edgeDetail(detail: Detail): { arrows: boolean; labels: boolean; curves: boolean } {
  return {
    arrows: detail === 'full',
    labels: detail === 'full',
    curves: detail === 'full' || detail === 'mark',
  }
}
