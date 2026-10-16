// The timeline lens model: period columns from settings, bars packed into
// sub-rows per layer, milestone and today positions, and the pure half of
// dragging a bar. Everything here is derived from the snapshot; nothing in it
// reaches the network or the DOM.

import { buildConnectors, type Connector } from './connectors'
import { periodIndex, periodLabel, periodRange } from './periods'
import type { Dependency, Initiative, Layer, Milestone, Rect, RoadmapState } from './types'

export interface TimelineColumn {
  key: string
  label: string
  /** Absolute period ordinal, so a bar can be placed without re-parsing. */
  index: number
  current: boolean
}

export interface TimelineBar {
  initiative: Initiative
  /** 1-based grid column inside the visible window. */
  colStart: number
  /** Visible width in columns; the stored span may reach past the window. */
  span: number
  clippedStart: boolean
  clippedEnd: boolean
}

export interface TimelineLane {
  layer: Layer
  rows: TimelineBar[][]
  /** An idea without a start period is real work, just not a promise yet. */
  unscheduled: Initiative[]
  /** Scheduled, but entirely outside the visible window. */
  offscreen: Initiative[]
}

export interface MilestoneMark {
  milestone: Milestone
  /** The period the mark belongs to; every mark of one period shares a column. */
  period: string
  /** Row on the rail, 0 for the first mark of the period. */
  row: number
  /** Fraction of the column area, 0 at the window start and 1 at its end. */
  left: number
}

export interface MilestoneRail {
  marks: MilestoneMark[]
  /** Rows the rail has to be tall enough for; one even when it carries none. */
  rows: number
}

export interface TimelineModel {
  columns: TimelineColumn[]
  lanes: TimelineLane[]
  milestones: MilestoneMark[]
  /** How deep the rail is, so it can grow to fit the busiest period. */
  milestoneRows: number
  /** Fraction of the column area, or null when today sits outside the window. */
  todayPosition: number | null
}

interface Placement {
  initiative: Initiative
  start: number
  end: number
}

/**
 * Position of a period inside the window, as a fraction of the column area.
 * `offset` places the point inside its own column: 0 at the column's start,
 * 1 at its end, and the centre when the caller has nothing finer to say.
 */
export function periodPosition(key: string, originIndex: number, columns: number, kind: RoadmapState['settings']['period_kind'], offset = 0.5): number | null {
  const index = periodIndex(key, kind)
  if (index === null || columns <= 0) return null
  const position = (index - originIndex + offset) / columns
  if (position < 0 || position > 1) return null
  return position
}

/**
 * The fraction of the current period that has elapsed. A fraction outside the
 * period names no point inside it, so it reads as the nearest edge, and a
 * snapshot without the field reads as the centre of the column.
 */
function insidePeriod(position: number | undefined): number {
  if (typeof position !== 'number' || !Number.isFinite(position)) return 0.5
  return Math.min(1, Math.max(0, position))
}

function placements(initiatives: Initiative[], kind: RoadmapState['settings']['period_kind']): { placed: Placement[]; unscheduled: Initiative[] } {
  const placed: Placement[] = []
  const unscheduled: Initiative[] = []
  for (const initiative of initiatives) {
    const start = periodIndex(initiative.start_period, kind)
    if (start === null) { unscheduled.push(initiative); continue }
    const span = Math.max(1, Math.round(initiative.span) || 1)
    placed.push({ initiative, start, end: start + span - 1 })
  }
  // Longer commitments claim a row first, so a short bar fills the gap beside
  // one rather than pushing it down a row.
  placed.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start) || a.initiative.title.localeCompare(b.initiative.title))
  return { placed, unscheduled }
}

function pack(placed: Placement[]): Placement[][] {
  const rows: Placement[][] = []
  for (const item of placed) {
    let row = rows.find(r => r.every(other => item.start > other.end || item.end < other.start))
    if (!row) { row = []; rows.push(row) }
    row.push(item)
  }
  return rows
}

/**
 * Milestones of one period land on one column, so they stack into rows by
 * title instead of drawing over each other, and the rail states how deep it
 * has to be for the busiest period.
 */
export function milestoneRail(milestones: Milestone[], originIndex: number | null, columns: number, kind: RoadmapState['settings']['period_kind']): MilestoneRail {
  const byPeriod = new Map<string, { left: number; group: Milestone[] }>()
  for (const milestone of milestones || []) {
    if (originIndex === null) continue
    const existing = byPeriod.get(milestone.period)
    if (existing) { existing.group.push(milestone); continue }
    const left = periodPosition(milestone.period, originIndex, columns, kind)
    if (left === null) continue
    byPeriod.set(milestone.period, { left, group: [milestone] })
  }

  const marks: MilestoneMark[] = []
  let rows = 1
  for (const [period, { left, group }] of byPeriod) {
    group.sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id))
    rows = Math.max(rows, group.length)
    group.forEach((milestone, row) => marks.push({ milestone, period, row, left }))
  }
  return { marks, rows }
}

