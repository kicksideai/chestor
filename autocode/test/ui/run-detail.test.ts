// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, render, respond, normal, run } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import RunDetail from '../../ui/src/app/run-detail.vue'

describe('run detail', () => {
  it('bounds a large run history, pages earlier explicitly and continues live by sequence', async () => {
    normal()
    let last = 10000
    const paths: string[] = []
    mocks.get.mockImplementation(async path => {
      if (!path.includes('/runs/r')) return { data: { success: true, ...respond(path) } }
      paths.push(path)
      const query = new URL(path, 'https://example.test').searchParams
      const before = query.get('before_seq')
      const after = Number(query.get('after_seq') ?? 0)
      const end = before === null ? Math.min(last, after + 500) : (Number(before) || last + 1) - 1
      const start = before === null ? after + 1 : Math.max(1, end - 499)
      const events = Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => ({ seq: start + i, kind: 'log', text: `event ${start + i}`, created_at: '' }))
      return { data: { success: true, run, events, more: before === null ? end < last : start > 1, next_seq: end } }
    })
    const w = render(RunDetail, { runId: 'r', accounts: [], images: [], workspaces: [] })
    await flushPromises()
    expect(paths).toHaveLength(1)
    expect(paths[0]).toContain('before_seq=0')
    expect(w.findAll('.ac-event')).toHaveLength(500)
    expect(w.findAll('.ac-event')[0].text()).toContain('event 9501')
    expect(w.text()).toContain('500 events')
    const earlier = () => w.findAll('button').find(b => b.text() === 'Load earlier')
    await earlier()?.trigger('click')
    await flushPromises()
    expect(paths).toHaveLength(2)
    expect(paths[1]).toContain('before_seq=9501')
    expect(w.findAll('.ac-event')).toHaveLength(500)
    expect(w.findAll('.ac-event')[0].text()).toContain('event 9001')
    last++
    mocks.callbacks.get('chestor.autocode.run.r')?.()
    await flushPromises()
    expect(paths[2]).toContain('after_seq=10000')
    expect(w.findAll('.ac-event').length).toBeLessThanOrEqual(500)
    expect(w.text()).toContain('event 10001')
    expect(w.text()).toContain('500 events')
    const continued = paths.length
    last++
    mocks.callbacks.get('chestor.autocode.run.r')?.()
    await flushPromises()
    expect(paths).toHaveLength(continued + 1)
    expect(paths[continued]).toContain('after_seq=10001')
    expect(w.findAll('.ac-event')).toHaveLength(500)
    expect(w.findAll('.ac-event')[0].text()).toContain('event 9503')
    expect(w.findAll('.ac-event').at(-1)?.text()).toContain('event 10002')
    expect(w.text()).toContain('500 events')
    // A burst skips to its latest window without draining every intermediate page.
    const calls = paths.length
    last += 2000
    mocks.callbacks.get('chestor.autocode.run.r')?.()
    await flushPromises()
    expect(paths.length - calls).toBeLessThanOrEqual(2)
    expect(paths[calls]).toContain('after_seq=10002')
    expect(w.findAll('.ac-event')).toHaveLength(500)
    expect(w.findAll('.ac-event').at(-1)?.text()).toContain('event 12002')
    expect(w.text()).toContain('500 events')
  })
  it('returns a completed run from earlier history to its latest bounded window', async () => {
    normal()
    const paths: string[] = []
    mocks.get.mockImplementation(async path => {
      paths.push(path)
      const before = Number(new URL(path, 'https://example.test').searchParams.get('before_seq'))
      const end = before ? before - 1 : 1500
      const start = Math.max(1, end - 499)
      const events = Array.from({ length: end - start + 1 }, (_, i) => ({ seq: start + i, kind: 'log', text: `event ${start + i}`, created_at: '' }))
      return { data: { success: true, run: { ...run, status: 'succeeded' }, events, more: start > 1, next_seq: end } }
    })
    const w = render(RunDetail, { runId: 'r', accounts: [], images: [], workspaces: [] })
    await flushPromises()
    await w.findAll('button').find(b => b.text() === 'Load earlier')!.trigger('click')
    await flushPromises()
    expect(w.findAll('.ac-event')[0].text()).toContain('event 501')
    const latest = w.findAll('button').find(b => b.text() === 'Latest')
    expect(latest).toBeDefined()
    await latest!.trigger('click')
    await flushPromises()
    expect(paths).toHaveLength(3)
    expect(paths[2]).toContain('before_seq=0')
    expect(w.findAll('.ac-event')).toHaveLength(500)
    expect(w.findAll('.ac-event')[0].text()).toContain('event 1001')
    expect(w.findAll('.ac-event').at(-1)?.text()).toContain('event 1500')
    expect(w.findAll('button').some(b => b.text() === 'Latest')).toBe(false)
  })
  it('shows actual token usage and partial results for a failed task', async () => {
    normal()
    const w = render(RunDetail, { runId: 'r', accounts: [], images: [], workspaces: [] })
    await flushPromises()
    expect(w.text()).toContain('12 input')
    expect(w.text()).toContain('3 output')
    expect(w.text()).toContain('0 cached')
    expect(w.text()).toContain('Partial answer')
  })
})
