// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, reactive } from 'vue'
import Ajv from 'ajv'
import type { AgentInfo } from '../../ui/src/app/api.ts'

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), confirm: vi.fn(), callbacks: new Map<string, () => void>(), props: { value: { route: '', config: {} as Record<string, unknown> } }, emit: vi.fn() }))
vi.mock('@iconify/vue', () => ({ Icon: { name: 'Icon', template: '<i />' } }))
vi.mock('@wippy-fe/proxy', () => ({ api: Object.fromEntries((['get', 'post', 'put', 'delete'] as const).map(method => [method, (path: string, body?: unknown) => {
  contractErrors.push(...requestContractErrors(method, path, body))
  return method === 'get' || method === 'delete' ? mocks[method](path) : mocks[method](path, body)
}])), config: { env: { APP_API_URL: 'https://kickside.example/api' } }, on: (topic: string, cb: () => void) => { mocks.callbacks.set(topic, cb); return () => mocks.callbacks.delete(topic) }, host: { confirm: mocks.confirm }, loadByTagName: () => Promise.resolve() }))
vi.mock('@wippy-fe/webcomponent-vue', () => ({ useHostVisibilityRefresh: (cb: () => void) => { void cb() }, useProps: () => reactive(mocks.props), useEvents: () => mocks.emit }))

const ajv = new Ajv({ strict: false, allErrors: true })
const schemas = import.meta.glob('../../src/contracts/*.input.schema.json', { eager: true, import: 'default' })
const validators = Object.fromEntries(Object.entries(schemas).map(([path, schema]) => [path.split('/').at(-1)!.replace('.input.schema.json', ''), ajv.compile(schema as object)]))
const contractErrors: string[] = []

// Match the HTTP adapters' path, query and body translation before validation.
export function requestContractErrors(method: string, path: string, body?: unknown): string[] {
  const url = new URL(path, 'https://kickside.example')
  const route = url.pathname.replace(/^\/api\/v1\/autocode/, '')
  let contract: string | undefined
  let input: Record<string, unknown> = {}
  const account = route.match(/^\/accounts\/([^/]+)$/)
  const run = route.match(/^\/runs\/([^/]+)(\/cancel)?$/)
  if (route === '/accounts') {
    if (method === 'get') { contract = 'list_accounts'; input = { include_unavailable: true } }
    if (method === 'post') { contract = 'add_account'; input = body as Record<string, unknown> }
  } else if (account) {
    if (method === 'put') { contract = 'update_account'; input = { ...(body as object), id: decodeURIComponent(account[1]!) } }
    if (method === 'delete') { contract = 'remove_account'; input = { id: decodeURIComponent(account[1]!) } }
  } else if (route === '/images' && method === 'get') {
    contract = 'list_images'; input = { ready_only: false }
  } else if (route === '/workspaces' && method === 'get') {
    contract = 'list_workspaces'
  } else if (route === '/runs') {
    if (method === 'post') { contract = 'submit_task'; input = body as Record<string, unknown> }
    if (method === 'get') {
      contract = 'list_runs'
      for (const key of ['cursor', 'limit']) if (url.searchParams.has(key)) input[key] = key === 'limit' ? Number(url.searchParams.get(key)) : url.searchParams.get(key)
    }
  } else if (run) {
    input = { run_id: decodeURIComponent(run[1]!) }
    if (run[2] && method === 'post') contract = 'cancel_run'
    if (!run[2] && method === 'get') {
      contract = 'get_run'
      for (const key of ['after_seq', 'before_seq', 'limit']) if (url.searchParams.has(key)) input[key] = Number(url.searchParams.get(key))
    }
  }
  if (!contract) return []
  const validate = validators[contract]
  if (!validate) return [`Missing input schema for ${contract}`]
  // HTTP serialization omits undefined object properties.
  const label = `${method.toUpperCase()} ${path} (${contract})`
  let serialized: unknown
  try { serialized = JSON.parse(JSON.stringify(input) ?? 'null') }
  catch { return [`${label}: request is not JSON serializable`] }
  return validate(serialized) ? [] : [`${label}: ${ajv.errorsText(validate.errors, { separator: '; ' })}`]
}

