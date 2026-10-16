// The horizon board. Horizon is derived, never stored: the server owns the
// authoritative rule and the client mirrors it here so a card can be grouped
// without a round trip. The rule lives in exactly one function.

import { periodIndex } from './periods'
import type { Horizon, Initiative, Layer, PeriodKind, RoadmapState } from './types'

/** Periods past the current one that still count as `next` rather than `later`. */
export const NEXT_REACH = 2

/**
 * `done`/`dropped` are behind us; unscheduled work and anything further out
 * than the next-reach is `later`; work already started or starting now is
 * `now`; everything between is `next`.
 */
export function horizonOf(initiative: Pick<Initiative, 'status' | 'start_period'>, currentPeriod: string, kind: PeriodKind): Horizon {
  if (initiative.status === 'done' || initiative.status === 'dropped') return 'past'
  const start = periodIndex(initiative.start_period, kind)
  const current = periodIndex(currentPeriod, kind)
  if (start === null || current === null) return 'later'
  if (start > current + NEXT_REACH) return 'later'
  if (start <= current) return 'now'
  return 'next'
}

export interface HorizonGroup {
  layer: Layer
  initiatives: Initiative[]
}

export interface HorizonColumn {
  horizon: Horizon
  title: string
  hint: string
  groups: HorizonGroup[]
  count: number
}

const COLUMN_COPY: Array<{ horizon: Horizon; title: string; hint: string }> = [
  { horizon: 'now', title: 'Now', hint: 'in flight or next up' },
  { horizon: 'next', title: 'Next', hint: 'after current work lands' },
  { horizon: 'later', title: 'Later', hint: 'directionally right, not scheduled' },
]

export interface HorizonOptions {
  /** The board is about open work; shipped and dropped bets are opt-in. */
  includePast?: boolean
}

export function buildHorizons(state: RoadmapState, options: HorizonOptions = {}): HorizonColumn[] {
  const kind = state.settings.period_kind
  const columns = options.includePast
    ? [...COLUMN_COPY, { horizon: 'past' as Horizon, title: 'Shipped', hint: 'done or dropped' }]
    : COLUMN_COPY

  return columns.map(copy => {
    const mine = state.initiatives.filter(i => horizonOf(i, state.current_period, kind) === copy.horizon)
    const groups: HorizonGroup[] = []
    for (const layer of state.layers) {
      const initiatives = mine.filter(i => i.layer_id === layer.id)
      if (initiatives.length) groups.push({ layer, initiatives })
    }
    return { ...copy, groups, count: mine.length }
  })
}

/** How many periods a card would have to move to land in the target horizon. */
export function scheduleFor(horizon: Horizon, currentPeriod: string, kind: PeriodKind): number | null {
  const current = periodIndex(currentPeriod, kind)
  if (current === null) return null
  if (horizon === 'now') return current
  if (horizon === 'next') return current + 1
  if (horizon === 'later') return current + NEXT_REACH + 1
  return null
}