export interface TimelineOptions {
  /** Dropped work is hidden from the timeline by default (spec invariant 6). */
  includeDropped?: boolean
}

export function buildTimeline(state: RoadmapState, options: TimelineOptions = {}): TimelineModel {
  const kind = state.settings.period_kind
  const originIndex = periodIndex(state.settings.origin, kind)
  const count = Math.max(1, Math.floor(state.settings.columns) || 0)
  const keys = periodRange(state.settings.origin, count, kind)
  const columns: TimelineColumn[] = keys.map((key, i) => ({
    key,
    label: periodLabel(key, kind),
    index: (originIndex ?? 0) + i,
    current: key === state.current_period,
  }))

  const windowStart = originIndex ?? 0
  const windowEnd = windowStart + count - 1
  const visible = state.initiatives.filter(i => options.includeDropped || i.status !== 'dropped')

  const lanes: TimelineLane[] = state.layers.map(layer => {
    const mine = visible.filter(i => i.layer_id === layer.id)
    const { placed, unscheduled } = placements(mine, kind)
    const inside = placed.filter(p => p.end >= windowStart && p.start <= windowEnd)
    const offscreen = placed.filter(p => p.end < windowStart || p.start > windowEnd).map(p => p.initiative)
    const rows = pack(inside).map(row => row.map(item => {
      const from = Math.max(item.start, windowStart)
      const to = Math.min(item.end, windowEnd)
      return {
        initiative: item.initiative,
        colStart: from - windowStart + 1,
        span: to - from + 1,
        clippedStart: item.start < windowStart,
        clippedEnd: item.end > windowEnd,
      }
    }))
    return { layer, rows, unscheduled, offscreen }
  })

  const rail = milestoneRail(state.milestones, originIndex, count, kind)

  // The server states both the current period and how far into it now sits, so
  // the marker lands on the day rather than on the middle of the column.
  const todayPosition = originIndex === null ? null : periodPosition(state.current_period, originIndex, count, kind, insidePeriod(state.current_position))

  return { columns, lanes, milestones: rail.marks, milestoneRows: rail.rows, todayPosition }
}

/** Arrows for the current selection only; the timeline stays readable otherwise. */
export function timelineConnectors(dependencies: Dependency[], rects: Map<string, Rect>, selectedId: string | null, chain?: Set<string>): Connector[] {
  if (!selectedId) return []
  return buildConnectors(dependencies, rects, { orientation: 'horizontal', selectedOnly: selectedId, chain })
}

// ── Dragging ──

export type DragMode = 'move' | 'resize'

export interface DragInput {
  mode: DragMode
  /** Absolute period ordinal the bar started at. */
  startIndex: number
  span: number
  dx: number
  columnWidth: number
  /** Absolute ordinals the window allows a bar to be dropped between. */
  windowStart: number
  windowEnd: number
}

export interface DragResult {
  startIndex: number
  span: number
}

export function columnDelta(dx: number, columnWidth: number): number {
  if (!Number.isFinite(columnWidth) || columnWidth <= 0) return 0
  return Math.round(dx / columnWidth)
}

/**
 * A drag lands on whole periods: the model has no finer unit than a period, so
 * a half-column drop would have to invent one.
 */
export function resolveDrag(input: DragInput): DragResult {
  const delta = columnDelta(input.dx, input.columnWidth)
  const span = Math.max(1, Math.round(input.span) || 1)
  if (input.mode === 'resize') {
    const maxSpan = Math.max(1, input.windowEnd - input.startIndex + 1)
    return { startIndex: input.startIndex, span: Math.min(maxSpan, Math.max(1, span + delta)) }
  }
  const latest = Math.max(input.windowStart, input.windowEnd - span + 1)
  const startIndex = Math.min(latest, Math.max(input.windowStart, input.startIndex + delta))
  return { startIndex, span }
}

export interface LaneBand {
  layerId: string
  top: number
  bottom: number
}

/** Which lane a vertical drag is over; the nearest band when between two. */
export function laneAt(bands: LaneBand[], y: number): string | null {
  if (!bands.length) return null
  for (const band of bands) if (y >= band.top && y < band.bottom) return band.layerId
  let best = bands[0]
  let bestDistance = Infinity
  for (const band of bands) {
    const distance = y < band.top ? band.top - y : y - band.bottom
    if (distance < bestDistance) { bestDistance = distance; best = band }
  }
  return best.layerId
}
