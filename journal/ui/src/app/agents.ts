import type { JournalCursor, WorkSpan } from './types'

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export interface AgentIdentity { label: string; initials: string }

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
 * Connection ids are UUIDs, so an agent has to be nameable without a name.
 * Whatever the id says in words is kept, the last characters keep two agents
 * on the same transport apart, and the initials are drawn from the id itself
 * whenever the readable part is generated rather than chosen.
 */
export function agentIdentity(id: string): AgentIdentity {
  const raw = (id || '').trim()
  const short = (raw.replace(/[^a-z0-9]/gi, '').slice(-6) || 'unknown').toUpperCase()
  const spoken = raw.replace(UUID, ' ').replace(/[-_.:/]+/g, ' ').replace(/\s+/g, ' ').trim()
  const generated = !spoken || UUID.test(raw)
  const readable = spoken.length > 24 ? `${spoken.slice(0, 23)}…` : spoken
  const named = readable ? readable.charAt(0).toUpperCase() + readable.slice(1) : ''
  return {
    label: named ? (generated ? `${named} ${short}` : named) : `Agent ${short}`,
    initials: generated ? hashedInitials(raw || short) : spokenInitials(readable),
  }
}


/** How present an agent is: writing in this session, seen this working day, or history. */
export type Liveness = 'now' | 'today' | 'older'

/** An hour is the reach of a working session, a day the reach of a working day. */
export const NOW_WITHIN_S = 3600
export const TODAY_WITHIN_S = 86400

export function livenessOf(lastActivityAt: number, nowS: number): Liveness {
  const idle = nowS - lastActivityAt
  if (idle <= NOW_WITHIN_S) return 'now'
  if (idle <= TODAY_WITHIN_S) return 'today'
  return 'older'
}

export interface AgentRow {
  id: string
  agentId: string
  cursorId: string
  label: string
  initials: string
  liveness: Liveness
  /** What the agent said it is working on, else the checkpoint headline, else a stated fallback. */
  purpose: string
  /** The headline of the last fact this agent wrote, for the card body. */
  headline: string
  lastActivityAt: number
  openSpans: number
  factCount: number
  /** True while at least one activity span for this identity is still open; this is not lease authority. */
  working: boolean
  origin: 'auto' | 'explicit' | ''
  lastSeenSeq: number
  lastTouch?: JournalCursor['last_touch']
  spanTask?: { id: string; at: number }
}

/**
 * The name an agent answers to across both stores. The cursor id stands in
 * whenever the protocol never learned an agent id, so a nameless writer is
 * still one presence rather than one row per record that mentions it.
 */
function identityKey(agentId: string | undefined, cursorId: string | undefined): string {
  const agent = (agentId || '').trim()
  if (agent) return agent
  const cursor = (cursorId || '').trim()
  return cursor ? `cursor:${cursor}` : ''
}

function fallbackPurpose(origin: 'auto' | 'explicit' | ''): string {
  return origin === 'auto' ? 'Position tracked while working' : 'Recorded position'
}

function blank(id: string): AgentRow {
  return {
    id,
    agentId: '',
    cursorId: '',
    label: '',
    initials: '',
    liveness: 'older',
    purpose: '',
    headline: '',
    lastActivityAt: 0,
    openSpans: 0,
    factCount: 0,
    working: false,
    origin: '',
    lastSeenSeq: 0,
  }
}

/**
 * Everything one identity accumulated under a name it turned out to share.
 * Counts add, timestamps take the newest, and a field the surviving row has
 * already been told keeps what it was told.
 */
function absorb(into: AgentRow, other: AgentRow): void {
  into.agentId = into.agentId || other.agentId
  into.cursorId = into.cursorId || other.cursorId
  into.origin = into.origin || other.origin
  into.lastActivityAt = Math.max(into.lastActivityAt, other.lastActivityAt)
  into.lastSeenSeq = Math.max(into.lastSeenSeq, other.lastSeenSeq)
  into.factCount += other.factCount
  into.openSpans += other.openSpans
  into.purpose = into.purpose || other.purpose
  into.headline = into.headline || other.headline
  if (other.lastTouch && other.lastTouch.seq > (into.lastTouch?.seq || 0)) into.lastTouch = other.lastTouch
  if (other.spanTask && other.spanTask.at > (into.spanTask?.at ?? -1)) into.spanTask = other.spanTask
}

