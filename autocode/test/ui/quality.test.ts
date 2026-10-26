// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, ref, reactive } from 'vue'

const mocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), callbacks: new Map<string, () => void>(), props: { value: { config: {} as Record<string, unknown> } }, emit: vi.fn() }))
vi.mock('@iconify/vue', () => ({ Icon: { name: 'Icon', template: '<i />' } }))
vi.mock('@wippy-fe/proxy', () => ({ api: mocks, on: (topic: string, cb: () => void) => { mocks.callbacks.set(topic, cb); return () => mocks.callbacks.delete(topic) }, host: { confirm: vi.fn() }, loadByTagName: () => Promise.resolve() }))
vi.mock('@wippy-fe/webcomponent-vue', () => ({ useHostVisibilityRefresh: (cb: () => void) => { void cb() }, useProps: () => reactive(mocks.props), useEvents: () => mocks.emit }))
import { driverDefaults } from '../../ui/src/app/defaults.ts'
import { autocode } from '../../ui/src/app/api.ts'
import DriverOptions from '../../ui/src/app/driver-options.vue'
import TaskConfig from '../../ui/src/app/task-config.vue'
import DriverAccount from '../../ui/src/app/driver-account.vue'
import Accounts from '../../ui/src/app/accounts.vue'
import ImageForm from '../../ui/src/app/image-form.vue'
import AccountRow from '../../ui/src/app/account-row.vue'
import Images from '../../ui/src/app/images.vue'
import Tasks from '../../ui/src/app/tasks.vue'
import Workspaces from '../../ui/src/app/workspaces.vue'
import RunDetail from '../../ui/src/app/run-detail.vue'

const driver = { id: 'agent', title: 'Agent', icon: 'tabler:robot', credentials: [{ id: 'key', label: 'Key', hint: '', subscription: false }, { id: 'login', label: 'Login', hint: '', file: 'login.json', subscription: true }], endpoints: ['openai'], capabilities: [], options: [] }
const settings = { memory: '8g', cpus: '3', pids_limit: 512, gpus: '', network: 'none', extra_args: [], allows: [] }
const catalog = { agents: [driver], default_image: { ref: 'agent:latest', label: 'Agent', home: '/opt/agent', dockerfile: '', settings }, can_images: false, can_workspaces: false, can_prune: false }
const account = { id: 'a', agent: 'removed', label: 'Orphan', credential_kind: 'key', subscription: false, enabled: true, owner: 'u', mine: true, usable: false, unavailable_reason: 'driver_inactive', writable: true, deletable: false, last_used_at: '', cooldown_until: '', last_error: '', runs_day: 1, failures_day: 0 }
const image = { id: 'i', ref: 'agent:latest', label: 'Image', home: '/opt/agent', status: 'ready', agents: ['agent'], last_error: '', owner: 'u', writable: true, deletable: false }
const run = { id: 'r', agent: 'agent', account_id: 'a', image_id: 'i', options: {}, unattended: false, repo_url: '', prompt: 'Task', status: 'failed', result: 'Partial answer', error: '', usage: { input_tokens: 12, output_tokens: 3, cached_tokens: 0 }, cancel_requested: false, timeout_ms: 1000, workflow: false, created_at: '', started_at: '', finished_at: '' }
const summary = { ...run, prompt_summary: run.prompt }
const option = { name: 'config', label: 'Configuration', description: '', section: '', group: '', order: 1, type: 'json', schema: { type: 'object' } }
const wrappers: { unmount: () => void }[] = []
function render<T extends Parameters<typeof mount>[0]>(component: T, props?: NonNullable<Parameters<typeof mount<T>>[1]>['props']) {
  const wrapper = mount(component, { props, global: { provide: { catalog: ref(catalog) }, stubs: { Icon: true, Button: true, AppDialog: { name: 'AppDialog', template: '<div><slot /></div>' } } } })
  wrappers.push(wrapper)
  return wrapper
}
function respond(path: string) {
  if (path.endsWith('/catalog')) return catalog
  if (path.endsWith('/accounts')) return { accounts: [] }
  if (path.endsWith('/drivers')) return { drivers: [driver] }
  if (path.endsWith('/images')) return { images: [image] }
  if (path.endsWith('/workspaces')) return { workspaces: [], roots: [] }
  if (path.includes('/runs/r')) return { run, events: [], more: false }
  if (path.endsWith('/runs')) return { runs: [summary] }
  if (path.includes('/principals/')) return { principals: [] }
  throw new Error(path)
}
function normal() { mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path) } })); mocks.post.mockResolvedValue({ data: { success: true, principals: [] } }) }
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); mocks.callbacks.clear(); vi.restoreAllMocks() })

