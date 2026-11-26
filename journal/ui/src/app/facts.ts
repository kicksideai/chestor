// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0

import { agentIdentity } from './agents'
import { kindLabel } from './format'
import type { JournalEvent } from './types'

/**
 * Bookkeeping the journal records as it works: task edits, links, focus,
 * checkpoints, receipts and its own positions. A person reads these as a count
 * per task, not as one row each.
 */
const MECHANICAL: Record<string, string> = {
  'task.updated': 'Updated',
  'task.closed': 'Closed',
  'task.focused': 'Made the current focus',
  'task.transitioned': 'Status changed',
  'verification.requested': 'Verification requested',
  'verification.receipt': 'Verification recorded',
  'digest.updated': 'Summary refreshed',
  'checkpoint': 'Checkpoint saved',
  'audit.coverage': 'Audit coverage recorded',
  'integration': 'Integration recorded',
  'artifact': 'File attached',
  'cursor.updated': 'Agent position moved',
  'graph.operations.requested': 'Map updated',
  'graph.configuration.requested': 'Map settings changed',
  'health': 'Processing fell behind',
}

type TitleOf = (id?: string) => string

export function factType(event: JournalEvent): string {
  return event.event_type.replace(/^.*:/, '').toLowerCase()
}

function isLink(type: string): boolean { return type === 'task.linked' || type === 'task.unlinked' }

/** A fact a person reads on its own: anything recorded in words that is not bookkeeping. */
export function isMeaningful(event: JournalEvent): boolean {
  const type = factType(event)
  return !(type in MECHANICAL) && !isLink(type) && Boolean((event.title || event.body || '').trim())
}

/** The task a change belongs to: the task it names, or the task a link starts from. */
export function changeTaskId(event: JournalEvent): string {
  return event.task_id || (isLink(factType(event)) ? event.linked_task_ids?.[0] || '' : '')
}

function relationWords(relation: string): string {
  return relation.replace(/[._-]+/g, ' ').trim().toLowerCase() || 'relates to'
}

/** One plain sentence for a change, naming tasks by their titles. */
export function changeSentence(event: JournalEvent, taskTitle: TitleOf): string {
  const type = factType(event)
  if (isLink(type)) {
    const [from, to] = event.linked_task_ids || []
    const relation = relationWords(String(event.metadata?.relation || ''))
    const fromTitle = taskTitle(from)
    const toTitle = taskTitle(to)
    if (!fromTitle || !toTitle) return type === 'task.linked' ? 'Two tasks were linked' : 'Two tasks were unlinked'
    return type === 'task.linked' ? `${fromTitle} now ${relation} ${toTitle}` : `${fromTitle} no longer ${relation} ${toTitle}`
  }
  return MECHANICAL[type] || kindLabel(event.event_type)
}

/** What a fact is called wherever it is listed: its own words, else what happened. */
export function factTitle(event: JournalEvent, taskTitle: TitleOf): string {
  if (isMeaningful(event)) {
    const text = (event.title || event.body || '').trim()
    return text.split('\n')[0]
  }
  return changeSentence(event, taskTitle)
}

/** "3 updates, 2 links, closed": the shape of a run of changes on one task. */
export function changeCounts(events: JournalEvent[]): string {
  const counts = new Map<string, number>()
  let closed = false
  for (const event of events) {
    const type = factType(event)
    if (type === 'task.closed') { closed = true; continue }
    const bucket = isLink(type) ? 'link' : type === 'task.updated' || type === 'task.transitioned' ? 'update' : 'other change'
    counts.set(bucket, (counts.get(bucket) || 0) + 1)
  }
  const parts = ['update', 'link', 'other change']
    .filter(bucket => counts.get(bucket))
    .map(bucket => `${counts.get(bucket)} ${bucket}${counts.get(bucket) === 1 ? '' : 's'}`)
  if (closed) parts.push('closed')
  return parts.join(', ')
}

export function authorOf(event: JournalEvent): string {
  return event.actor_id ? agentIdentity(event.actor_id).label : ''
}

/** A fact row, or the changes one task went through, folded into one line. */
export type FeedEntry =
  | { kind: 'fact'; key: string; event: JournalEvent; fresh: boolean; at: number }
  | { kind: 'changes'; key: string; taskId: string; events: JournalEvent[]; fresh: boolean; at: number }

/**
 * Meaningful facts stay rows; bookkeeping is folded into one entry per task,
 * placed at that task's newest change. Input order is kept for facts.
 */
export function foldChanges(events: Array<JournalEvent & { fresh?: boolean }>, scope: string): FeedEntry[] {
  const entries: FeedEntry[] = []
  const folds = new Map<string, Extract<FeedEntry, { kind: 'changes' }>>()
  for (const event of events) {
    const fresh = event.fresh === true
    if (isMeaningful(event)) {
      entries.push({ kind: 'fact', key: event.id, event, fresh, at: event.ts })
      continue
    }
    const taskId = changeTaskId(event)
    const held = folds.get(taskId)
    if (held) {
      held.events.push(event)
      held.fresh = held.fresh || fresh
      held.at = Math.max(held.at, event.ts)
      continue
    }
    const fold: Extract<FeedEntry, { kind: 'changes' }> = { kind: 'changes', key: `${scope}:${taskId}`, taskId, events: [event], fresh, at: event.ts }
    folds.set(taskId, fold)
    entries.push(fold)
  }
  return entries
}
