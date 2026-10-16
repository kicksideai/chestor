import type { Command } from './commands'
import { EV, type Initiative, type RoadmapState } from './types'

/** The three fields a timeline drag can write; nothing else is optimistic. */
export interface PendingPlacement {
  start_period?: string
  span?: number
  layer_id?: string
}

export interface PendingMove {
  placement: PendingPlacement
  revision: number
}

export type PendingMoves = Map<string, PendingMove>

export function projectionTopic(threadId: string, projectionKind: string): string {
  return `kickside.thread.${threadId}.projection.${projectionKind}`
}

const PLACEMENT_KEYS = ['start_period', 'span', 'layer_id'] as const

export function rememberPendingMoves(pending: PendingMoves, commands: Command[], revision: number): void {
  for (const command of commands) {
    if (command.type !== EV.INITIATIVE_UPDATED) continue
    const id = String(command.body.id || '')
    if (!id) continue
    const placement: PendingPlacement = {}
    for (const key of PLACEMENT_KEYS) {
      if (command.body[key] === undefined) continue
      if (key === 'span') {
        const span = Number(command.body.span)
        if (Number.isFinite(span)) placement.span = span
        continue
      }
      placement[key] = String(command.body[key])
    }
    if (!Object.keys(placement).length) continue
    pending.set(id, { revision, placement })
  }
}

export function forgetPendingRevision(pending: PendingMoves, revision: number): void {
  for (const [id, value] of pending) {
    if (value.revision === revision) pending.delete(id)
  }
}

function reached(initiative: Initiative, placement: PendingPlacement): boolean {
  return (placement.start_period === undefined || initiative.start_period === placement.start_period)
    && (placement.span === undefined || initiative.span === placement.span)
    && (placement.layer_id === undefined || initiative.layer_id === placement.layer_id)
}

/**
 * A command response is optimistic; only a committed projection snapshot may
 * acknowledge a pending placement. Until then the local placement is overlaid,
 * so an older projection event can never pull a bar backwards on screen.
 */
export function reconcilePendingMoves(next: RoadmapState, pending: PendingMoves, committed: boolean): RoadmapState {
  if (!pending.size) return next

  const known = new Set((next.initiatives || []).map(i => i.id))
  for (const id of [...pending.keys()]) if (!known.has(id)) pending.delete(id)
  if (!pending.size) return next

  const initiatives = (next.initiatives || []).map(initiative => {
    const move = pending.get(initiative.id)
    if (!move) return initiative
    if (committed && reached(initiative, move.placement)) {
      pending.delete(initiative.id)
      return initiative
    }
    return { ...initiative, ...move.placement }
  })

  return { ...next, initiatives }
}