describe('API boundary', () => {
  it('rejects malformed endpoint DTOs before a consumer receives them', async () => {
    mocks.get.mockResolvedValue({ data: { success: true, accounts: [{ id: 'bad' }] } })
    await expect(autocode.accounts()).rejects.toThrow(/account|response/i)
  })
  it('retains structured HTTP error metadata', async () => {
    mocks.get.mockRejectedValue({ response: { data: { success: false, error: 'Busy', kind: 'UNAVAILABLE', code: 'BUSY', retryable: true, details: { code: 'BUSY' } } } })
    await expect(autocode.accounts()).rejects.toMatchObject({ message: 'Busy', kind: 'UNAVAILABLE', code: 'BUSY', retryable: true, details: { code: 'BUSY' } })
  })
  it('accepts omitted optional run and driver fields', async () => {
    normal()
    expect(await autocode.run('r', 0)).toMatchObject({ run: { id: 'r' } })
    expect(await autocode.drivers()).toHaveLength(1)
  })
})
describe('option drafts', () => {
  it('keeps the valid value when a draft is invalid', async () => {
    const w = render(DriverOptions, { options: [option], modelValue: { config: { keep: true } } })
    await w.get('textarea').setValue('{broken')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('invalid')?.at(-1)).toEqual([1])
  })
  it('reconciles drafts after an authoritative value change', async () => {
    const w = render(DriverOptions, { options: [option], modelValue: { config: {} } })
    await w.get('textarea').setValue('{broken')
    await w.setProps({ modelValue: { config: { replacement: true } } })
    expect(w.get('textarea').element.value).toContain('replacement')
    expect(w.emitted('invalid')?.at(-1)).toEqual([0])
  })
  it('rejects valid JSON that fails the supplied option schema', async () => {
    const w = render(DriverOptions, { options: [option], modelValue: {} })
    await w.get('textarea').setValue('[]')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('invalid')?.at(-1)).toEqual([1])
  })
  it('filters batch profiles and labels controls', () => {
    const w = render(DriverOptions, { options: [option, { ...option, name: 'interactive', profiles: ['interactive'] }], modelValue: {} })
    expect(w.findAll('textarea')).toHaveLength(1)
    expect(w.get('textarea').attributes('aria-label')).toBeTruthy()
    expect(w.get('input').attributes('aria-label')).toBeTruthy()
  })
})
describe('resource views', () => {
  it('shows account loading until the initial list resolves', () => {
    mocks.get.mockReturnValue(new Promise(() => {}))
    const w = render(Accounts, { query: '', selectedAgent: '' })
    expect(w.text()).toContain('Loading')
    expect(w.text()).not.toContain('yet')
  })
  it('shows image loading until the initial list resolves', () => {
    mocks.get.mockReturnValue(new Promise(() => {}))
    const w = render(Images, { query: '' })
    expect(w.text()).toContain('Loading')
    expect(w.text()).not.toContain('yet')
  })
  it('shows workspace loading until the initial list resolves', () => {
    mocks.get.mockReturnValue(new Promise(() => {}))
    const w = render(Workspaces, { query: '' })
    expect(w.text()).toContain('Loading')
    expect(w.text()).not.toContain('yet')
  })
  it('retains deactivated-driver accounts and gates delete independently of write', async () => {
    normal()
    mocks.get.mockResolvedValue({ data: { success: true, accounts: [account] } })
    const w = render(Accounts, { query: '', selectedAgent: '' })
    await flushPromises()
    expect(w.text()).toContain('Orphan')
    expect(w.find('[aria-label="Delete account"]').exists()).toBe(false)
  })
  it('clears an old list error after a successful retry', async () => {
    normal()
    mocks.get.mockRejectedValueOnce(new Error('offline'))
    const w = render(Workspaces, { query: '' })
    await flushPromises()
    const retry = w.findAll('button').find(b => b.text() === 'Retry')
    expect(retry).toBeDefined()
    await retry?.trigger('click')
    await flushPromises()
    expect(w.text()).not.toContain('offline')
    expect(w.text()).toContain('No workspaces yet')
  })
  it('does not reopen a closed build log after a delayed read', async () => {
    normal()
    let complete: (data: unknown) => void = () => {}
    const w = render(Images, { query: '' })
    await flushPromises()
    mocks.get.mockImplementation(path => path.endsWith('/images/i') ? new Promise(resolve => { complete = resolve }) : Promise.resolve({ data: { success: true, ...respond(path) } }))
    await w.get('[aria-label="Build log"]').trigger('click')
    await nextTick()
    // Close the active dialog while its detail is loading.
    const dialog = w.findComponent({ name: 'AppDialog' })
    expect(dialog.exists()).toBe(true)
    dialog.vm.$emit('close')
    complete({ data: { success: true, image, build_log: 'Late log' } })
    await flushPromises()
    expect(w.text()).not.toContain('Late log')
  })
  it('queues realtime list refreshes behind an in-flight snapshot', async () => {
    normal()
    let complete: (data: unknown) => void = () => {}
    mocks.get.mockImplementation(path => path.endsWith('/runs') ? new Promise(resolve => { complete = resolve }) : Promise.resolve({ data: { success: true, ...respond(path) } }))
    render(Tasks, { query: '' })
    await flushPromises()
    mocks.callbacks.get('chestor.autocode.runs')?.()
    expect(mocks.get.mock.calls.filter(([path]) => path.endsWith('/runs'))).toHaveLength(1)
    normal()
    complete({ data: { success: true, runs: [summary] } })
    await flushPromises()
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

describe('credential selection', () => {
  function card() {
    mocks.props.value.config = { driver, busy: false }
    return render(DriverAccount)
  }
  it('clears secrets and endpoints on a credential-kind change', async () => {
    const w = card()
    await w.get('textarea').setValue('old secret')
    await w.get('select').setValue('login')
    expect(w.get('textarea').element.value).toBe('')
  })
  it('ignores a late file read after the kind changes', async () => {
    const w = card()
    let complete: (value: string) => void = () => {}
    await w.get('.da-drop').trigger('drop', { dataTransfer: { files: [{ name: 'key.txt', size: 5, text: () => new Promise<string>(resolve => { complete = resolve }) }] } })
    await w.get('select').setValue('login')
    complete('late secret')
    await flushPromises()
    expect(w.get('textarea').element.value).toBe('')
    expect(w.text()).not.toContain('key.txt loaded')
  })
  it('catches file read errors and clears them on a successful drop', async () => {
    const w = card()
    await w.get('.da-drop').trigger('drop', { dataTransfer: { files: [{ name: 'bad.txt', size: 5, text: () => Promise.reject(new Error('read failed')) }] } })
    await flushPromises()
    expect(w.text()).toContain('Could not read')
    await w.get('.da-drop').trigger('drop', { dataTransfer: { files: [{ name: 'key.txt', size: 5, text: () => Promise.resolve('valid') }] } })
    await flushPromises()
    expect(w.text()).not.toContain('Could not read')
  })
  it('freezes the credential fields while saving', async () => {
    const w = card()
    reactive(mocks.props).value.config.busy = true
    await nextTick()
    expect(w.get('select').element.disabled).toBe(true)
    expect(w.get('textarea').element.disabled).toBe(true)
  })
})

describe('workflow option validity', () => {
  it('does not publish another configuration while an option draft is invalid', async () => {
    normal()
    mocks.props.value.config = { agent: 'agent', image_id: 'i', prompt: 'Task', options: { config: {} } }
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path), ...(path.endsWith('/drivers') ? { drivers: [{ ...driver, options: [option] }] } : {}) } }))
    const w = render(TaskConfig)
    await flushPromises()
    mocks.emit.mockClear()
    await w.get('textarea[rows="2"]').setValue('{broken')
    await w.get('textarea[rows="4"]').setValue('Changed task')
    expect(mocks.emit.mock.calls.filter(([name]) => name === 'config-changed')).toHaveLength(0)
    expect(w.text()).toContain('invalid')
    await w.get('textarea[rows="2"]').setValue('{"fixed":true}')
    const changes = mocks.emit.mock.calls.filter(([name]) => name === 'config-changed')
    expect(changes).toHaveLength(1)
    expect(changes[0]?.[1]).toMatchObject({ prompt: 'Changed task', options: { config: { fixed: true } } })
  })
})

