// Selection tracing. A dependency `from → to` reads "to needs from, from
// unlocks to"; `requires` is the hard edge and the only one on a chain, while
// `informs` is drawn but never traced (§1 of the spec defines unlocks as the
// inverse of the requires edges).

import type { Dependency } from './types'

export interface DependencyIndex {
  /** initiative id → the ids it needs (its requires predecessors). */
  needs: Map<string, string[]>
  /** initiative id → the ids it unlocks (its requires successors). */
  unlocks: Map<string, string[]>
}

export function indexDependencies(dependencies: Dependency[], kind: 'requires' | 'all' = 'requires'): DependencyIndex {
  const needs = new Map<string, string[]>()
  const unlocks = new Map<string, string[]>()
  for (const dep of dependencies || []) {
    if (kind === 'requires' && dep.kind !== 'requires') continue
    if (!dep.from_id || !dep.to_id) continue
    const to = needs.get(dep.to_id) || []
    to.push(dep.from_id)
    needs.set(dep.to_id, to)
    const from = unlocks.get(dep.from_id) || []
    from.push(dep.to_id)
    unlocks.set(dep.from_id, from)
  }
  return { needs, unlocks }
}

function walk(start: string, adjacency: Map<string, string[]>, transitive: boolean): Set<string> {
  const seen = new Set<string>()
  const queue = [...(adjacency.get(start) || [])]
  while (queue.length) {
    const id = queue.shift() as string
    if (id === start || seen.has(id)) continue
    seen.add(id)
    if (transitive) queue.push(...(adjacency.get(id) || []))
  }
  return seen
}

export interface Trace {
  selected: string
  needs: Set<string>
  unlocks: Set<string>
  /** Every id the chain touches, the selection included: the set that stays lit. */
  chain: Set<string>
}

export const EMPTY_TRACE: Trace = { selected: '', needs: new Set(), unlocks: new Set(), chain: new Set() }

/**
 * What the selection needs and what it unlocks. Direct by default (the arrows
 * the timeline draws); transitive for strata, where the point of the lens is
 * the whole build order above and below one band.
 */
export function traceSelection(id: string | null, index: DependencyIndex, transitive = false): Trace {
  if (!id) return EMPTY_TRACE
  const needs = walk(id, index.needs, transitive)
  const unlocks = walk(id, index.unlocks, transitive)
  const chain = new Set<string>([id, ...needs, ...unlocks])
  return { selected: id, needs, unlocks, chain }
}

/** The edges whose two ends both sit on the traced chain, for arrow drawing. */
export function chainEdges(dependencies: Dependency[], trace: Trace): Dependency[] {
  if (!trace.selected) return []
  return (dependencies || []).filter(dep => dep.to_id === trace.selected || dep.from_id === trace.selected)
}

/**
 * How much one initiative blocks: the count of everything downstream of it on
 * the requires graph. This is the client mirror of the server's
 * `blocking_score`, expressed through the same traversal the chain uses.
 */
export function blockingScore(id: string, index: DependencyIndex): number {
  return walk(id, index.unlocks, true).size
}

export function rankByBlocking(ids: string[], index: DependencyIndex): Array<{ id: string; score: number }> {
  return ids
    .map(id => ({ id, score: blockingScore(id, index) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
}
