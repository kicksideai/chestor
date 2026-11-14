// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, render, respond, normal } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import Workspaces from '../../ui/src/app/workspaces.vue'

describe('workspaces', () => {
  it('shows every approved path conflict for a refused legacy workspace', async () => {
    normal()
    mocks.get.mockResolvedValue({ data: { success: true, workspaces: [{ id: 'legacy', name: 'Legacy', host_path: '/srv/team', writable: true, deletable: true, shareable: true, approvable: true, context_revision: 1, conflicts: [{ id: 'first', host_path: '/srv/team/one' }, { id: 'second', host_path: '/srv/team/two' }] }] } })
    const w = render(Workspaces, { query: '' })
    await flushPromises()
    expect(w.text()).toContain('/srv/team/one')
    expect(w.text()).toContain('/srv/team/two')
    expect(w.find('[aria-label="Approve workspace"]').exists()).toBe(false)
  })
  it('shows the refusal reason and requires registration through the normal admin path', async () => {
    normal()
    mocks.get.mockResolvedValue({ data: { success: true, workspaces: [{ id: 'legacy', name: 'Legacy', host_path: '/srv/work/legacy', writable: true, deletable: true, shareable: true, unavailable_reason: 'A current WRITE holder lacks workspace-management authority; re-register through Autocode.' }] } })
    const w = render(Workspaces, { query: '' })
    await flushPromises()
    expect(w.text()).toContain('re-register through Autocode')
    expect(w.find('[aria-label="Approve workspace"]').exists()).toBe(false)
    expect(mocks.post).not.toHaveBeenCalled()
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
  it('mounts the shared grants widget only with ADMIN for workspaces', async () => {
    const item = { id: 'w', name: 'Workspace', writable: true, deletable: false, shareable: false }
    normal()
    mocks.get.mockImplementation(async url => ({ data: { success: true, ...(url.endsWith('/workspaces') ? { workspaces: [{ ...item, shareable: true }] } : respond(url)) } }))
    const w = render(Workspaces, { query: '' })
    await flushPromises()
    await w.get('[aria-label="Share"]').trigger('click')
    await flushPromises()
    const share = w.get('kickside-share')
    expect(JSON.parse(share.attributes('config') ?? '{}')).toMatchObject({ resource_id: item.id, access_url: `/api/v1/component-access/grants/${item.id}`, share_url: `/api/v1/component-access/share/${item.id}` })
    share.element.dispatchEvent(new Event('close'))
    await nextTick()
    expect(w.find('kickside-share').exists()).toBe(false)
    mocks.get.mockImplementation(async url => ({ data: { success: true, ...(url.endsWith('/workspaces') ? { workspaces: [{ ...item, shareable: false }] } : respond(url)) } }))
    const denied = render(Workspaces, { query: '' })
    await flushPromises()
    expect(denied.find('[aria-label="Share"]').exists()).toBe(false)
  })
  it('shows workspace loading until the initial list resolves', () => {
    mocks.get.mockReturnValue(new Promise(() => {}))
    const w = render(Workspaces, { query: '' })
    expect(w.text()).toContain('Loading')
    expect(w.text()).not.toContain('yet')
  })
  it('uses DELETE rather than WRITE for workspace removal', async () => {
    normal()
    mocks.get.mockResolvedValue({ data: { success: true, roots: [], workspaces: [{ id: 'w', name: 'Read and delete', writable: false, deletable: true, shareable: false }] } })
    const w = render(Workspaces, { query: '' })
    await flushPromises()
    expect(w.find('[aria-label="Delete workspace"]').exists()).toBe(true)
  })
})
