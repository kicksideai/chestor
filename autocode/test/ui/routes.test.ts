// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, normal, render, respond, run, summary } from './fixtures.ts'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { reactive } from 'vue'
import Autocode from '../../ui/src/app/autocode.vue'
import Admin from '../../ui/src/app/admin.vue'
import Tasks from '../../ui/src/app/tasks.vue'
import TaskForm from '../../ui/src/app/task-form.vue'

const hostProps = reactive(mocks.props)
const button = (w: VueWrapper, label: string) => w.findAll('button').find(b => b.text().includes(label))!

describe('run deep links', () => {
  it('follows live output through the page scroll owner and respects scrolling away', async () => {
    normal()
    mocks.props.value.route = 'runs/r'
    const w = render(Autocode)
    await flushPromises()
    const page = w.get('.ac')
    const scroll = vi.fn()
    page.element.scrollTo = scroll
    Object.defineProperty(page.element, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(page.element, 'clientHeight', { value: 100, configurable: true })
    mocks.callbacks.get('chestor.autocode.run.r')?.()
    await flushPromises()
    expect(scroll).toHaveBeenCalledWith({ top: 1000 })
    scroll.mockClear()
    page.element.scrollTop = 100
    await page.trigger('scroll')
    mocks.callbacks.get('chestor.autocode.run.r')?.()
    await flushPromises()
    expect(scroll).not.toHaveBeenCalled()
  })
  it('loads a bookmarked run independently of the list and receives live log updates', async () => {
    normal()
    mocks.props.value.route = 'runs/bookmarked'
    let text = 'Initial log'
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.includes('/runs/bookmarked')
      ? { run: { ...run, id: 'bookmarked', status: 'running', prompt: 'Bookmarked prompt', result: 'Current result' }, events: [{ seq: text === 'Initial log' ? 1 : 2, kind: 'log', text, created_at: '' }], more: false, next_seq: text === 'Initial log' ? 1 : 2 }
      : path.endsWith('/runs') ? { runs: [] } : respond(path)) } }))
    const w = render(Autocode)
    await flushPromises()
    expect(w.text()).toContain('Bookmarked prompt')
    expect(w.text()).toContain('running')
    expect(w.text()).toContain('Current result')
    expect(w.text()).toContain('Initial log')
    expect(w.find('dialog').exists()).toBe(false)
    mocks.get.mockClear()
    text = 'Live log'
    mocks.callbacks.get('chestor.autocode.run.bookmarked')?.()
    await flushPromises()
    expect(w.text()).toContain('Live log')
    expect(mocks.get.mock.calls.map(([path]) => path)).toEqual([expect.stringContaining('/runs/bookmarked?')])
    expect(mocks.emit).not.toHaveBeenCalled()
  })

  it('emits relative navigation when opening and closing a task, and follows host back and forward', async () => {
    normal()
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/runs') ? { runs: [{ ...summary, workflow: true }] } : respond(path)) } }))
    const w = render(Autocode)
    await flushPromises()
    expect(w.text()).toContain('Workflow')
    await w.get('.ac-run-main').trigger('click')
    await flushPromises()
    expect(mocks.emit).toHaveBeenLastCalledWith('navigate', { path: 'runs/r' })
    expect(w.text()).toContain('Partial answer')
    hostProps.value.route = 'runs/r' // shell round trip
    await flushPromises()
    await button(w, 'Back to tasks').trigger('click')
    await flushPromises()
    expect(mocks.emit).toHaveBeenLastCalledWith('navigate', { path: '' })
    expect(w.find('.ac-run-list').exists()).toBe(true)
    hostProps.value.route = ''
    await flushPromises()
    mocks.emit.mockClear()
    hostProps.value.route = 'runs/r' // browser back
    await flushPromises()
    expect(w.text()).toContain('Partial answer')
    hostProps.value.route = '' // browser forward
    await flushPromises()
    expect(w.find('.ac-run-list').exists()).toBe(true)
    expect(mocks.emit).not.toHaveBeenCalled()
    expect(mocks.callbacks.has('chestor.autocode.run.r')).toBe(false)
  })

  it('navigates a newly submitted task while a list refresh is pending', async () => {
    normal()
    const w = render(Autocode)
    await flushPromises()
    w.findComponent(Tasks).vm.open()
    await flushPromises()
    mocks.get.mockImplementation(path => path.endsWith('/accounts') ? new Promise(() => {}) : Promise.resolve({ data: { success: true, ...respond(path) } }))
    mocks.callbacks.get('chestor.autocode.runs')?.()
    await flushPromises()
    w.findComponent(TaskForm).vm.$emit('started', 'new-run')
    await flushPromises()
    expect(mocks.emit).toHaveBeenLastCalledWith('navigate', { path: 'runs/new-run' })
  })

  it.each([
    { component: Autocode, tab: 'Tasks', count: '1 task' },
    { component: Admin, tab: 'Images', count: '1 image' },
  ])('keeps the count when selecting active $tab', async ({ component, tab, count }) => {
    normal()
    const get = mocks.get.getMockImplementation()!
    mocks.get.mockImplementation(path => path.endsWith('/catalog')
      ? Promise.resolve({ data: { success: true, ...respond(path), can_images: true } }) : get(path))
    const w = render(component)
    await flushPromises()
    expect(w.text()).toContain(count)
    await w.get('button.ac-tab[aria-pressed="true"]').trigger('click')
    await flushPromises()
    expect(w.get('button.ac-tab[aria-pressed="true"]').text()).toBe(tab)
    expect(w.text()).toContain(count)
  })

  it('shows a clear not-found state for a missing or unreadable run', async () => {
    normal()
    mocks.props.value.route = 'runs/unknown'
    mocks.get.mockImplementation(async path => {
      if (path.includes('/runs/unknown')) throw { response: { data: { success: false, error: 'run not found', kind: 'NOT_FOUND', details: { code: 'autocode.run_not_found' } } } }
      return { data: { success: true, ...respond(path) } }
    })
    const w = render(Autocode)
    await flushPromises()
    expect(w.get('[role="status"]').text()).toContain('Run not found')
    expect(w.text()).toContain('does not exist or you do not have access')
    expect(w.text()).not.toContain('Loading the task')
    await button(w, 'Back to tasks').trigger('click')
    await flushPromises()
    expect(mocks.emit).toHaveBeenLastCalledWith('navigate', { path: '' })
    expect(w.find('.ac-run-list').exists()).toBe(true)
  })

  it('removes loaded run content if a refresh reports it is no longer readable', async () => {
    normal()
    mocks.props.value.route = 'runs/r'
    const w = render(Autocode)
    await flushPromises()
    expect(w.text()).toContain('Partial answer')
    mocks.get.mockImplementation(async path => {
      if (path.includes('/runs/r')) throw { response: { data: { success: false, error: 'run not found', details: { code: 'autocode.run_not_found' } } } }
      return { data: { success: true, ...respond(path) } }
    })
    mocks.callbacks.get('chestor.autocode.run.r')?.()
    await flushPromises()
    expect(w.text()).toContain('Run not found')
    expect(w.text()).not.toContain('Partial answer')
    expect(w.text()).not.toContain('Copy link')
  })

  it('rejects malformed subroutes without opening an unrelated run', async () => {
    normal()
    mocks.props.value.route = 'runs/%invalid'
    const w = render(Autocode)
    await flushPromises()
    expect(w.text()).toContain('Run not found')
    expect(mocks.get.mock.calls.some(([path]) => path.includes('/runs/'))).toBe(false)
  })

  it('switches runs on host route changes and ignores a late response for the old run', async () => {
    normal()
    mocks.props.value.route = 'runs/old'
    let finish: (value: unknown) => void = () => {}
    mocks.get.mockImplementation(async path => {
      if (path.includes('/runs/old')) return new Promise(resolve => { finish = resolve })
      return { data: { success: true, ...respond(path) } }
    })
    const w = render(Autocode)
    await flushPromises()
    hostProps.value.route = 'runs/r'
    await flushPromises()
    expect(w.text()).toContain('Partial answer')
    finish({ data: { success: true, run: { ...run, prompt: 'Obsolete prompt' }, events: [], more: false, next_seq: 0 } })
    await flushPromises()
    expect(w.text()).not.toContain('Obsolete prompt')
    expect(mocks.callbacks.has('chestor.autocode.run.old')).toBe(false)
  })

  it('reports clipboard failure without claiming the link was copied', async () => {
    normal()
    mocks.props.value.route = 'runs/r'
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'))
    const w = render(Autocode)
    await flushPromises()
    await button(w, 'Copy link').trigger('click')
    await flushPromises()
    expect(w.get('[role="alert"]').text()).toContain('Could not copy the link')
    expect(w.text()).not.toContain('Link copied')
    expect(w.find('textarea[readonly]').exists()).toBe(false)
  })

  it('copies a canonical URL on the deployment origin', async () => {
    normal()
    mocks.props.value.route = 'runs/r'
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText)
    const w = render(Autocode)
    await flushPromises()
    await button(w, 'Copy link').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('https://kickside.example/autocode/runs/r')
    expect(w.text()).toContain('Link copied')
  })
})