describe('catalog defaults and independent access', () => {
  it('uses the image settings provided by the catalog', () => {
    const w = render(ImageForm, { edit: null, capabilities: ['new-capability'] })
    const inputs = w.findAll('input')
    expect(inputs.some(i => i.element.value === '8g')).toBe(true)
    expect(inputs.some(i => i.element.value === '3')).toBe(true)
    expect(inputs.some(i => i.element.value === '512')).toBe(true)
    expect(inputs.some(i => i.element.value === 'none')).toBe(true)
  })
  it('shows delete for a DELETE-only account and hides WRITE actions', () => {
    const w = render(AccountRow, { account: { ...account, writable: false, deletable: true }, kindLabel: 'Key', ownerLabel: '' })
    expect(w.find('[aria-label="Delete account"]').exists()).toBe(true)
    expect(w.find('[aria-label="Rename account"]').exists()).toBe(false)
  })
  it('hides image delete for a WRITE-only grant', async () => {
    normal()
    const w = render(Images, { query: '' })
    await flushPromises()
    expect(w.find('[aria-label="Delete image"]').exists()).toBe(false)
    expect(w.find('[aria-label="Edit settings"]').exists()).toBe(true)
  })
  it('shows image delete for a DELETE-only grant', async () => {
    normal()
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path), ...(path.endsWith('/images') ? { images: [{ ...image, writable: false, deletable: true }] } : {}) } }))
    const w = render(Images, { query: '' })
    await flushPromises()
    expect(w.find('[aria-label="Delete image"]').exists()).toBe(true)
    expect(w.find('[aria-label="Edit settings"]').exists()).toBe(false)
  })
  it('uses DELETE rather than WRITE for workspace removal', async () => {
    normal()
    mocks.get.mockResolvedValue({ data: { success: true, roots: [], workspaces: [{ id: 'w', name: 'Read and delete', writable: false, deletable: true }] } })
    const w = render(Workspaces, { query: '' })
    await flushPromises()
    expect(w.find('[aria-label="Delete workspace"]').exists()).toBe(true)
  })
})

