// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, render, respond, normal, summary } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import Tasks from '../../ui/src/app/tasks.vue'

describe('tasks', () => {
  it('refreshes an open run list when submission announces a queued run without a worker transition', async () => {
    normal()
    let submitted = false
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.includes('/runs')
      ? { runs: submitted ? [{ ...summary, id: 'queued', status: 'queued', prompt_summary: 'Waiting for workers' }] : [] }
      : respond(path)) } }))
    const w = render(Tasks, { query: '' })
    await flushPromises()
    expect(w.text()).not.toContain('Waiting for workers')
    submitted = true
    expect(mocks.callbacks.has('chestor.autocode.runs')).toBe(true)
    mocks.callbacks.get('chestor.autocode.runs')?.()
    await flushPromises()
    expect(w.text()).toContain('Waiting for workers')
    expect(w.text()).toContain('queued')
  })
  it('keeps loaded pages and a consistent cursor when realtime adds a run', async () => {
    normal()
    let refreshed = false
    mocks.get.mockImplementation(async path => {
      if (path.includes('/runs')) return { data: { success: true, ...(path.includes('?cursor=')
        ? { runs: [{ ...summary, id: 'second', prompt_summary: 'Second task' }], next_cursor: 'next' }
        : { runs: refreshed ? [{ ...summary, id: 'new', prompt_summary: 'New task' }, summary] : [summary], next_cursor: 'page2' }) } }
      return { data: { success: true, ...respond(path) } }
    })
    const w = render(Tasks, { query: '' })
    await flushPromises()
    const more = w.find('[label="Load more"]')
    expect(more.exists()).toBe(true)
    await more?.trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Second task')
    refreshed = true
    mocks.callbacks.get('chestor.autocode.runs')?.()
    await flushPromises()
    expect(w.text()).toContain('New task')
    expect(w.text()).toContain('Second task')
  })
  it('queues realtime list refreshes behind an in-flight snapshot', async () => {
    normal()
    let complete: (data: unknown) => void = () => {}
    let runRequests = 0
    mocks.get.mockImplementation(path => {
      if (!path.endsWith('/runs')) return Promise.resolve({ data: { success: true, ...respond(path) } })
      runRequests++
      return runRequests === 1 ? new Promise(resolve => { complete = resolve })
        : Promise.resolve({ data: { success: true, runs: [{ ...summary, prompt_summary: 'Refreshed task' }] } })
    })
    const w = render(Tasks, { query: '' })
    await flushPromises()
    expect(mocks.callbacks.has('chestor.autocode.runs')).toBe(true)
    mocks.callbacks.get('chestor.autocode.runs')?.()
    expect(runRequests).toBe(1)
    complete({ data: { success: true, runs: [summary] } })
    await flushPromises()
    expect(runRequests).toBe(3)
    expect(w.text()).toContain('Refreshed task')
  })
  it('offers Retry and clears a failed refresh while retaining the loaded list', async () => {
    normal()
    const w = render(Tasks, { query: '' })
    await flushPromises()
    mocks.get.mockRejectedValueOnce(new Error('refresh offline'))
    mocks.callbacks.get('chestor.autocode.runs')?.()
    await flushPromises()
    expect(w.text()).toContain('refresh offline')
    const retry = w.findAll('button').find(button => button.text() === 'Retry')
    expect(retry).toBeDefined()
    await retry?.trigger('click')
    await flushPromises()
    expect(w.text()).not.toContain('refresh offline')
    expect(w.text()).toContain('Task')
  })
  it('loads successive cursors without replacing earlier pages', async () => {
    normal()
    mocks.get.mockImplementation(async (path: string) => {
      const page = path.endsWith('/runs') ? { runs: [{ ...summary, id: 'one', prompt_summary: 'Task one' }], next_cursor: 'two' }
        : path.endsWith('/runs?cursor=two') ? { runs: [{ ...summary, id: 'two', prompt_summary: 'Task two' }], next_cursor: 'three' }
        : path.endsWith('/runs?cursor=three') ? { runs: [{ ...summary, id: 'three', prompt_summary: 'Task three' }] }
        : respond(path)
      return { data: { success: true, ...page } }
    })
    const w = render(Tasks, { query: '' })
    await flushPromises()
    const more = () => w.findAll('button-stub').find(button => button.attributes('label') === 'Load more')
    expect(more()).toBeDefined()
    await more()!.trigger('click')
    await flushPromises()
    await more()!.trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Task one')
    expect(w.text()).toContain('Task two')
    expect(w.text()).toContain('Task three')
    expect(more()).toBeUndefined()
    expect(w.emitted('count')?.at(-1)).toEqual([3])
  })
})
