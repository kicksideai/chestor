// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import EntryRenderer from './EntryRenderer.vue'

const { register } = vi.hoisted(() => ({ register: vi.fn() }))
vi.mock('@wippy-fe/proxy', () => ({ loadByTagName: register }))
vi.mock('./shared', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    Button: defineComponent({ setup: (_, { slots }) => () => h('button', slots.default?.()) }),
    Notice: defineComponent({ setup: (_, { slots }) => () => h('div', slots.default?.()) }),
  }
})
afterEach(() => register.mockReset())

it('ignores a registration that finishes after a different preview is selected', async () => {
  let finishFirst!: () => void
  register.mockImplementationOnce(() => new Promise<void>(resolve => { finishFirst = resolve }))
  register.mockImplementationOnce(async () => {
    customElements.define('test-preview-current', class extends HTMLElement {})
  })
  const wrapper = mount(EntryRenderer, { props: { tag: 'test-preview-old', attrs: { 'entry-id': 'old' } } })
  try {
    await wrapper.setProps({ tag: 'test-preview-current', attrs: { 'entry-id': 'current' } })
    await flushPromises()
    customElements.define('test-preview-old', class extends HTMLElement {})
    finishFirst()
    await flushPromises()
    expect(wrapper.findAll('.ws-renderer-mount > *')).toHaveLength(1)
    expect(wrapper.get('test-preview-current').attributes('entry-id')).toBe('current')
    expect(wrapper.find('test-preview-old').exists()).toBe(false)
    const current = wrapper.get('test-preview-current').element as HTMLElement
    expect(current.style.position).toBe('')
    expect(current.style.height).toBe('100%')
  } finally { wrapper.unmount() }
})

it('ignores a registration failure from an earlier preview', async () => {
  let failFirst!: (error: Error) => void
  register.mockImplementationOnce(() => new Promise<void>((_, reject) => { failFirst = reject }))
  register.mockImplementationOnce(async () => {
    customElements.define('test-preview-survivor', class extends HTMLElement {})
  })
  const wrapper = mount(EntryRenderer, { props: { tag: 'test-preview-failed', attrs: {} } })
  try {
    await wrapper.setProps({ tag: 'test-preview-survivor' })
    await flushPromises()
    failFirst(new Error('Old request failed'))
    await flushPromises()
    expect(wrapper.find('.ws-renderer-fail').exists()).toBe(false)
    expect(wrapper.find('test-preview-survivor').exists()).toBe(true)
  } finally { wrapper.unmount() }
})

it('does not create a renderer after its host unmounts', async () => {
  let finish!: () => void
  const connected = vi.fn()
  register.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve }))
  const wrapper = mount(EntryRenderer, { props: { tag: 'test-preview-abandoned', attrs: {} }, attachTo: document.body })
  wrapper.unmount()
  customElements.define('test-preview-abandoned', class extends HTMLElement { connectedCallback() { connected() } })
  finish()
  await flushPromises()
  expect(connected).not.toHaveBeenCalled()
})
