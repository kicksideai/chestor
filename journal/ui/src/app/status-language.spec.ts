// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NowLens from './NowLens.vue'
import StaleReview from './StaleReview.vue'
import type { WorkControlState } from './types'

vi.mock('@iconify/vue', () => ({ Icon: { template: '<span aria-hidden="true" />' } }))

const now = 2000000
const taskBound = { loaded: 100, total: 250, hasMore: true }
const workControl: WorkControlState = {
  now, limit: 100, has_more: true,
  counts: { active: 1, write: 1, planning: 0, resumable: 1 },
  leases: [{ lease_id: 'session-1', agent_id: 'writer', task_id: 'task-1', task_title: 'Draft the plan',
    capability: 'WRITE', issued_at: now, expires_at: now + 300, remaining_s: 300 }],
  resumable: [{ task_id: 'task-2', task_title: 'Review the plan', task_status: 'in_progress' }],
}

it('names editing sessions plainly and keeps each task reachable', async () => {
  const wrapper = mount(NowLens, { props: { now, taskBound, workControl, tasks: [], events: [], spans: [],
    spanCounts: { open: 0, sealed: 0, total: 0 } } })
  expect(wrapper.find('section[aria-label="Who can edit"]').exists()).toBe(true)
  expect(wrapper.text()).toContain('100 of 250 tasks')
  expect(wrapper.text()).toContain('active editing session')
  expect(wrapper.text()).not.toMatch(/lease|authority|mutation|bounded|one page/i)
  expect(wrapper.find('[title*="one page"]').exists()).toBe(false)
  const sessions = wrapper.findAll('.jr-authority-row')
  await sessions[0].trigger('click')
  await sessions[1].trigger('click')
  expect(wrapper.emitted('task')).toEqual([['task-1'], ['task-2']])
  wrapper.unmount()
})

it('explains the empty editing state without protocol terminology', () => {
  const wrapper = mount(NowLens, { props: { now, taskBound: { loaded: 0, total: 0, hasMore: false },
    workControl: { ...workControl, leases: [], resumable: [], has_more: false },
    tasks: [], events: [], spans: [], spanCounts: { open: 0, sealed: 0, total: 0 } } })
  expect(wrapper.text()).toContain('No active editing session')
  expect(wrapper.find('.jr-lens-bound').exists()).toBe(false)
  wrapper.unmount()
})

it('shows review coverage as a task count and keeps review navigation', async () => {
  const wrapper = mount(StaleReview, { props: { now, taskBound,
    tasks: [{ id: 'task-1', title: 'Review the plan', status: 'open', revision: 1, updated_at: 1, created_at: 1 }] } })
  expect(wrapper.text()).toContain('100 of 250 tasks')
  expect(wrapper.text()).not.toMatch(/lease|authority|mutation|bounded|one page|protocol/i)
  expect(wrapper.find('[title*="one page"]').exists()).toBe(false)
  await wrapper.get('.jr-stale-title').trigger('click')
  expect(wrapper.emitted('task')).toEqual([['task-1']])
  await wrapper.get('.jr-lens-advice').trigger('click')
  expect(wrapper.emitted('close')).toHaveLength(1)
  wrapper.unmount()
})
