// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, render, respond, normal, account, image } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import Profiles from '../../ui/src/app/profiles.vue'
import Accounts from '../../ui/src/app/accounts.vue'
import Tasks from '../../ui/src/app/tasks.vue'
import Workspaces from '../../ui/src/app/workspaces.vue'
import { reconcile } from '../../ui/src/app/live.ts'
import { useCatalog } from '../../ui/src/app/catalog.ts'

const Catalog = defineComponent({ setup: useCatalog, template: '<div />' })
describe('subscription reconciliation and disposal', () => {
  it('publishes a snapshot and performs one catch-up read under continuous discoveries', async () => {
    let reads = 0
    const topics = ref<string[]>([])
    const published: string[][] = []
    let queued = 0
    const result = await reconcile(async () => [`id-${++reads}`], value => value, topics, () => reads < 5, value => published.push(value), () => { queued++ })
    expect(reads).toBe(2)
    expect(queued).toBe(1)
    expect(result).toEqual(['id-2'])
    expect(published[0]).toEqual(['id-1'])
    expect(topics.value).toEqual(['id-2'])
  })
  for (const [name, component, props, path, topic, response] of [
    ['profiles', Profiles, { query: '' }, '/profiles', 'component.p', { profiles: [{ id: 'p', title: 'Profile', agent: 'agent', image_id: 'i', options: {}, owner_user_id: 'u', owner: 'u', writable: true, deletable: true }] }],
    ['accounts', Accounts, { query: '', selectedAgent: '' }, '/accounts', 'component.a', { accounts: [account] }],
    ['tasks', Tasks, { query: '' }, '/images', 'component.i', { images: [image] }],
    ['workspaces', Workspaces, { query: '' }, '/workspaces', 'component.w', { workspaces: [{ id: 'w', name: 'Work', writable: true, deletable: false, shareable: false }] }],
  ] as const) {
    it(`${name} subscribes before reconciling discovered components`, async () => {
      normal()
      let reads = 0
      mocks.get.mockImplementation(async url => {
        if (url.endsWith(path)) {
          if (++reads === 2) expect(mocks.callbacks.has(topic)).toBe(true)
          return { data: { success: true, ...response } }
        }
        return { data: { success: true, ...respond(url) } }
      })
      render(component, props)
      await flushPromises()
      expect(reads).toBe(2)
      mocks.callbacks.get(topic)?.()
      await flushPromises()
      expect(reads).toBe(3)
    })
  }
  it('profiles reconciles every listed dependency and disposes component topics', async () => {
    normal()
    mocks.get.mockImplementation(async url => ({ data: { success: true, ...(url.endsWith('/profiles') ? { profiles: [{ id: 'p', title: 'Profile', agent: 'agent', image_id: 'i', options: {}, owner_user_id: 'u', owner: 'u', writable: true, deletable: true }] } : url.endsWith('/accounts') ? { accounts: [account] } : url.endsWith('/workspaces') ? { workspaces: [{ id: 'w', name: 'Work', writable: true, deletable: false, shareable: false }] } : respond(url)) } }))
    const wrapper = render(Profiles, { query: '' })
    await flushPromises()
    for (const id of ['p', 'a', 'i', 'w']) expect(mocks.callbacks.has(`component.${id}`)).toBe(true)
    const before = mocks.get.mock.calls.length
    mocks.callbacks.get('component.i')?.()
    await flushPromises()
    expect(mocks.get.mock.calls.length).toBeGreaterThan(before)
    wrapper.unmount()
    for (const id of ['p', 'a', 'i', 'w']) expect(mocks.callbacks.has(`component.${id}`)).toBe(false)
  })
  for (const [name, component, props] of [
    ['profiles', Profiles, { query: '' }], ['catalog', Catalog, {}], ['accounts', Accounts, { query: '', selectedAgent: '' }],
    ['tasks', Tasks, { query: '' }], ['workspaces', Workspaces, { query: '' }],
  ] as const) {
    for (const reject of [false, true]) it(`${name} discards late ${reject ? 'errors' : 'responses'} and queued work`, async () => {
      normal()
      const completions: (() => void)[] = []
      mocks.get.mockImplementation(url => new Promise((resolve, fail) => {
        completions.push(() => reject ? fail(new Error('late failure')) : resolve({ data: { success: true, ...respond(url) } }))
      }))
      const wrapper = render(component, props)
      const state = (wrapper.vm.$ as unknown as { setupState: Record<string, unknown> }).setupState
      const snapshot = () => Object.fromEntries(Object.entries(state).filter(([key]) => ['profiles', 'catalog', 'error', 'loaded', 'accounts', 'images', 'workspaces', 'runs', 'refreshing'].includes(key)))
      const before = snapshot()
      mocks.callbacks.get('chestor.autocode.runs')?.()
      const reads = mocks.get.mock.calls.length
      wrapper.unmount()
      completions.forEach(complete => complete())
      await flushPromises()
      expect(snapshot()).toEqual(before)
      expect(mocks.get.mock.calls.length).toBe(reads)
    })
  }
})
