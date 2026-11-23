// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { onMounted, ref } from 'vue'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import JournalApp from './JournalApp.vue'

const props = ref<{ entryId: string; mode: string }>({ entryId: 'j1', mode: 'full' })
const get = vi.fn()
const post = vi.fn()

vi.mock('@iconify/vue', () => ({ Icon: { template: '<span aria-hidden="true" />' } }))
vi.mock('@wippy-fe/proxy', () => ({ api: { get: (url: string) => get(url), post: (url: string, body: unknown) => post(url, body) }, on: () => () => {} }))
vi.mock('@wippy-fe/webcomponent-vue', () => ({
  useProps: () => props,
  useHostVisibilityRefresh: (task: () => void) => onMounted(task),
}))

const now = Math.floor(Date.now() / 1000)
const tasks = [
  { id: 'root', title: 'Launch', status: 'open', revision: 1, created_at: now - 9000, updated_at: now - 60 },
  { id: 'gate', title: 'Legal review', status: 'blocked', parent_task_id: 'root', revision: 1, created_at: now - 9000, updated_at: now - 600 },
]
const events = [
  { id: 'e2', seq: 12, event_type: 'question', title: 'Which region ships first?', ts: now - 120, actor_id: 'planner', task_id: 'root' },
  { id: 'e1', seq: 10, event_type: 'decision', title: 'Ship in two waves', ts: now - 3600, actor_id: 'planner', task_id: 'root' },
]

function respond(lastSeq: number, recentEvents = events) {
  get.mockImplementation(async (url: string) => {
    if (url.includes('/tree')) return { data: { success: true, tree: { children: [{ ...tasks[0], children: [tasks[1]] }] } } }
    if (url.includes('/health')) return { data: { success: true, health: { status: 'ok' } } }
    if (url.includes('/branch')) {
      return { data: { success: true, branch: {
        task: tasks[1], ancestors: [tasks[0]], children: [],
        facts: [{ id: 'e3', seq: 9, event_type: 'blocker', title: 'Waiting on counsel', ts: now - 900, actor_id: 'reviewer' }],
        deps: { incoming: [{ from_task_id: 'root', to_task_id: 'gate', kind: 'blocks' }], outgoing: [] },
      } } }
    }
    return { data: { success: true, journal: {
      journal_id: 'j1', stats: { last_seq: lastSeq }, events: recentEvents, event_page: { has_more: false },
      cursors: { items: [] }, spans: { items: [] },
      work_control: { now, leases: [], resumable: [], counts: { active: 0, write: 0, planning: 0, resumable: 0 }, limit: 100, has_more: false },
    } } }
  })
}

async function open() {
  const wrapper = mount(JournalApp, { global: { plugins: [PrimeVuePlugin] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => { localStorage.clear(); get.mockReset(); post.mockReset(); props.value = { entryId: 'j1', mode: 'full' } })
afterEach(() => { vi.useRealTimers() })

it('opens on what needs a person and what changed', async () => {
  respond(12)
  const wrapper = await open()
  const rail = wrapper.get('.kx-rail')
  expect(rail.text()).toContain('Needs you')
  expect(rail.findAll('.jr-row').map(row => row.find('.jr-row-title').text())).toEqual(['Legal review', 'Which region ships first?'])
  expect(wrapper.get('.kx-main').text()).toContain('What changed')
  expect(wrapper.get('.kx-main').text()).toContain('Ship in two waves')
  expect(wrapper.find('.jr-row.fresh').exists()).toBe(false)
  wrapper.unmount()
})

it('marks the facts recorded since the last visit', async () => {
  localStorage.setItem('chestor.journal.seen:j1', '10')
  respond(12)
  const wrapper = await open()
  expect(wrapper.get('.kx-main').text()).toContain('1 new since your last visit.')
  expect(wrapper.findAll('.kx-main .jr-row.fresh').map(row => row.find('.jr-row-title').text())).toEqual(['Which region ships first?'])
  expect(localStorage.getItem('chestor.journal.seen:j1')).toBe('12')
  wrapper.unmount()
})

it('shows a newly recorded backdated fact beyond the first page and still offers older facts', async () => {
  localStorage.setItem('chestor.journal.seen:j1', '41')
  const recent = Array.from({ length: 41 }, (_, index) => ({
    ...events[0], id: `f${index}`, seq: index + 1, title: `Fact ${index}`, ts: now - index,
  }))
  const backdated = { ...events[0], id: 'backdated', seq: 42, title: 'Backdated update', ts: now - 86400 }
  respond(42, [...recent, backdated])
  const wrapper = await open()
  expect(wrapper.get('.kx-main .jr-row.fresh').text()).toContain('Backdated update')
  expect(wrapper.get('.kx-main').text()).not.toContain('Fact 40')
  await wrapper.get('.jr-more').trigger('click')
  expect(wrapper.get('.kx-main').text()).toContain('Fact 40')
  wrapper.unmount()
})

it('opens an item with its place, what it waits on and its history, and follows links back', async () => {
  respond(12)
  const wrapper = await open()
  await wrapper.get('.kx-rail .jr-row').trigger('click')
  await flushPromises()
  const main = wrapper.get('.kx-main')
  expect(get).toHaveBeenCalledWith('/api/v1/workspace/journals/j1/branch?task_id=gate&fact_limit=100')
  expect(main.get('h1').text()).toBe('Legal review')
  expect(main.get('.jr-path').text()).toBe('Launch')
  expect(main.text()).toContain('Waiting on')
  expect(main.text()).toContain('Waiting on counsel')

  await main.findAll('.jr-block .jr-row').find(row => row.text().includes('Waiting on counsel'))!.trigger('click')
  await flushPromises()
  expect(wrapper.get('.kx-main h1').text()).toBe('Waiting on counsel')
  await wrapper.get('[aria-label="Back"]').trigger('click')
  await flushPromises()
  expect(wrapper.get('.kx-main h1').text()).toBe('Legal review')
  await wrapper.get('[aria-label="Close"]').trigger('click')
  expect(wrapper.get('.kx-main').text()).toContain('What changed')
  wrapper.unmount()
})

it('finds tasks and facts from one field', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  respond(12)
  post.mockResolvedValue({ data: { success: true, events: [{ id: 'e9', seq: 9, event_type: 'evidence', title: 'Counsel letter', ts: now - 50 }] } })
  const wrapper = await open()
  await wrapper.get('.kx-rail input').setValue('legal')
  await vi.advanceTimersByTimeAsync(400)
  await flushPromises()
  expect(post).toHaveBeenCalledWith('/api/v1/workspace/journals/j1/search', { query: 'legal', limit: 30 })
  const titles = wrapper.get('.kx-rail').findAll('.jr-row-title').map(row => row.text())
  expect(titles).toEqual(['Legal review', 'Counsel letter'])
  wrapper.unmount()
})

it('stacks the list above the changes in a side-panel preview', async () => {
  props.value = { entryId: 'j1', mode: 'preview' }
  respond(12)
  const wrapper = await open()
  expect(wrapper.find('.kx-rail').exists()).toBe(false)
  const main = wrapper.get('.kx-main').text()
  expect(main.indexOf('Needs you')).toBeLessThan(main.indexOf('What changed'))
  wrapper.unmount()
})

it('states a missing journal id without reading', async () => {
  props.value = { entryId: '', mode: 'full' }
  const wrapper = await open()
  expect(wrapper.text()).toContain('Journal entry id is required.')
  expect(get).not.toHaveBeenCalled()
  wrapper.unmount()
})
