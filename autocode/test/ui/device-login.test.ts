// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import { mocks } from './fixtures.ts'
import CodexDeviceSetup from '../../ui/src/app/codex-device-setup.vue'

const waiting = { state: 'waiting', ticket: 'test-ticket', user_code: 'TEST-012',
  verification_url: 'https://auth.openai.com/codex/device', expires_at: 1000, retry_after: 1 }
const endpoint = '/api/v1/autocode/management/accounts/codex/device'
const reply = (result: object) => ({ data: { success: true, ...result } })

it('links to ChatGPT, copies the code, waits on throttling and confirms readiness', async () => {
  vi.useFakeTimers()
  const clipboard = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  mocks.post.mockResolvedValueOnce(reply(waiting))
    .mockResolvedValueOnce(reply({ state: 'rate_limited', retry_after: 10 }))
    .mockResolvedValueOnce(reply({ state: 'ready', account_id: 'test-account' }))
  const wrapper = mount(CodexDeviceSetup, { global: { plugins: [[PrimeVue, { unstyled: true }]] } })
  const button = (name: string) => wrapper.findAll('button').find(button => button.text() === name)!
  try {
    await button('Sign in with ChatGPT').trigger('click')
    await flushPromises()
    expect(mocks.post).toHaveBeenNthCalledWith(1, endpoint, { action: 'start', label: 'Codex', account_id: undefined })
    expect(wrapper.get('a').attributes()).toMatchObject({ href: waiting.verification_url, target: '_blank', rel: 'noopener noreferrer' })
    await button('Copy code').trigger('click')
    expect(clipboard).toHaveBeenCalledWith(waiting.user_code)
    await vi.advanceTimersByTimeAsync(1000)
    expect(mocks.post).toHaveBeenNthCalledWith(2, endpoint, { action: 'poll', ticket: waiting.ticket })
    expect(wrapper.text()).toContain('asked us to slow down')
    await vi.advanceTimersByTimeAsync(9999)
    expect(mocks.post).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(1)
    expect(wrapper.text()).toContain('Codex is ready')
    expect(wrapper.emitted('saved')).toEqual([[]])
    expect(wrapper.text()).not.toContain(waiting.user_code)
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})

it('cancels a ChatGPT sign-in and stops polling after the server confirms', async () => {
  vi.useFakeTimers()
  mocks.post.mockResolvedValueOnce(reply(waiting)).mockResolvedValueOnce(reply({ state: 'cancelled' }))
  const wrapper = mount(CodexDeviceSetup, { global: { plugins: [[PrimeVue, { unstyled: true }]] } })
  const button = (name: string) => wrapper.findAll('button').find(button => button.text() === name)!
  try {
    await button('Sign in with ChatGPT').trigger('click')
    await flushPromises()
    await button('Cancel sign-in').trigger('click')
    await flushPromises()
    expect(mocks.post).toHaveBeenNthCalledWith(2, endpoint, { action: 'cancel', ticket: waiting.ticket })
    expect(wrapper.text()).toContain('Sign-in was cancelled.')
    await vi.advanceTimersByTimeAsync(20000)
    expect(mocks.post).toHaveBeenCalledTimes(2)
  } finally {
    wrapper.unmount()
    vi.useRealTimers()
  }
})
