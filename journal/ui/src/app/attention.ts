// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

import { agentIdentity } from './agents'
import { dayLabel } from './format'
import { ageOf, isEnded } from './staleness'
import type { JournalEvent, JournalTask, WorkControlState } from './types'

/** What a row opens: a task with its history, or one fact. */
export type ItemRef = { kind: 'task'; id: string } | { kind: 'fact'; id: string }

export type NeedReason = 'blocked' | 'blocker' | 'question' | 'stalled'

export interface NeedItem {
  ref: ItemRef
  reason: NeedReason
  title: string
  detail: string
  at: number
}

export interface WorkItem {
  ref: ItemRef
  title: string
  detail: string
  at: number
}

const ASKS: Record<string, NeedReason> = { blocker: 'blocker', question: 'question' }
const ORDER: Record<NeedReason, number> = { blocked: 0, blocker: 1, question: 2, stalled: 3 }

function factKind(event: JournalEvent): string { return event.event_type.replace(/^.*:/, '').toLowerCase() }

/** A fact still stands while it is active and no later fact replaced it. */
function standing(event: JournalEvent, replaced: Set<string>): boolean {
  const state = String(event.effective_state || event.lifecycle || 'active').toLowerCase()
  return state === 'active' && !event.superseded_by_event_id && !replaced.has(event.id)
}

/**
 * What a person has to act on: blocked work, blockers and questions an agent
 * raised that still stand, and started work that stopped without anyone
 * holding it. A question or blocker on a task that has since ended was
 * answered by the ending. Each task appears once, under its most urgent reason.
 */
export function needsYou(tasks: JournalTask[], events: JournalEvent[], control: WorkControlState, nowS: number): NeedItem[] {
  const byId = new Map(tasks.map(task => [task.id, task]))
  const replaced = new Set(events.map(event => event.supersedes_event_id || '').filter(Boolean))
  const out: NeedItem[] = []
  const seenTasks = new Set<string>()
  const pathOf = (task?: JournalTask) => {
    const parent = task?.parent_task_id ? byId.get(task.parent_task_id) : undefined
    return parent ? parent.title : ''
  }

  for (const task of tasks) {
    if (task.status !== 'blocked') continue
    seenTasks.add(task.id)
    out.push({ ref: { kind: 'task', id: task.id }, reason: 'blocked', title: task.title, detail: pathOf(task), at: task.updated_at })
  }

  for (const event of events) {
    const reason = ASKS[factKind(event)]
    if (!reason || !standing(event, replaced)) continue
    const task = event.task_id ? byId.get(event.task_id) : undefined
    if (task && isEnded(task.status)) continue
    out.push({
      ref: { kind: 'fact', id: event.id },
      reason,
      title: event.title || event.body || 'Untitled',
      detail: task?.title || agentIdentity(event.actor_id || '').label,
      at: event.ts,
    })
  }

  for (const work of control.resumable) {
    if (seenTasks.has(work.task_id)) continue
    const at = work.task_updated_at || byId.get(work.task_id)?.updated_at || 0
    if (ageOf(at, nowS).tier === 'live') continue
    seenTasks.add(work.task_id)
    out.push({ ref: { kind: 'task', id: work.task_id }, reason: 'stalled', title: work.task_title || byId.get(work.task_id)?.title || 'Untitled task', detail: pathOf(byId.get(work.task_id)), at })
  }

  return out.sort((a, b) => ORDER[a.reason] - ORDER[b.reason] || b.at - a.at)
}

/** Tasks with a live editing session, each named with who holds it. */
export function inProgress(control: WorkControlState, needs: NeedItem[]): WorkItem[] {
  const listed = new Set(needs.filter(item => item.ref.kind === 'task').map(item => item.ref.id))
  const out = new Map<string, WorkItem>()
  for (const lease of control.leases) {
    if (listed.has(lease.task_id) || out.has(lease.task_id)) continue
    out.set(lease.task_id, {
      ref: { kind: 'task', id: lease.task_id },
      title: lease.task_title || 'Untitled task',
      detail: `${agentIdentity(lease.agent_id).label} · ${lease.capability === 'WRITE' ? 'editing' : 'planning'}`,
      at: lease.issued_at,
    })
  }
  return [...out.values()].sort((a, b) => b.at - a.at)
}

export interface ChangeDay { day: string; events: Array<JournalEvent & { fresh: boolean }> }

/**
 * Recorded facts, newest first, grouped by day. A fact past the reader's last
 * visit is fresh; with no visit on record nothing is, so a first look is not a
 * wall of highlights.
 */
export function changeDays(events: JournalEvent[], seenSeq: number | null, nowS: number): ChangeDay[] {
  const days: ChangeDay[] = []
  for (const event of [...events].sort((a, b) => b.seq - a.seq)) {
    const day = dayLabel(event.ts, nowS)
    let group = days[days.length - 1]
    if (!group || group.day !== day) { group = { day, events: [] }; days.push(group) }
    group.events.push({ ...event, fresh: seenSeq !== null && event.seq > seenSeq })
  }
  return days
}

export function freshCount(events: JournalEvent[], seenSeq: number | null): number {
  return seenSeq === null ? 0 : events.filter(event => event.seq > seenSeq).length
}

/** Tasks whose title or description holds every word of the query. */
export function matchTasks(tasks: JournalTask[], query: string, limit = 20): JournalTask[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return tasks
    .filter(task => {
      const text = `${task.title} ${task.description || ''}`.toLowerCase()
      return terms.every(term => text.includes(term))
    })
    .sort((a, b) => Number(isEnded(a.status)) - Number(isEnded(b.status)) || b.updated_at - a.updated_at)
    .slice(0, limit)
}
