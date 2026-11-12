// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { api, on } from '@wippy-fe/proxy'
import Workspace from './Workspace.vue'

const { emitNavigation } = vi.hoisted(() => ({ emitNavigation: vi.fn() }))
vi.mock('@wippy-fe/proxy', () => ({ api: { get: vi.fn(), delete: vi.fn() }, on: vi.fn() }))
vi.mock('@wippy-fe/webcomponent-vue', () => ({
  useProps: () => ({ value: { route: '' } }),
  useEvents: () => emitNavigation,
}))
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span aria-hidden="true" />' } }))

const ENTRIES = '/api/v1/workspace/entries'
const TYPES = [{ value: 'note', label: 'Note', icon: 'tabler:note', color: '', creatable: false }]

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.resetAllMocks()
})

function receiveMessages(): Array<(message: unknown) => void> {
  const receivers: Array<(message: unknown) => void> = []
  vi.mocked(on).mockImplementation((_topic, callback) => {
    receivers.push(callback as (message: unknown) => void)
    return vi.fn()
  })
  return receivers
}

function serve(listings: () => unknown[]) {
  vi.mocked(api.get).mockImplementation(async (url: string) => {
    if (url === `${ENTRIES}/types`) return { data: { success: true, types: TYPES } } as never
    if (url === ENTRIES) return { data: { success: true, entries: listings() } } as never
    return { data: { success: false } } as never
  })
}

function rows(w: VueWrapper) {
  return w.findAll('.ws-row')
}

it('removes a deleted row when component.deleted arrives', async () => {
  const receivers = receiveMessages()
  const note = { id: 'note-1', type: 'note', name: 'Large thread', status: 'active' }
  let listed: unknown[] = [note]
  serve(() => listed)
  vi.mocked(api.delete).mockResolvedValue({ data: { success: true, in_progress: true, job_id: 'job-1' } } as never)

  wrapper = mount(Workspace, { global: { plugins: [PrimeVuePlugin] } })
  await flushPromises()
  expect(rows(wrapper)).toHaveLength(1)

  listed = [{ ...note, deleting_at: 'marked', deletion_job_id: 'job-1', deletion_job: { status: 'running', attempts: 1 } }]
  await rows(wrapper)[0].trigger('keydown', { key: 'Delete' })
  await flushPromises()
  const confirm = wrapper.findAll('.ws-dialog-foot button').find(button => button.text() === 'Delete')
  expect(confirm).toBeDefined()
  await confirm!.trigger('click')
  await flushPromises()

  expect(api.delete).toHaveBeenCalledWith(`${ENTRIES}/note-1`)
  expect(rows(wrapper)).toHaveLength(1)
  expect(rows(wrapper)[0].get('[role="status"]').text()).toContain('Deleting')

  listed = []
  for (const receive of receivers) receive({ event: 'component.deleted', component_id: 'note-1' })
  await flushPromises()

  expect(rows(wrapper)).toHaveLength(0)
  expect(wrapper.text()).not.toContain('Large thread')
})

it('shows the deletion progress of a row listed while it is deleting', async () => {
  receiveMessages()
  const deleting = { id: 'note-1', type: 'note', name: 'Large thread', status: 'active', deleting_at: 'marked', deletion_job_id: 'job-1', deletion_job: { status: 'running', attempts: 1 } }
  serve(() => [deleting])

  wrapper = mount(Workspace, { global: { plugins: [PrimeVuePlugin] } })
  await flushPromises()

  expect(rows(wrapper)).toHaveLength(1)
  const status = rows(wrapper)[0].get('[role="status"]')
  expect(status.text()).toContain('Deleting')
  expect(status.find('[aria-label="Deletion in progress"]').exists()).toBe(true)
  expect(api.get).not.toHaveBeenCalledWith('/api/v1/components/note-1')
})

it('uses Open for preview and menu actions and omits Copy ID', async () => {
  receiveMessages()
  serve(() => [{ id: 'note-1', type: 'note', name: 'Planning notes', status: 'active' }])
  wrapper = mount(Workspace, { global: { plugins: [PrimeVuePlugin] } })
  await flushPromises()
  await rows(wrapper)[0].trigger('click')
  const open = wrapper.find('.ws-preview-head button[aria-label="Open"]')
  expect(open.exists()).toBe(true)
  await open.trigger('click')
  expect(emitNavigation).toHaveBeenLastCalledWith('navigate', 'note-1')
  await rows(wrapper)[0].trigger('contextmenu', { clientX: 20, clientY: 20 })
  const actions = wrapper.findAll('.ws-menu-item')
  expect(actions.map(action => action.text())).not.toContain('Copy ID')
  const menuOpen = actions.find(action => action.text() === 'Open')
  expect(menuOpen).toBeDefined()
  await menuOpen!.trigger('click')
  expect(emitNavigation).toHaveBeenLastCalledWith('navigate', 'note-1')
})
