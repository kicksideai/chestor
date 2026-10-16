import { identityKey } from './agents'
import { agentIdentity } from './presence'
import type { ActivityBucket, WorkSpan } from './types'

/** A journal minutes old still deserves a readable chart, so the window never closes tighter than this. */
export const LANE_MIN_WINDOW_S = 300

/**
 * Journal work is bursts separated by idle stretches, so a linear clock spends
 * most of the chart on nothing. The scale keeps time linear inside each active
 * stretch and folds every idle stretch to a fixed sliver that says how long it
 * was — the reader sees the work at reading size and the idleness as a labelled
 * break, never as a wall of whitespace and never hidden.
 */

/** Quiet shorter than this belongs to the burst around it. */
export const BRIDGE_S = 45 * 60
/** The chart never splinters into more stretches than a reader can follow. */
export const MAX_ACTIVE_SEGMENTS = 10
/** The share of the chart one folded idle stretch occupies. */
export const GAP_SHARE = 0.032

export interface ScaleSegment { from: number; to: number; x0: number; x1: number; idle: boolean }
export interface RulerMark { at: number; offset: number; label: string }
export interface GapChip { offset: number; width: number; seconds: number; label: string }

export interface TimeScale {
  from: number
  to: number
  segments: ScaleSegment[]
  marks: RulerMark[]
  gaps: GapChip[]
}

export interface LaneSpan {
  spanId: string
  startedAt: number
  endedAt: number
  open: boolean
  purpose: string
  factCount: number
  outcome: string
}

export interface LaneTick { at: number; events: number }

export interface Lane {
  agentId: string
  label: string
  initials: string
  unattributed: boolean
  spans: LaneSpan[]
  ticks: LaneTick[]
  events: number
  lastActivityAt: number
}

/** Work the journal recorded outside any identity's span rides its own lane. */
export const JOURNAL_LANE = '·journal'

function moments(spans: WorkSpan[], buckets: ActivityBucket[], widthS: number, nowS: number): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (const span of spans) {
    if (!span.started_at) continue
    const end = span.state === 'open' ? nowS : (span.ended_at || span.last_activity_at || span.started_at)
    out.push([span.started_at, Math.max(span.started_at, end)])
  }
  for (const bucket of buckets) {
    if (!bucket.bucket_at) continue
    // The current bucket's nominal end is in the future; the chart ends at the
    // present moment, never past it.
    out.push([Math.min(bucket.bucket_at, nowS), Math.min(bucket.bucket_at + Math.max(60, widthS), nowS)])
  }
  return out
}

function merge(intervals: Array<[number, number]>, bridge: number): Array<[number, number]> {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const out: Array<[number, number]> = []
  for (const [from, to] of sorted) {
    const last = out[out.length - 1]
    if (last && from - last[1] <= bridge) last[1] = Math.max(last[1], to)
    else out.push([from, to])
  }
  return out
}

export function humanDuration(seconds: number): string {
  if (seconds < 90 * 60) return `${Math.max(1, Math.round(seconds / 60))}m`
  if (seconds < 36 * 3600) return `${Math.round(seconds / 3600)}h`
  return `${(seconds / 86400).toFixed(1)}d`
}

function markLabel(at: number, chartSpanS: number): string {
  const date = new Date(at * 1000)
  const day = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  const clock = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (chartSpanS > 30 * 86400) return day
  if (chartSpanS > 40 * 3600) return `${day} ${clock}`
  return clock
}

/**
 * The piecewise scale over everything that happened. Active stretches share the
 * chart in proportion to how long they really ran; each idle stretch between
 * them is folded to one labelled sliver. The stretch from the last activity to
 * the present moment obeys the same rule, so a quiet journal ends in an
 * explicit "idle since" break with now on the right edge, not in a bar
 * stretched across dead time.
 */
export function buildTimeScale(spans: WorkSpan[], buckets: ActivityBucket[], widthS: number, nowS: number): TimeScale {
  let intervals = moments(spans, buckets, widthS, nowS)
  if (!intervals.length) intervals = [[nowS - LANE_MIN_WINDOW_S, nowS]]
  // Now is always on the chart: reaching it through a folded gap when the
  // journal has been quiet, and through the live stretch when it has not.
  intervals.push([nowS - 60, nowS])
  let bridge = BRIDGE_S
  let active = merge(intervals, bridge)
  while (active.length > MAX_ACTIVE_SEGMENTS) {
    bridge *= 2
    active = merge(intervals, bridge)
  }

  const gapsCount = active.length - 1
  const gapTotal = gapsCount * GAP_SHARE
  const activeTotal = Math.max(1e-9, 1 - gapTotal)
  const activeSpan = Math.max(1, active.reduce((sum, [from, to]) => sum + Math.max(1, to - from), 0))

  const segments: ScaleSegment[] = []
  const gaps: GapChip[] = []
  let x = 0
  for (let index = 0; index < active.length; index++) {
    const [from, to] = active[index]
    const width = (Math.max(1, to - from) / activeSpan) * activeTotal
    segments.push({ from, to, x0: x, x1: x + width, idle: false })
    x += width
    const next = active[index + 1]
    if (next) {
      const seconds = next[0] - to
      segments.push({ from: to, to: next[0], x0: x, x1: x + GAP_SHARE, idle: true })
      gaps.push({ offset: x, width: GAP_SHARE, seconds, label: `${humanDuration(seconds)} idle` })
      x += GAP_SHARE
    }
  }
  const last = segments[segments.length - 1]
  if (last) last.x1 = 1

  const from = active[0][0]
  const to = active[active.length - 1][1]
  const chartSpanS = Math.max(LANE_MIN_WINDOW_S, to - from)

  const marks: RulerMark[] = []
  // Ruler type never overlaps: a mark landing on the previous one yields, and
  // a dated label is a wider block than a bare clock, so it claims more room.
  const clearance = chartSpanS > 40 * 3600 ? 0.105 : 0.055
  const place = (at: number, offset: number) => {
    const previous = marks[marks.length - 1]
    if (previous && offset - previous.offset < clearance) return
    marks.push({ at, offset, label: markLabel(at, chartSpanS) })
  }
  for (const segment of segments) {
    if (segment.idle) continue
    place(segment.from, segment.x0)
    if (segment.x1 - segment.x0 > 0.24) {
      const midAt = (segment.from + segment.to) / 2
      place(midAt, (segment.x0 + segment.x1) / 2)
    }
  }
  // The right edge always names the present moment; a mark crowding it yields.
  while (marks.length && 1 - marks[marks.length - 1].offset < clearance) marks.pop()
  marks.push({ at: to, offset: 1, label: markLabel(to, chartSpanS) })

  return { from, to, segments, marks, gaps }
}