it.each(['/system/autocode', '/custom/system/autocode'])('dispatches image settings navigation to the host-bound %s with a composed path payload', async path => {
  const { catalog } = await import('./fixtures.ts')
  const { ref } = await import('vue')
  const { mount } = await import('@vue/test-utils')
  const w = mount(TaskForm, { props: { accounts: [], images: [], workspaces: [] }, global: { provide: { catalog: ref({ ...catalog, can_images: true, settings_path: path }) } } })
  try {
    const navigate = vi.fn()
    w.element.addEventListener('navigate', navigate)
    await button(w, 'Manage images').trigger('click')
    const event = navigate.mock.calls[0]?.[0] as CustomEvent
    expect(event.detail).toEqual({ path })
    expect(event.bubbles).toBe(true)
    expect(event.composed).toBe(true)
  } finally { w.unmount() }
})

it.each([undefined, ''])('hides image settings navigation when settings_path is %s', async path => {
  normal()
  mocks.get.mockImplementation(async url => ({ data: { success: true, ...(url.endsWith('/catalog')
    ? { ...respond(url), can_images: true, settings_path: path }
    : url.endsWith('/images') ? { images: [] } : respond(url)) } }))
  const w = render(Autocode)
  await flushPromises()
  w.findComponent(Tasks).vm.open()
  await flushPromises()
  expect(w.text()).toContain('No image with')
  expect(w.findAll('button').some(b => b.text().includes('Manage images'))).toBe(false)
})