/**
 * Every agent the journal knows of. The cursor store says who holds a
 * position and the span store says who is writing; a cursor and a span that name the same agent
 * are the same presence and keep one row, with fact counts summed over every
 * span that identity opened. Nothing is dropped for being old — age decides
 * how a row is shown, never whether it exists.
 */
export function mergeAgents(cursors: JournalCursor[], spans: WorkSpan[], nowS: number): AgentRow[] {
  const rows = new Map<string, AgentRow>()
  const keys = new Map<string, string>()

  function resolve(agentId: string | undefined, cursorId: string | undefined): AgentRow {
    const names = [(agentId || '').trim(), cursorId ? `cursor:${cursorId.trim()}` : ''].filter(Boolean)
    const primary = identityKey(agentId, cursorId) || `cursor:${rows.size}`
    const found = [...new Set(names.map(name => keys.get(name)).filter(Boolean) as string[])]
    const known = found[0] || primary
    const row = rows.get(known) || blank(known)
    rows.set(known, row)
    // A record that names both an agent and a cursor bridges two names the
    // stores had shown apart. What each of those names accumulated belongs to
    // one writer, so the rows are folded together and every alias is
    // re-pointed at the survivor — a bridge closes a split, it never leaves
    // one writer holding two cards.
    for (const stray of found.slice(1)) {
      const held = rows.get(stray)
      if (held) {
        absorb(row, held)
        rows.delete(stray)
      }
      for (const [name, at] of keys) if (at === stray) keys.set(name, known)
    }
    for (const name of names) keys.set(name, known)
    row.agentId = row.agentId || (agentId || '').trim()
    row.cursorId = row.cursorId || (cursorId || '').trim()
    row.id = row.agentId || (row.cursorId ? `cursor:${row.cursorId}` : known)
    const identity = agentIdentity(row.agentId || row.cursorId)
    row.label = identity.label
    row.initials = identity.initials
    return row
  }

  for (const cursor of cursors) {
    const row = resolve(cursor.agent_id, cursor.cursor_id)
    row.origin = cursor.origin || row.origin
    row.lastActivityAt = Math.max(row.lastActivityAt, cursor.updated_at)
    row.lastSeenSeq = Math.max(row.lastSeenSeq, cursor.last_seen_seq || 0)
    row.purpose = cursor.purpose || cursor.checkpoint?.headline || row.purpose
    row.headline = cursor.last_touch?.title || row.headline
    if (cursor.last_touch && cursor.last_touch.seq > (row.lastTouch?.seq || 0)) row.lastTouch = cursor.last_touch
  }

  for (const span of [...spans].sort((a, b) => a.last_activity_at - b.last_activity_at)) {
    const row = resolve(span.agent_id, span.cursor_id)
    row.origin = span.origin || row.origin
    row.lastActivityAt = Math.max(row.lastActivityAt, span.last_activity_at, span.ended_at || 0)
    row.lastSeenSeq = Math.max(row.lastSeenSeq, span.last_seq || 0)
    row.factCount += span.fact_count || 0
    if (span.state === 'open') row.openSpans += 1
    row.purpose = span.working_on?.text || row.purpose
    row.headline = span.last_fact?.title || row.headline
    const taskId = span.working_on?.task_id || span.task_id || span.last_fact?.task_id
    if (taskId) row.spanTask = { id: taskId, at: span.last_activity_at }
  }

  const merged = [...rows.values()]
  for (const row of merged) {
    row.working = row.openSpans > 0
    row.liveness = livenessOf(row.lastActivityAt, nowS)
    row.purpose = row.purpose || row.headline || fallbackPurpose(row.origin)
  }
  return merged.sort((a, b) => b.lastActivityAt - a.lastActivityAt || a.label.localeCompare(b.label))
}

export interface LivenessGroups { now: AgentRow[]; today: AgentRow[]; older: AgentRow[] }

/** Grouping is a reading order, not a filter: every row lands in exactly one tier. */
export function groupByLiveness(rows: AgentRow[]): LivenessGroups {
  const groups: LivenessGroups = { now: [], today: [], older: [] }
  for (const row of rows) groups[row.liveness].push(row)
  return groups
}

/** The task the agent's span named, or the task on the fact its cursor reached. */
export function agentTaskId(row: AgentRow, factTasks: ReadonlyMap<string, string | undefined>): string {
  return row.spanTask?.id || factTasks.get(row.lastTouch?.event_id || '') || ''
}
