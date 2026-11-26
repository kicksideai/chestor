// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { changeCounts, changeSentence, factTitle, foldChanges, isMeaningful } from './facts'
import type { JournalEvent } from './types'

const titles: Record<string, string> = { cutover: 'Approve Harbor cutover', rollout: 'Publish rollout schedule' }
const taskTitle = (id?: string) => (id && titles[id]) || ''
const fact = (id: string, event_type: string, extra: Partial<JournalEvent> = {}): JournalEvent =>
  ({ id, seq: 1, event_type, ts: 100, ...extra })

it('reads a dependency change as a sentence about the tasks it joins', () => {
  const linked = fact('l', 'task.linked', { title: 'cutover blocks rollout', linked_task_ids: ['cutover', 'rollout'], metadata: { relation: 'blocks' } })
  const unlinked = fact('u', 'task.unlinked', { linked_task_ids: ['cutover', 'rollout'], metadata: { relation: 'relates_to' } })
  expect(changeSentence(linked, taskTitle)).toBe('Approve Harbor cutover now blocks Publish rollout schedule')
  expect(changeSentence(unlinked, taskTitle)).toBe('Approve Harbor cutover no longer relates to Publish rollout schedule')
})

it('never shows a stored identifier for a change whose tasks are unknown', () => {
  const linked = fact('l', 'task.linked', { title: 'cutover blocks rollout' })
  expect(factTitle(linked, () => '')).toBe('Two tasks were linked')
  expect(factTitle(fact('c', 'cursor.updated'), taskTitle)).toBe('Agent position moved')
})

it('keeps decisions, questions and progress notes as facts and folds bookkeeping', () => {
  expect(['decision', 'question', 'blocker', 'evidence', 'progress'].every(type => isMeaningful(fact(type, type, { title: 'Words' })))).toBe(true)
  expect(isMeaningful(fact('empty', 'note'))).toBe(false)
  expect(isMeaningful(fact('u', 'task.updated', { title: 'Approve Harbor cutover' }))).toBe(false)
})

it('names the shape of a run of changes', () => {
  expect(changeCounts([
    fact('1', 'task.updated'), fact('2', 'task.updated'), fact('3', 'task.updated'),
    fact('4', 'task.linked'), fact('5', 'task.unlinked'), fact('6', 'task.closed'),
  ])).toBe('3 updates, 2 links, closed')
})

it('places each task fold at its newest change and keeps facts in order', () => {
  const entries = foldChanges([
    { ...fact('u2', 'task.updated', { task_id: 'a', ts: 30 }), fresh: true },
    fact('d', 'decision', { title: 'Ship', ts: 20 }),
    fact('u1', 'task.updated', { task_id: 'a', ts: 10 }),
    fact('b', 'task.updated', { task_id: 'b', ts: 5 }),
  ], 'Today')
  expect(entries.map(entry => [entry.key, entry.fresh, entry.at])).toEqual([
    ['Today:a', true, 30], ['d', false, 20], ['Today:b', false, 5],
  ])
})