describe('credential metadata validation', () => {
  it('validates the declared credential format before submission', async () => {
    mocks.props.value.config = { driver: { ...driver, credentials: [{ ...driver.credentials[0], format: 'single_line' }] }, limits: { label_bytes: 10, secret_bytes: 20, endpoint_url_bytes: 50, endpoint_model_bytes: 10 } }
    const w = render(DriverAccount)
    await w.get('textarea').setValue('line one\nline two')
    expect(w.text()).toContain('single line')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(true)
  })
  it('rejects arrays for a credential declared as a JSON object', async () => {
    mocks.props.value.config = { driver: { ...driver, credentials: [{ ...driver.credentials[1], format: 'json_object' }] } }
    const w = render(DriverAccount)
    await w.get('textarea').setValue('[]')
    expect(w.text()).toContain('JSON object')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(true)
  })
})

describe('web component props', () => {
  it('reports malformed credential-card configuration before rendering fields', () => {
    mocks.props.value.config = { driver: { ...driver, credentials: 4 } }
    const w = render(DriverAccount)
    expect(w.text()).toContain('configuration is invalid')
    expect(w.find('textarea').exists()).toBe(false)
  })
  it('reports malformed workflow configuration instead of normalizing it', async () => {
    normal()
    mocks.props.value.config = { agent: 'agent', options: [] }
    const w = render(TaskConfig)
    await flushPromises()
    expect(w.text()).toContain('configuration is invalid')
    expect(w.find('textarea').exists()).toBe(false)
  })
})

describe('image settings completeness', () => {
  it('does not replace missing editable-image settings with catalog defaults', () => {
    const w = render(ImageForm, { edit: { image, build_log: '' }, capabilities: [] })
    expect(w.find('input').exists()).toBe(false)
    expect(w.text()).toContain('settings are unavailable')
  })
})

describe('batch defaults', () => {
  it('does not seed task options from an interactive-only default', () => {
    const defaults = driverDefaults({ ...driver, options: [{ ...option, name: 'batch', profiles: ['batch'], default: {} }, { ...option, name: 'interactive', profiles: ['interactive'], default: {} }] })
    expect(defaults).toEqual({ batch: {} })
  })
})

describe('loaded task refresh errors', () => {
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
})

describe('image admission', () => {
  it('reports an already-created image whose build admission fails', async () => {
    normal()
    mocks.post.mockResolvedValue({ data: { success: true, id: 'created', build_error: { message: 'Build queue unavailable', kind: 'Unavailable', retryable: true, details: { code: 'queue_unavailable' } } } })
    const w = render(ImageForm, { edit: null, capabilities: [] })
    const reference = w.findAll('input').find(input => input.attributes('placeholder')?.includes('name:tag'))
    expect(reference).toBeDefined()
    await reference!.setValue('agent:test')
    const save = w.findAll('button').find(button => button.text().includes('Add image'))
    await save!.trigger('click')
    await flushPromises()
    expect(w.emitted('saved')?.[0]?.[0]).toContain('Build queue unavailable')
  })
})

describe('task pagination', () => {
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
    const more = () => w.findAll('button-stub').find(button => button.attributes('label') === 'Load more tasks')
    expect(more()).toBeDefined()
    await more()!.trigger('click')
    await flushPromises()
    await more()!.trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Task one')
    expect(w.text()).toContain('Task two')
    expect(w.text()).toContain('Task three')
    expect(more()).toBeUndefined()
  })
})
