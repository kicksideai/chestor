// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, account, driver, render, respond, normal } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import Accounts from '../../ui/src/app/accounts.vue'
import AccountRow from '../../ui/src/app/account-row.vue'
describe('accounts', () => {
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
