// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { DORMANT_AFTER_S, dormantPrograms, isEnded } from './staleness'

const now = 10_000_000
const old = now - DORMANT_AFTER_S - 3600

it('groups quiet open work under its program and skips programs with nothing left open', () => {
  const tasks = [
    { id: 'p', title: 'Program', status: 'open', updated_at: now - 60 },
    { id: 'a', title: 'Quiet part', status: 'open', parent_task_id: 'p', updated_at: old },
    { id: 'a1', title: 'Quiet leaf', status: 'blocked', parent_task_id: 'a', updated_at: old },
    { id: 'live', title: 'Live part', status: 'open', parent_task_id: 'p', updated_at: now - 60 },
    { id: 'done', title: 'Finished program', status: 'done', updated_at: old },
  ]
  expect(dormantPrograms(tasks, now)).toEqual([
    { root: tasks[0], tasks: 2, open: 2, lastActivityAt: old },
  ])
})

it('reads cancelled and folded work as ended', () => {
  expect(['done', 'cancelled', 'canceled', 'folded'].every(isEnded)).toBe(true)
  expect(['open', 'blocked', 'in_progress'].some(isEnded)).toBe(false)
})
