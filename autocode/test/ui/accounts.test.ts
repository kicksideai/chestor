// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, account, catalog, claudeLike, driver, render, respond, normal } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import Accounts from '../../ui/src/app/accounts.vue'
import ClaudeAccountUsage from '../../ui/src/app/claude-account-usage.vue'
import AccountRow from '../../ui/src/app/account-row.vue'
describe('accounts', () => {
  it('shows Claude subscription credentials and provider limits in plain language', async () => {
    normal()
    const credential = claudeLike.credentials[1]!
    const claude = { ...claudeLike, id: 'claude', title: 'Claude' }
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.startsWith('/api/v1/autocode/management/accounts')
      ? { agent: 'claude', providers: [], accounts: [{ ...account, agent: 'claude', credential_kind: credential.id,
          subscription: true, usable: true, rate_limits: {
            windows: [{ window: 'seven_day', utilization: 1, status: 'rejected', resets_at: Math.floor(Date.now() / 1000) + 3600 }],
            overage_status: 'rejected', overage_disabled_reason: 'org_level_disabled',
          }, last_error: 'rate_limit: Rate limit exceeded' }] } : respond(path)) } }))
    const w = mount(Accounts, {
      props: { query: '', selectedAgent: '', management: true, providerId: 'claude:binding' },
      slots: { usage: ({ account }) => h(ClaudeAccountUsage, { account }) },
      global: { provide: { catalog: ref({ ...catalog, agents: [claude] }) }, plugins: [[PrimeVue, { unstyled: true }]],
        stubs: { AppDialog: { template: '<div><slot /></div>' } } },
    })
    try {
      await flushPromises()
      expect(w.text()).toContain('Subscription token')
      expect(w.text()).toContain('Weekly limit reached, resets')
      expect(w.text()).toContain('Your organization has disabled extra usage.')
      expect(w.get('[role=progressbar]').attributes('aria-valuenow')).toBe('100')
      expect(w.get('.kx-disclosure').findAll('code').map(code => code.text())).toEqual(['seven_day · rejected', 'org_level_disabled'])
      expect(w.text()).not.toContain('CLAUDE_CODE_OAUTH_TOKEN')
      await w.get('[aria-haspopup=menu]').trigger('click')
      const edit = w.findAll('[role=menuitem]').find(item => item.text() === 'Edit credential')
      await edit!.get('[data-pc-section=itemcontent]').trigger('click')
      const form = JSON.parse(w.get('chestor-autocode-driver-account').attributes('config')!)
      expect(form.driver.credentials[1]).toMatchObject({ id: credential.id, label: 'Subscription token' })
    } finally {
      w.unmount()
    }
  })
  it('shows account loading until the initial list resolves', () => {
    mocks.get.mockReturnValue(new Promise(() => {}))
    const w = render(Accounts, { query: '', selectedAgent: '' })
    expect(w.text()).toContain('Loading')
    expect(w.text()).not.toContain('yet')
  })
  it('shows that an account update commits when clearing its cooldown fails', async () => {
    normal()
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/accounts')
      ? { accounts: [{ ...account, enabled: false }] } : respond(path)) } }))
    mocks.put.mockClear()
    mocks.put.mockResolvedValue({ data: { success: true, id: 'a', health_error: { message: 'Health unavailable', kind: 'Unavailable' } } })
    const w = render(Accounts, { query: '', selectedAgent: '' })
    await flushPromises()
    await w.get('[aria-label="Enable account"]').trigger('change')
    await flushPromises()
    expect(w.text()).toContain('Account saved, but its health could not be refreshed: Health unavailable')
    expect(mocks.put).toHaveBeenCalledTimes(1)
  })
  it('retains deactivated-driver accounts and gates delete independently of write', async () => {
    normal()
    mocks.get.mockResolvedValue({ data: { success: true, accounts: [account] } })
    const w = render(Accounts, { query: '', selectedAgent: '' })
    await flushPromises()
    expect(w.text()).toContain('Orphan')
    expect(w.find('[aria-label="Delete account"]').exists()).toBe(false)
  })
  it('offers an explicit enable or disable action in the provider editor', async () => {
    const w = mount(AccountRow, {
      props: {
        account: { ...account, enabled: true, writable: true },
        kindLabel: 'Key',
        ownerLabel: '',
        management: true,
      },
      global: { plugins: [[PrimeVue, { unstyled: true }]] },
    })
    try {
      await w.get('[aria-haspopup=menu]').trigger('click')
      const action = w.findAll('[role=menuitem]').find(item => item.text() === 'Disable')!
      await action.get('[data-pc-section=itemcontent]').trigger('click')
      expect(w.emitted('toggle')).toEqual([[]])
    } finally {
      w.unmount()
    }
  })
  it('shows delete for a DELETE-only account and hides WRITE actions', () => {
    const w = render(AccountRow, { account: { ...account, writable: false, deletable: true }, kindLabel: 'Key', ownerLabel: '' })
    expect(w.find('[aria-label="Delete account"]').exists()).toBe(true)
    expect(w.find('[aria-label="Rename account"]').exists()).toBe(false)
    expect(w.find('[aria-label="Edit account"]').exists()).toBe(false)
  })
})


