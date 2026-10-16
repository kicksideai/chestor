import type { Command } from './commands'
import { EV, type GraphState, type LayoutPosition } from './types'

export interface PendingLayout {
  position: LayoutPosition
  revision: number
}

export type PendingLayouts = Map<string, PendingLayout>

export function projectionTopic(threadId: string, projectionKind: string): string {
  return `kickside.thread.${threadId}.projection.${projectionKind}`
}

export function rememberPendingLayouts(pending: PendingLayouts, commands: Command[], revision: number): void {
  for (const command of commands) {
    if (command.type !== EV.LAYOUT_POSITION_SET) continue
    const nodeId = String(command.body.node_id || '')
    const x = Number(command.body.x)
    const y = Number(command.body.y)
    if (!nodeId || !Number.isFinite(x) || !Number.isFinite(y)) continue
    pending.set(nodeId, {
      revision,
      position: {
        x,
        y,
        ...(Number.isFinite(Number(command.body.width)) ? { width: Number(command.body.width) } : {}),
        ...(Number.isFinite(Number(command.body.height)) ? { height: Number(command.body.height) } : {}),
      },
    })
  }
}

export function forgetPendingRevision(pending: PendingLayouts, revision: number): void {
  for (const [nodeId, value] of pending) {
    if (value.revision === revision) pending.delete(nodeId)
  }
}

function collectNodeIds(nodes: GraphState['nodes'], out = new Set<string>()): Set<string> {
  for (const node of nodes || []) {
    out.add(node.id)
    collectNodeIds(node.children || [], out)
  }
  return out
}

function samePosition(actual: LayoutPosition | undefined, expected: LayoutPosition): boolean {
  return actual?.x === expected.x && actual?.y === expected.y
}

// A command response is optimistic; only a committed projection snapshot may
// acknowledge a pending position. Until then, overlay the local position so an
// older projection event can never pull a node backwards on screen.
export function reconcilePendingLayouts(next: GraphState, pending: PendingLayouts, committed: boolean): GraphState {
  if (!pending.size) return next

  const nodeIds = collectNodeIds(next.nodes || [])
  const positions = { ...(next.layout?.positions || {}) }
  for (const [nodeId, value] of pending) {
    if (!nodeIds.has(nodeId)) {
      pending.delete(nodeId)
      delete positions[nodeId]
      continue
    }
    if (committed && samePosition(positions[nodeId], value.position)) {
      pending.delete(nodeId)
      continue
    }
    positions[nodeId] = value.position
  }

  return { ...next, layout: { ...(next.layout || {}), positions } }
}
