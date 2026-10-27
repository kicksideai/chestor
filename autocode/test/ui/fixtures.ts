// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, reactive } from 'vue'

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), callbacks: new Map<string, () => void>(), props: { value: { config: {} as Record<string, unknown> } }, emit: vi.fn() }))
vi.mock('@iconify/vue', () => ({ Icon: { name: 'Icon', template: '<i />' } }))
vi.mock('@wippy-fe/proxy', () => ({ api: mocks, on: (topic: string, cb: () => void) => { mocks.callbacks.set(topic, cb); return () => mocks.callbacks.delete(topic) }, host: { confirm: vi.fn() }, loadByTagName: () => Promise.resolve() }))
vi.mock('@wippy-fe/webcomponent-vue', () => ({ useHostVisibilityRefresh: (cb: () => void) => { void cb() }, useProps: () => reactive(mocks.props), useEvents: () => mocks.emit }))

export const driver = { id: 'agent', title: 'Agent', icon: 'tabler:robot', credentials: [{ id: 'key', label: 'Key', hint: '', subscription: false }, { id: 'login', label: 'Login', hint: '', file: 'login.json', subscription: true }], endpoints: ['openai'], capabilities: [], options: [] }
export const settings = { memory: '8g', cpus: '3', pids_limit: 512, gpus: '', network: 'none', extra_args: [], allows: [] }
export const catalog = { agents: [driver], default_image: { ref: 'agent:latest', label: 'Agent', home: '/opt/agent', dockerfile: '', settings }, can_images: false, can_workspaces: false, can_prune: false }
export const account = { id: 'a', agent: 'removed', label: 'Orphan', credential_kind: 'key', subscription: false, enabled: true, owner: 'u', mine: true, usable: false, unavailable_reason: 'driver_inactive', writable: true, deletable: false, last_used_at: '', cooldown_until: '', last_error: '', runs_day: 1, failures_day: 0 }
export const image = { id: 'i', ref: 'agent:latest', label: 'Image', home: '/opt/agent', status: 'ready', agents: ['agent'], last_error: '', owner: 'u', writable: true, deletable: false }
export const run = { id: 'r', agent: 'agent', account_id: 'a', image_id: 'i', options: {}, unattended: false, repo_url: '', prompt: 'Task', status: 'failed', result: 'Partial answer', error: '', usage: { input_tokens: 12, output_tokens: 3, cached_tokens: 0 }, cancel_requested: false, timeout_ms: 1000, workflow: false, created_at: '', started_at: '', finished_at: '' }
export const summary = { ...run, prompt_summary: run.prompt }
export const option = { name: 'config', label: 'Configuration', description: '', section: '', group: '', order: 1, type: 'json', schema: { type: 'object' } }
const wrappers: { unmount: () => void }[] = []
export function render<T extends Parameters<typeof mount>[0]>(component: T, props?: NonNullable<Parameters<typeof mount<T>>[1]>['props']) {
  const wrapper = mount(component, { props, global: { provide: { catalog: ref(catalog) }, stubs: { Icon: true, Button: true, AppDialog: { name: 'AppDialog', template: '<div><slot /></div>' } } } })
  wrappers.push(wrapper)
  return wrapper
}
export function respond(path: string) {
  if (path.endsWith('/catalog')) return catalog
  if (path.endsWith('/accounts')) return { accounts: [] }
  if (path.endsWith('/drivers')) return { drivers: [driver] }
  if (path.endsWith('/images')) return { images: [image] }
  if (path.endsWith('/workspaces')) return { workspaces: [], roots: [] }
  if (path.includes('/runs/r')) return { run, events: [], more: false, next_seq: 0 }
  if (path.endsWith('/runs')) return { runs: [summary] }
  if (path.includes('/principals/')) return { principals: [] }
  throw new Error(path)
}
export function normal() { mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path) } })); mocks.post.mockResolvedValue({ data: { success: true, principals: [] } }) }
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); mocks.callbacks.clear(); vi.restoreAllMocks() })


export { mocks }
