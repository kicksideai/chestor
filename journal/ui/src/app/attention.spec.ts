// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import { changeDays, freshCount, inProgress, matchTasks, needsYou } from './attention'
import type { JournalEvent, JournalTask, WorkControlState } from './types'

const now = 2_000_000
const task = (id: string, status: string, extra: Partial<JournalTask> = {}): JournalTask =>
  ({ id, title: `Task ${id}`, status, revision: 1, created_at: now - 900_000, updated_at: now - 100, ...extra })
const fact = (id: string, seq: number, event_type: string, extra: Partial<JournalEvent> = {}): JournalEvent =>
  ({ id, seq, event_type, title: `Fact ${id}`, ts: now - 1000 + seq, ...extra })
const control = (extra: Partial<WorkControlState> = {}): WorkControlState => ({
  now, leases: [], resumable: [], counts: { active: 0, write: 0, planning: 0, resumable: 0 }, limit: 100, has_more: false, ...extra,
})

describe('needsYou', () => {
  it('lists blocked work, standing blockers and questions, and work that stopped', () => {
    const tasks = [task('a', 'blocked', { parent_task_id: 'root' }), task('root', 'open'), task('b', 'in_progress', { updated_at: now - 7200 })]
    const events = [fact('q', 2, 'question', { task_id: 'b' }), fact('x', 3, 'blocker')]
    const items = needsYou(tasks, events, control({ resumable: [{ task_id: 'b', task_status: 'in_progress', task_updated_at: now - 7200 }] }), now)
    expect(items.map(item => [item.reason, item.ref.id])).toEqual([
      ['blocked', 'a'], ['blocker', 'x'], ['question', 'q'], ['stalled', 'b'],
    ])
    expect(items[0].detail).toBe('Task root')
  })

  it('leaves out questions that were answered, replaced or retired', () => {
    const tasks = [task('done', 'done')]
    const events = [
      fact('on-ended', 1, 'question', { task_id: 'done' }),
      fact('old', 2, 'question'),
      fact('new', 3, 'decision', { supersedes_event_id: 'old' }),
      fact('resolved', 4, 'question', { lifecycle: 'resolved' }),
      fact('flagged', 5, 'question', { superseded_by_event_id: 'later' }),
    ]
    expect(needsYou(tasks, events, control(), now)).toEqual([])
  })

  it('lists a task once and treats work stopped within the hour as still in hand', () => {
    const tasks = [task('a', 'blocked'), task('b', 'in_progress')]
    const resumable = [
      { task_id: 'a', task_status: 'blocked', task_updated_at: now - 7200 },
      { task_id: 'b', task_status: 'in_progress', task_updated_at: now - 60 },
    ]
    expect(needsYou(tasks, [], control({ resumable }), now).map(item => item.ref.id)).toEqual(['a'])
  })
})

it('lists live editing sessions with who holds them, except tasks already needing a person', () => {
  const leases = [
    { lease_id: 'l1', agent_id: 'writer', task_id: 'a', task_title: 'Draft', capability: 'WRITE' as const, issued_at: now, expires_at: now + 60, remaining_s: 60 },
    { lease_id: 'l2', agent_id: 'planner', task_id: 'b', task_title: 'Plan', capability: 'PLANNING' as const, issued_at: now, expires_at: now + 60, remaining_s: 60 },
  ]
  const needs = needsYou([task('b', 'blocked')], [], control(), now)
  expect(inProgress(control({ leases }), needs)).toEqual([
    { ref: { kind: 'task', id: 'a' }, title: 'Draft', detail: 'Writer · editing', at: now },
  ])
})

describe('changes since the last visit', () => {
  const events = [fact('a', 10, 'note'), fact('b', 12, 'decision'), fact('c', 11, 'note')]

  it('marks nothing on a first visit', () => {
    expect(freshCount(events, null)).toBe(0)
    expect(changeDays(events, null, now).flatMap(day => day.events).some(event => event.fresh)).toBe(false)
  })

  it('marks facts past the visit and lists newest first', () => {
    expect(freshCount(events, 10)).toBe(2)
    const listed = changeDays(events, 10, now).flatMap(day => day.events)
    expect(listed.map(event => [event.id, event.fresh])).toEqual([['b', true], ['c', true], ['a', false]])
  })
})

it('finds tasks holding every word, open work first', () => {
  const tasks = [
    task('1', 'done', { title: 'Ship the release notes' }),
    task('2', 'open', { title: 'Release', description: 'write the notes' }),
    task('3', 'open', { title: 'Unrelated' }),
  ]
  expect(matchTasks(tasks, 'release NOTES').map(item => item.id)).toEqual(['2', '1'])
  expect(matchTasks(tasks, '  ')).toEqual([])
})
