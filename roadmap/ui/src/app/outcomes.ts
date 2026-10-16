// The outcome ledger. Progress is weighted by status, so an outcome carrying
// three shipped bets and one idea reads as mostly done: `done` counts whole,
// `active` counts its own progress, everything else counts nothing, and
// `dropped` leaves the average entirely.

import { periodIndex } from './periods'
import type { Initiative, Outcome, RoadmapState } from './types'

export function initiativeWeight(initiative: Pick<Initiative, 'status' | 'progress'>): number {
  if (initiative.status === 'done') return 1
  if (initiative.status === 'active') return clamp(initiative.progress)
  return 0
}

function clamp(value: number): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}

/** Mean weight over the bets that still count; an empty outcome reads as zero. */
export function outcomeProgress(initiatives: Initiative[]): number {
  const counted = initiatives.filter(i => i.status !== 'dropped')
  if (!counted.length) return 0
  const total = counted.reduce((sum, i) => sum + initiativeWeight(i), 0)
  return total / counted.length
}

export interface OutcomeCard {
  outcome: Outcome | null
  initiatives: Initiative[]
  progress: number
}

export interface LedgerOptions {
  /** Rank the cards by progress instead of the roadmap's own outcome order. */
  sortByProgress?: boolean
}

/**
 * One card per outcome, plus a trailing card for bets filed under none — a bet
 * that serves no outcome has no row to live in, and the ledger says so rather
 * than hiding it.
 */
export function buildLedger(state: RoadmapState, options: LedgerOptions = {}): OutcomeCard[] {
  const kind = state.settings.period_kind
  const order = (a: Initiative, b: Initiative) => {
    const ai = periodIndex(a.start_period, kind)
    const bi = periodIndex(b.start_period, kind)
    if (ai !== bi) return (ai ?? Number.MAX_SAFE_INTEGER) - (bi ?? Number.MAX_SAFE_INTEGER)
    return a.sort_order - b.sort_order || a.title.localeCompare(b.title)
  }

  const cards: OutcomeCard[] = state.outcomes.map(outcome => {
    const initiatives = state.initiatives.filter(i => i.outcome_id === outcome.id).sort(order)
    return { outcome, initiatives, progress: outcomeProgress(initiatives) }
  })

  if (options.sortByProgress) cards.sort((a, b) => b.progress - a.progress)

  const known = new Set(state.outcomes.map(o => o.id))
  const unfiled = state.initiatives.filter(i => !i.outcome_id || !known.has(i.outcome_id)).sort(order)
  if (unfiled.length) cards.push({ outcome: null, initiatives: unfiled, progress: outcomeProgress(unfiled) })

  return cards
}

export function percent(progress: number): number {
  return Math.round(clamp(progress) * 100)
}
