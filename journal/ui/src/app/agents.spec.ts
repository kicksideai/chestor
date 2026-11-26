// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { agentIdentity, agentTaskId, mergeAgents } from './agents'
import type { WorkSpan } from './types'

const span = (span_id: string, agent_id: string, last_activity_at: number, extra: Partial<WorkSpan> = {}): WorkSpan =>
  ({ span_id, agent_id, state: 'open', started_at: last_activity_at - 60, last_activity_at, ...extra })

it('opens the task an agent most recently worked', () => {
  const spans = [
    span('s1', 'writer', 100, { task_id: 'older' }),
    span('s2', 'writer', 300, { working_on: { kind: 'task', text: 'Readable task title', task_id: 'newer' } }),
    span('s3', 'writer', 400),
    span('s4', 'other', 500, { task_id: 'theirs' }),
  ]
  const [row] = mergeAgents([], spans.filter(item => item.agent_id === 'writer'), 500)
  expect(agentTaskId(row, new Map())).toBe('newer')
})

it('uses the task of the latest fact when a span has no task purpose', () => {
  const spans = [span('s1', 'writer', 100, { last_fact: { seq: 2, event_id: 'f1', task_id: 'ticket' } })]
  const [row] = mergeAgents([], spans, 500)
  expect(agentTaskId(row, new Map())).toBe('ticket')
})

it('uses the cursor’s last fact when there is no task-bearing span', () => {
  const [row] = mergeAgents([{
    cursor_id: 'c1', agent_id: 'writer', origin: 'auto', state: 'active',
    last_seen_seq: 2, created_at: 99, updated_at: 100,
    last_touch: { seq: 2, event_id: 'f1' },
  }], [span('s1', 'writer', 100)], 500)
  expect(agentTaskId(row, new Map([['f1', 'ticket']]))).toBe('ticket')
  expect(agentTaskId(row, new Map())).toBe('')
})

it('names an agent from its id', () => {
  expect(agentIdentity('release-writer')).toEqual({ label: 'Release writer', initials: 'RW' })
  expect(agentIdentity('8f14e45f-ceea-4b6e-9a3c-1f2d3e4c5b6a').label).toMatch(/^Agent [0-9A-F]{6}$/)
})
