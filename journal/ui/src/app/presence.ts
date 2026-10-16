import { isAgentNode } from './tree'
import type { AgentPresence, GraphEdge, GraphNode, JournalCursor } from './types'

/** A presence that has not moved for a day is history, so it renders quietly. */
export const STALE_AFTER_S = 86400

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export interface AgentIdentity { label: string; initials: string; short: string }

function key(value: string | undefined): string { return (value || '').trim().toLowerCase() }

/** FNV-1a over the raw id: one id always draws the same two letters. */
function hashedInitials(id: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < id.length; index++) {
    hash ^= id.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return ALPHABET[hash % 26] + ALPHABET[(hash >>> 8) % 26]
}

function spokenInitials(text: string): string {
  const words = text.split(/\s+/).filter(Boolean)
  if (!words.length) return '??'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * Connection ids are UUIDs, so a presence has to be nameable without a name.
 * Whatever the id says in words is kept, the last characters keep two agents
 * on the same transport apart, and the initials are drawn from the id itself
 * whenever the readable part is generated rather than chosen.
 */
export function agentIdentity(id: string, name?: string): AgentIdentity {
  const raw = (id || '').trim()
  const given = (name || '').trim()
  const short = (raw.replace(/[^a-z0-9]/gi, '').slice(-6) || 'unknown').toUpperCase()
  const spoken = given && !UUID.test(given)
    ? given
    : raw.replace(UUID, ' ').replace(/[-_.:/]+/g, ' ').replace(/\s+/g, ' ').trim()
  const generated = !spoken || UUID.test(raw)
  const readable = spoken.length > 24 ? `${spoken.slice(0, 23)}…` : spoken
  const named = readable ? readable.charAt(0).toUpperCase() + readable.slice(1) : ''
  return {
    label: named ? (generated ? `${named} ${short}` : named) : `Agent ${short}`,
    initials: generated ? hashedInitials(raw || short) : spokenInitials(readable),
    short,
  }
}

function attribute(node: GraphNode, name: string): string {
  const value = (node.metadata as Record<string, unknown> | undefined)?.[name]
    ?? (node.attrs as Record<string, unknown> | undefined)?.[name]
  return typeof value === 'string' ? value : ''
}

/**
 * Agent and cursor records describe where a writer stands, not what the graph
 * knows. The position is carried either by a presence relation or by the
 * record's own `position` attribute; both resolve to a node in this window.
 */
export function agentPresence(nodes: GraphNode[], edges: GraphEdge[]): AgentPresence[] {
  const byId = new Map(nodes.map(node => [node.id, node]))
  const viaEdge = new Map<string, string>()
  for (const edge of edges) {
    if (/^(positioned_at|focused_on|assigned_to)$/i.test(edge.kind)) viaEdge.set(edge.from, edge.to)
  }
  return nodes.filter(isAgentNode).map(node => {
    const positionId = viaEdge.get(node.id) || attribute(node, 'position')
    const target = positionId ? byId.get(positionId) : undefined
    return {
      id: node.id,
      label: node.label,
      initials: agentIdentity(node.id, node.label).initials,
      purpose: attribute(node, 'purpose') || node.summary || 'Recorded position',
      status: String(node.status || 'active').toLowerCase(),
      next: attribute(node, 'next') || undefined,
      exitCondition: attribute(node, 'exit_condition') || undefined,
      positionId: target ? target.id : undefined,
      positionLabel: target ? target.label : positionId || undefined,
      updated_at: node.updated_at,
      source: 'graph' as const,
      stale: false,
    }
  })
}

/** The names a projected record answers to when a cursor row looks for it. */
function identityKeys(node: GraphNode): string[] {
  return [node.id, node.semantic_key, attribute(node, 'cursor_id'), attribute(node, 'agent_id')]
    .map(key)
    .filter(Boolean)
}

function purposeOf(cursor: JournalCursor): string {
  if (cursor.purpose) return cursor.purpose
  if (cursor.checkpoint?.headline) return cursor.checkpoint.headline
  return cursor.origin === 'auto' ? 'Position tracked while working' : 'Recorded position'
}

function fromCursor(cursor: JournalCursor, nodes: Map<string, GraphNode>, graphId: string): AgentPresence {
  const identity = agentIdentity(cursor.agent_id || cursor.cursor_id)
  const held = cursor.position && cursor.position.graph_id === graphId && nodes.has(cursor.position.node_id)
    ? nodes.get(cursor.position.node_id)
    : undefined
  const touched = (cursor.last_touch?.positions || [])
    .find(item => item.graph_id === graphId && nodes.has(item.node_id))
  return {
    id: `cursor:${cursor.cursor_id}`,
    label: identity.label,
    initials: identity.initials,
    purpose: purposeOf(cursor),
    status: String(cursor.state || 'active').toLowerCase(),
    positionId: held?.id,
    positionLabel: held?.label || cursor.position?.node_id,
    updated_at: cursor.updated_at,
    source: 'cursor',
    origin: cursor.origin,
    cursorId: cursor.cursor_id,
    agentId: cursor.agent_id,
    lastSeenSeq: cursor.last_seen_seq,
    touchNodeId: touched?.node_id,
    touchLabel: touched?.label || cursor.last_touch?.positions?.[0]?.label || cursor.last_touch?.title,
    stale: false,
  }
}

/**
 * One presence layer from two sources. The projected agent record says what an
 * agent declared about itself; the cursor store says where the protocol
 * actually left it. A cursor that names a projected record is the same
 * presence and keeps one pin, carrying its watermark onto the record's pin;
 * a cursor nothing projected stands on its own, positioned only if it holds an
 * address inside this window.
 */
export function mergePresence(
  nodes: GraphNode[],
  edges: GraphEdge[],
  cursors: JournalCursor[],
  graphId: string,
  nowS: number,
): AgentPresence[] {
  const merged = agentPresence(nodes, edges)
  const byId = new Map(merged.map(agent => [agent.id, agent]))
  const byIdentity = new Map<string, AgentPresence>()
  for (const node of nodes) {
    const agent = isAgentNode(node) ? byId.get(node.id) : undefined
    if (!agent) continue
    for (const name of identityKeys(node)) if (!byIdentity.has(name)) byIdentity.set(name, agent)
  }
  const nodeById = new Map(nodes.map(node => [node.id, node]))
  for (const cursor of cursors) {
    const match = byIdentity.get(key(cursor.cursor_id)) || byIdentity.get(key(cursor.agent_id))
    if (!match) {
      merged.push(fromCursor(cursor, nodeById, graphId))
      continue
    }
    const carried = fromCursor(cursor, nodeById, graphId)
    match.source = 'both'
    match.origin = cursor.origin
    match.cursorId = cursor.cursor_id
    match.agentId = cursor.agent_id
    match.lastSeenSeq = cursor.last_seen_seq
    match.updated_at = Math.max(match.updated_at, cursor.updated_at)
    match.touchNodeId = match.touchNodeId || carried.touchNodeId
    match.touchLabel = match.touchLabel || carried.touchLabel
    if (!match.positionId && carried.positionId) {
      match.positionId = carried.positionId
      match.positionLabel = carried.positionLabel
    }
  }
  for (const agent of merged) agent.stale = nowS - agent.updated_at > STALE_AFTER_S
  return merged.sort((a, b) => b.updated_at - a.updated_at || a.label.localeCompare(b.label))
}

/** Records a present agent's watermark last landed on, for the halo layer. */
export function touchedNodeIds(presence: AgentPresence[]): Set<string> {
  const ids = new Set<string>()
  for (const agent of presence) if (agent.touchNodeId && !agent.stale) ids.add(agent.touchNodeId)
  return ids
}
