// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, account, image, summary, render, respond, normal } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import Accounts from '../../ui/src/app/accounts.vue'
import ImageForm from '../../ui/src/app/image-form.vue'
import AccountRow from '../../ui/src/app/account-row.vue'
import Images from '../../ui/src/app/images.vue'
import Tasks from '../../ui/src/app/tasks.vue'
import Workspaces from '../../ui/src/app/workspaces.vue'
import RunDetail from '../../ui/src/app/run-detail.vue'
import { autocode } from '../../ui/src/app/api.ts'

describe('API boundary', () => {
  it('reads the canonical run_id from submission', async () => {
    mocks.post.mockResolvedValue({ data: { success: true, run_id: 'started' } })
    expect(await autocode.startRun({ agent: 'agent', account_id: 'account', image_id: 'image', workspace_id: '', repo_url: '', prompt: 'task', options: {}, unattended: false })).toEqual({ run_id: 'started' })
  })
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

describe('image settings completeness', () => {
  it('does not replace missing editable-image settings with catalog defaults', () => {
    const w = render(ImageForm, { edit: { image, build_log: '' }, capabilities: [] })
    expect(w.find('input').exists()).toBe(false)
    expect(w.text()).toContain('settings are unavailable')
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