/** Where a moment sits across the chart. Anything outside sits on an edge, never off it. */
export function scaleOffset(at: number, scale: TimeScale): number {
  if (at <= scale.from) return 0
  if (at >= scale.to) return 1
  for (const segment of scale.segments) {
    if (at > segment.to) continue
    const span = Math.max(1, segment.to - segment.from)
    return segment.x0 + ((at - segment.from) / span) * (segment.x1 - segment.x0)
  }
  return 1
}

export function scaleExtent(span: LaneSpan, scale: TimeScale): { start: number; width: number } {
  const start = scaleOffset(span.startedAt, scale)
  const end = scaleOffset(span.endedAt, scale)
  return { start, width: Math.max(0, end - start) }
}

function laneSpan(span: WorkSpan, nowS: number): LaneSpan {
  const open = span.state === 'open'
  return {
    spanId: span.span_id,
    startedAt: span.started_at,
    endedAt: open ? Math.max(nowS, span.last_activity_at) : (span.ended_at || span.last_activity_at),
    open,
    purpose: span.working_on?.text || span.last_fact?.title || '',
    factCount: span.fact_count || 0,
    outcome: span.closed_reason || (open ? 'open' : 'sealed'),
  }
}

/**
 * One lane per agent identity, carrying that agent's spans and the buckets the
 * journal attributed to it. Activity nothing attributed — everything written
 * before spans existed, and anything recorded outside one — rides the journal's
 * own unattributed lane, so the chart always accounts for every fact.
 */
export function buildLanes(spans: WorkSpan[], buckets: ActivityBucket[], nowS: number): Lane[] {
  const lanes = new Map<string, Lane>()

  function lane(agentId: string | undefined, cursorId: string | undefined): Lane {
    const key = identityKey(agentId, cursorId)
    const held = lanes.get(key)
    if (held) return held
    const identity = agentIdentity(agentId || cursorId || key)
    const created: Lane = {
      agentId: key,
      label: identity.label,
      initials: identity.initials,
      unattributed: false,
      spans: [],
      ticks: [],
      events: 0,
      lastActivityAt: 0,
    }
    lanes.set(key, created)
    return created
  }

  for (const span of spans) {
    const row = lane(span.agent_id, span.cursor_id)
    const drawn = laneSpan(span, nowS)
    row.spans.push(drawn)
    row.lastActivityAt = Math.max(row.lastActivityAt, span.last_activity_at, span.ended_at || 0)
  }
  for (const bucket of buckets) {
    let row: Lane
    if (bucket.agent_id) {
      row = lane(bucket.agent_id, '')
    } else {
      row = lanes.get(JOURNAL_LANE) || (() => {
        const created: Lane = {
          agentId: JOURNAL_LANE, label: 'Journal · unattributed', initials: '·',
          unattributed: true, spans: [], ticks: [], events: 0, lastActivityAt: 0,
        }
        lanes.set(JOURNAL_LANE, created)
        return created
      })()
    }
    row.ticks.push({ at: bucket.bucket_at, events: bucket.events || 0 })
    row.events += bucket.events || 0
    row.lastActivityAt = Math.max(row.lastActivityAt, bucket.last_ts || bucket.bucket_at)
  }

  for (const row of lanes.values()) {
    row.spans.sort((a, b) => a.startedAt - b.startedAt)
    row.ticks.sort((a, b) => a.at - b.at)
  }
  // Identities first, most recently active on top; the unattributed roll last.
  return [...lanes.values()].sort((a, b) =>
    Number(a.unattributed) - Number(b.unattributed)
    || b.lastActivityAt - a.lastActivityAt
    || a.label.localeCompare(b.label))
}

/**
 * The task a span was opened on. A span states it directly when the protocol
 * carried one, and otherwise says so in what the identity declared it was
 * working on.
 */
export function spanTaskId(span: WorkSpan): string {
  return span.task_id || (span.working_on?.kind === 'task' ? span.working_on.text || '' : '')
}

/** The two things a lane bar stands for; either may be empty. */
export interface SpanTarget { taskId: string; agentId: string }

/**
 * What pressing a lane bar is asking for. A span is one identity's stretch of
 * work on one task, so the bar names both: the task is what a reader is
 * reaching for, and the identity is what remains reachable when the task is not
 * on the open canvas.
 */
export function spanTarget(spans: WorkSpan[], spanId: string): SpanTarget | null {
  const span = spans.find(item => item.span_id === spanId)
  if (!span) return null
  return { taskId: spanTaskId(span), agentId: (span.agent_id || span.cursor_id || '').trim() }
}
