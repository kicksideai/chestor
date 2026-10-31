// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, render, respond, normal, account, image } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Accounts from '../../ui/src/app/accounts.vue'
import Tasks from '../../ui/src/app/tasks.vue'
import Workspaces from '../../ui/src/app/workspaces.vue'
import { useCatalog } from '../../ui/src/app/catalog.ts'

const Catalog = defineComponent({ setup: useCatalog, template: '<div />' })
describe('subscription reconciliation and disposal', () => {
  for (const [name, component, props, path, topic, response] of [
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
  for (const [name, component, props] of [
    ['catalog', Catalog, {}], ['accounts', Accounts, { query: '', selectedAgent: '' }],
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
      const snapshot = () => Object.fromEntries(Object.entries(state).filter(([key]) => ['catalog', 'error', 'loaded', 'accounts', 'images', 'workspaces', 'runs', 'refreshing'].includes(key)))
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