it('edits a writable account through the credential card and preserves failures for retry', async () => {
  normal()
  const editable = { ...account, agent: 'agent', label: 'Existing', endpoint: { protocol: 'openai', base_url: 'https://old.example' } }
  mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/accounts') ? { accounts: [editable] } : respond(path)) } }))
  mocks.put.mockRejectedValueOnce(new Error('Save unavailable')).mockResolvedValue({ data: { success: true, id: 'a', health_error: { message: 'Health unavailable' } } })
  const w = render(Accounts, { query: '', selectedAgent: '' })
  await flushPromises()
  expect(w.find('[aria-label="Share"]').exists()).toBe(false)
  await w.get('[aria-label="Edit account"]').trigger('click')
  const card = w.get('chestor-autocode-driver-account')
  expect(JSON.parse(card.attributes('config')!)).toMatchObject({ driver, account: { id: 'a', label: 'Existing', credential_kind: 'key', endpoint: editable.endpoint } })
  const submit = () => card.element.dispatchEvent(new CustomEvent('submit', { detail: { agent: 'agent', credential_kind: 'key', label: 'Existing', secret: 'new-key', endpoint: { protocol: 'openai', base_url: 'https://new.example' } } }))
  submit()
  await flushPromises()
  expect(w.find('chestor-autocode-driver-account').exists()).toBe(true)
  expect(JSON.parse(card.attributes('config')!).error).toContain('Save unavailable')
  submit()
  await flushPromises()
  expect(mocks.put).toHaveBeenLastCalledWith(expect.stringContaining('/accounts/a'), { label: 'Existing', secret: 'new-key', endpoint: { protocol: 'openai', base_url: 'https://new.example' } })
  expect(w.find('chestor-autocode-driver-account').exists()).toBe(false)
  expect(w.text()).toContain('Health unavailable')
  await w.get('[aria-label="Edit account"]').trigger('click')
  w.get('chestor-autocode-driver-account').element.dispatchEvent(new CustomEvent('submit', { detail: { agent: 'agent', credential_kind: 'key', label: 'Existing', secret: '' } }))
  await flushPromises()
  expect(mocks.put).toHaveBeenLastCalledWith(expect.stringContaining('/accounts/a'), { label: 'Existing', endpoint: { base_url: '' } })
})

it('rejects a credential-kind mismatch when editing an account', async () => {
  normal()
  mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/accounts') ? { accounts: [{ ...account, agent: 'agent', writable: true }] } : respond(path)) } }))
  const w = render(Accounts, { query: '', selectedAgent: 'agent' })
  await flushPromises()
  await w.get('[aria-label="Edit account"]').trigger('click')
  w.get('chestor-autocode-driver-account').element.dispatchEvent(new CustomEvent('submit', { detail: { agent: 'agent', credential_kind: 'file', label: 'Existing', secret: '{}' } }))
  await flushPromises()
  expect(mocks.put).not.toHaveBeenCalled()
  expect(JSON.parse(w.get('chestor-autocode-driver-account').attributes('config')!).error).toBe('Invalid account submission.')
})