export const driver = { id: 'agent', title: 'Agent', icon: 'tabler:robot', credentials: [{ id: 'key', label: 'Key', hint: '', subscription: false }, { id: 'login', label: 'Login', hint: '', file: 'login.json', subscription: true }], endpoints: ['openai'], capabilities: [], options: [] }
export const claudeLike: AgentInfo = { ...driver, id: 'claude-like', title: 'Claude-like', unattended: { permission_mode: 'bypassPermissions' }, options: [
  { name: 'permission_mode', label: 'Permission mode', description: '', section: '', group: '', order: 1, type: 'string', values: ['manual', 'bypassPermissions'], default: 'manual', profiles: ['batch'] },
  { name: 'model', label: 'Model', description: '', section: '', group: '', order: 2, type: 'string', default: 'sonnet' },
] }
export const settings = { memory: '8g', cpus: '3', pids_limit: 512, gpus: '', network: 'none', extra_args: [], allows: [] }
export const catalog = { agents: [driver], default_image: { ref: 'agent:latest', label: 'Agent', home: '/opt/agent', dockerfile: '', settings }, can_images: false, can_workspaces: false, can_prune: false, build_cache_retention: '48h' }
export const account = { id: 'a', agent: 'removed', label: 'Orphan', credential_kind: 'key', subscription: false, enabled: true, owner: 'u', mine: true, usable: false, unavailable_reason: 'driver_inactive', writable: true, deletable: false, last_used_at: '', cooldown_until: '', last_error: '', runs_day: 1, failures_day: 0 }
export const image = { id: 'i', ref: 'agent:latest', label: 'Image', home: '/opt/agent', status: 'ready', usable: true, agents: ['agent'], last_error: '', owner: 'u', writable: true, deletable: false, shareable: false }
export const run = { id: 'r', agent: 'agent', account_id: 'a', image_id: 'i', options: {}, unattended: false, repo_url: '', prompt: 'Task', status: 'failed', result: 'Partial answer', error: '', usage: { input_tokens: 12, output_tokens: 3, cached_tokens: 0 }, cancel_requested: false, timeout_ms: 1000, workflow: false, created_at: '', started_at: '', finished_at: '' }
export const summary = { ...run, prompt_summary: run.prompt }
export const option = { name: 'config', label: 'Configuration', description: '', section: '', group: '', order: 1, type: 'json', schema: { type: 'object' } }
const wrappers: { unmount: () => void }[] = []
export function render<T extends Parameters<typeof mount>[0]>(component: T, props?: NonNullable<Parameters<typeof mount<T>>[1]>['props'], agents?: AgentInfo[]) {
  const wrapper = mount(component, { props, global: { provide: { catalog: ref({ ...catalog, agents: agents ?? catalog.agents }) }, stubs: { Icon: true, Button: true, AppDialog: { name: 'AppDialog', template: '<div><slot /></div>' } } } })
  wrappers.push(wrapper)
  return wrapper
}
export function respond(path: string) {
  if (path.endsWith('/catalog')) return catalog
  if (path.endsWith('/accounts')) return { accounts: [] }
  if (path.endsWith('/images')) return { images: [image] }
  if (path.endsWith('/workspaces')) return { workspaces: [], roots: [] }
  if (path.includes('/runs/r')) return { run, events: [], more: false, next_seq: 0 }
  if (path.endsWith('/runs')) return { runs: [summary] }
  if (path.includes('/principals/')) return { principals: [] }
  throw new Error(path)
}
export function normal() { mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path) } })); mocks.post.mockResolvedValue({ data: { success: true, principals: [] } }) }
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); mocks.callbacks.clear(); mocks.props.value.route = ''; vi.restoreAllMocks(); expect(contractErrors.splice(0), 'UI requests satisfy their service input contracts').toEqual([]) })


export { mocks }
