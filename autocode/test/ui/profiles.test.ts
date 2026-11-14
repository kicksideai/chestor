// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, render, normal, respond, run } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import DriverOptions from '../../ui/src/app/driver-options.vue'
import TaskConfig from '../../ui/src/app/task-config.vue'
import Profiles from '../../ui/src/app/profiles.vue'
import AccountRow from '../../ui/src/app/account-row.vue'
import TaskForm from '../../ui/src/app/task-form.vue'
import { account, image } from './fixtures.ts'
import RunDetail from '../../ui/src/app/run-detail.vue'
import { claudeLike } from './fixtures.ts'

const profile = { id: 'p', title: 'DeepSeek', agent: 'claude', image_id: 'i', account_pool: [], options: { model: 'sonnet' }, owner_user_id: 'owner', owner: 'owner', writable: true, deletable: true, endpoint: { protocol: 'anthropic-messages', base_url: 'https://models.example', model: 'deepseek' } }
describe('profiles and normalized run information', () => {
  it('shows loading retry and no-match states', async () => {
    normal()
    mocks.get.mockRejectedValue(new Error('Profile read failed'))
    const w = render(Profiles, { query: 'unmatched' })
    expect(w.text()).toContain('Loading profiles')
    await flushPromises()
    expect(w.get('[role="alert"]').text()).toContain('Profile read failed')
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/profiles') ? { profiles: [profile] } : respond(path)) } }))
    await w.get('button[aria-label="Retry profiles"]').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('No matches')
  })
  it('shows rejected profile saves inside the active dialog', async () => {
    normal()
    mocks.post.mockRejectedValue(new Error('Profile permission refused'))
    const w = render(Profiles, { query: '' })
    await flushPromises()
    ;(w.vm as unknown as { open: () => void }).open()
    await flushPromises()
    await w.get('input[aria-label="Profile title"]').setValue('Rejected')
    await w.get('select[required]').setValue('i')
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.getComponent({ name: 'AppDialog' }).get('[role="alert"]').text()).toContain('Profile permission refused')
  })
  it('waits for profile loading before showing the empty state', async () => {
    normal()
    mocks.get.mockImplementation(() => new Promise(() => {}))
    const w = render(Profiles, { query: '' })
    expect(w.text()).not.toContain('Create a profile to reuse')
  })
  it('shows unattended and inherited option defaults in task and profile forms', async () => {
    normal()
    const agent = { ...claudeLike, id: 'agent' }
    const form = render(TaskForm, { accounts: [{ ...account, agent: 'agent', usable: true }], images: [image], workspaces: [] }, [agent])
    await flushPromises()
    expect(form.get('[aria-label="Permission mode"]').attributes('placeholder')).toContain('bypassPermissions')
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/profiles') ? { profiles: [{ ...profile, agent: 'agent', options: { permission_mode: 'inherited' } }] } : respond(path)) } }))
    const inherited = render(TaskForm, { accounts: [], images: [image], workspaces: [] }, [agent])
    await flushPromises()
    await inherited.get('select[aria-label="Profile"]').setValue('p')
    expect(inherited.get('[aria-label="Permission mode"]').attributes('placeholder')).toContain('inherited')
    const profiles = render(Profiles, { query: '' }, [agent])
    await flushPromises()
    ;(profiles.vm as unknown as { open: () => void }).open()
    await flushPromises()
    expect(profiles.get('[aria-label="Permission mode"]').attributes('placeholder')).toContain('bypassPermissions')
  })
  it('serializes explicit clearing of inherited workflow timeout and repository ref', async () => {
    normal()
    mocks.props.value.config = { profile_id: 'p', prompt: 'task' }
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/profiles') ? { profiles: [{ ...profile, run_timeout: '5m', repo_ref: 'feature' }] } : respond(path)) } }))
    const w = render(TaskConfig)
    await flushPromises()
    await w.get('input[aria-label="Repository ref"]').setValue('')
    const timeout = w.findAll('input').find(input => input.attributes('placeholder') === 'Use configured timeout')!
    await timeout.setValue('')
    const changed = mocks.emit.mock.calls.filter(c => c[0] === 'config-changed').at(-1)?.[1]
    expect(JSON.parse(JSON.stringify(changed))).toMatchObject({ profile_id: 'p', repo_ref: '', run_timeout: '' })
  })
  it('shows inherited targets and unattended mode exactly as they will be submitted after resources disappear', async () => {
    normal()
    const selected = { ...profile, agent: 'agent', unattended: false }
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/profiles') ? { profiles: [selected] } : respond(path)) } }))
    mocks.post.mockResolvedValue({ data: { success: true, run_id: 'r' } })
    const w = render(TaskForm, { accounts: [{ ...account, agent: 'agent', usable: true }], images: [image], workspaces: [] }, [{ ...claudeLike, id: 'agent' }])
    await flushPromises()
    await w.get('select[aria-label="Profile"]').setValue('p')
    await w.setProps({ images: [] })
    await flushPromises()
    expect((w.get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)
    expect(w.text()).toContain('unavailable')
    await w.get('textarea').setValue('task')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1]).toMatchObject({ profile_id: 'p' })
    expect(mocks.post.mock.calls.at(-1)?.[1]).not.toHaveProperty('image_id')
  })
  it('lists, edits and duplicates profiles without credentials', async () => {
    normal()
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/profiles') ? { profiles: [profile] } : respond(path)) } }))
    mocks.post.mockResolvedValue({ data: { success: true, id: 'copy' } })
    mocks.put.mockResolvedValue({ data: { success: true, id: 'p' } })
    const w = render(Profiles, { query: '' })
    await flushPromises()
    expect(w.text()).toContain('DeepSeek')
    await w.get('[aria-label="Duplicate profile"]').trigger('click')
    await flushPromises()
    expect(w.get<HTMLInputElement>('input[aria-label="Profile title"]').element.value).toBe('DeepSeek copy')
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(mocks.post).toHaveBeenCalledWith('/api/v1/autocode/profiles', expect.objectContaining({ title: 'DeepSeek copy', agent: 'claude', endpoint: profile.endpoint }))
    expect(JSON.stringify(mocks.post.mock.calls)).not.toContain('secret')
    await w.get('[aria-label="Edit profile"]').trigger('click')
    await flushPromises()
    await w.get('input[aria-label="Profile title"]').setValue('Renamed')
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(mocks.put).toHaveBeenCalledWith('/api/v1/autocode/profiles/p', expect.objectContaining({ title: 'Renamed' }))
  })
  it('selects a workflow profile and emits only explicit stage overrides', async () => {
    normal()
    mocks.props.value.config = { prompt: 'task' }
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/profiles') ? { profiles: [profile] } : respond(path)) } }))
    const w = render(TaskConfig)
    await flushPromises()
    await w.get('select[aria-label="Profile"]').setValue('p')
    await flushPromises()
    const chosen = mocks.emit.mock.calls.filter(c => c[0] === 'config-changed').at(-1)?.[1]
    expect(chosen).toMatchObject({ profile_id: 'p', prompt: 'task' })
    expect(chosen).not.toHaveProperty('agent')
    expect(chosen).not.toHaveProperty('image_id')
    await w.get('input[aria-label="Repository ref"]').setValue('feature')
    const overridden = mocks.emit.mock.calls.filter(c => c[0] === 'config-changed').at(-1)?.[1]
    expect(overridden).toMatchObject({ profile_id: 'p', repo_ref: 'feature' })
    expect(overridden).not.toHaveProperty('image_id')
  })
  it('preserves an explicit permission option while unattended is selected', () => {
    const w = render(DriverOptions, { options: claudeLike.options, modelValue: { permission_mode: 'manual' }, defaults: claudeLike.unattended })
    expect((w.get('input[aria-label="Permission mode"]').element as HTMLInputElement).value).toBe('manual')
  })
  it('submits a named profile without converting its defaults into explicit task fields', async () => {
    normal()
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/profiles') ? { profiles: [{ ...profile, agent: 'agent' }] } : respond(path)) } }))
    mocks.post.mockResolvedValue({ data: { success: true, run_id: 'r' } })
    const w = render(TaskForm, { accounts: [{ ...account, agent: 'agent', usable: true }], images: [image], workspaces: [] })
    await flushPromises()
    await w.get('select[aria-label="Profile"]').setValue('p')
    await w.get('textarea').setValue('task')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    const body = mocks.post.mock.calls.at(-1)?.[1]
    expect(body).toMatchObject({ profile_id: 'p', prompt: 'task', options: {} })
    expect(body).not.toHaveProperty('agent')
    expect(body).not.toHaveProperty('image_id')
    expect(body).not.toHaveProperty('unattended')
  })
  it('shows normalized account window percentages and reset times', () => {
    const w = render(AccountRow, { account: { ...account, rate_limits: { windows: [{ window: 'seven_day', utilization: 0.12, status: 'warning', resets_at: 2000000000 }], overage_status: 'allowed' } }, kindLabel: 'API key', ownerLabel: 'Owner' })
    expect(w.text()).toContain('7-day: 12% used, resets')
    expect(w.text()).toContain('Overage: allowed')
  })
  it('shows cost, cache writes, model usage and effective options', async () => {
    normal()
    mocks.get.mockResolvedValue({ data: { success: true, run: { ...run, usage: { cost_usd: 0.125, cache_write_tokens: 12, models: { deepseek: { input_tokens: 2, cost_usd: 0.125 } } }, options: { permission_mode: 'acceptEdits' } }, events: [], more: false, next_seq: 0 } })
    const w = render(RunDetail, { runId: 'r', accounts: [], images: [], workspaces: [] })
    await flushPromises()
    expect(w.text()).toContain('$0.125')
    expect(w.text()).toContain('12 cache write')
    expect(w.text()).toContain('deepseek')
    expect(w.text()).toContain('acceptEdits')
  })
})
