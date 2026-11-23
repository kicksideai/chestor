// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { agentIdentity, agentTaskId, mergeAgents } from './agents'
import type { WorkSpan } from './types'

const span = (span_id: string, agent_id: string, last_activity_at: number, extra: Partial<WorkSpan> = {}): WorkSpan =>
  ({ span_id, agent_id, state: 'open', started_at: last_activity_at - 60, last_activity_at, ...extra })

it('opens the task an agent most recently worked', () => {
  const spans = [
    span('s1', 'writer', 100, { task_id: 'older' }),
    span('s2', 'writer', 300, { working_on: { kind: 'task', text: 'newer' } }),
    span('s3', 'writer', 400),
    span('s4', 'other', 500, { task_id: 'theirs' }),
  ]
  const [row] = mergeAgents([], spans.filter(item => item.agent_id === 'writer'), 500)
  expect(agentTaskId(row, spans)).toBe('newer')
})

it('names an agent from its id', () => {
  expect(agentIdentity('release-writer')).toEqual({ label: 'Release writer', initials: 'RW' })
  expect(agentIdentity('8f14e45f-ceea-4b6e-9a3c-1f2d3e4c5b6a').label).toMatch(/^Agent [0-9A-F]{6}$/)
})
