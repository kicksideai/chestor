// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mocks, normal, render, respond, account, image } from './fixtures.ts'
import Profiles from '../../ui/src/app/profiles.vue'
import TaskForm from '../../ui/src/app/task-form.vue'
import TaskConfig from '../../ui/src/app/task-config.vue'

const traits = [
  { id: 'work:read', title: 'Work read', description: 'Read boards', context_schema: { type: 'object', properties: { board_id: { type: 'string' } }, additionalProperties: false } },
  { id: 'pim:read', title: 'PIM read', description: 'Read catalogs', context_schema: { type: 'object', properties: { catalog_id: { type: 'string' }, note: { type: 'string' } }, additionalProperties: false } },
]
const tools = { traits: ['work:read', 'pim:read'], context: { board_id: 'board', catalog_id: 'catalog' } }
const profile = { id: 'p', title: 'Work and PIM', agent: 'agent', image_id: 'i', options: { model: 'kept' }, tools, owner_user_id: 'u', owner: 'u', writable: true, deletable: true }
function setup() {
  normal()
  mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path === '/api/v1/agents/traits' ? { traits } : path.endsWith('/profiles') ? { profiles: [profile] } : respond(path)) } }))
  mocks.post.mockImplementation(async path => ({ data: { success: true, ...(path.endsWith('/tool-surface') ? { count: 12, limit: 32 } : { id: 'new', run_id: 'r' }) } }))
  mocks.put.mockResolvedValue({ data: { success: true, id: 'p' } })
}
async function choose(w: ReturnType<typeof render>, value = tools) {
  w.get('wc-agent-trait-picker').element.dispatchEvent(new CustomEvent('change', { detail: {
    traits: value.traits, trait_contexts: { 'work:read': { board_id: value.context.board_id }, 'pim:read': { catalog_id: value.context.catalog_id } },
  } }))
  await flushPromises()
}
describe('trait tools in all authoring forms', () => {
  it('creates a profile with shared trait/context widgets and preserves it on edit and duplicate', async () => {
    setup()
    const w = render(Profiles, { query: '' })
    await flushPromises()
    ;(w.vm as unknown as { open: () => void }).open()
    await flushPromises()
    await w.get('[aria-label="Profile title"]').setValue('Selected traits')
    await w.get('select[required]').setValue('i')
    await choose(w)
    expect(w.text()).toContain('12 / 32 tools')
    const schema = JSON.parse(w.get('wc-schema-form').attributes('schema')!)
    expect(schema.properties.board_id.picker).toBe('wc-component-picker')
    expect(schema.properties.catalog_id.picker).toBe('wc-component-picker')
    expect(schema.properties.note.picker).toBeUndefined()
    await w.get('form').trigger('submit'); await flushPromises()
    expect(mocks.post).toHaveBeenCalledWith('/api/v1/autocode/profiles', expect.objectContaining({ tools }))
    await w.get('[aria-label="Duplicate profile"]').trigger('click'); await flushPromises()
    expect(JSON.parse(w.get('wc-agent-trait-picker').attributes('value')!)).toMatchObject({ traits: tools.traits, trait_contexts: { 'work:read': { board_id: 'board' }, 'pim:read': { catalog_id: 'catalog' } } })
    await w.get('form').trigger('submit'); await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1]).toMatchObject({ tools, options: { model: 'kept' } })
    await w.get('[aria-label="Edit profile"]').trigger('click'); await flushPromises()
    w.get('wc-agent-trait-picker').element.dispatchEvent(new CustomEvent('change', { detail: { traits: ['pim:read'], trait_contexts: { 'pim:read': { catalog_id: 'catalog' } } } }))
    await flushPromises(); await w.get('form').trigger('submit'); await flushPromises()
    expect(mocks.put.mock.calls.at(-1)?.[1]).toMatchObject({ tools: { traits: ['pim:read'], context: { catalog_id: 'catalog' } }, options: { model: 'kept' } })
    expect(profile.tools).toEqual(tools)
  })
  it('submits custom task traits and explicitly clears inherited traits', async () => {
    setup()
    const w = render(TaskForm, { accounts: [{ ...account, agent: 'agent', usable: true }], images: [image], workspaces: [] })
    await flushPromises(); await choose(w)
    await w.get('textarea').setValue('Read board and catalog'); await w.get('button.primary').trigger('click'); await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1]).toMatchObject({ tools })
    await w.get('[aria-label="Profile"]').setValue('p'); await flushPromises()
    expect(JSON.parse(w.get('wc-agent-trait-picker').attributes('value')!).traits).toEqual(tools.traits)
    w.get('wc-agent-trait-picker').element.dispatchEvent(new CustomEvent('change', { detail: { traits: [], trait_contexts: {} } }))
    await flushPromises(); await w.get('textarea').setValue('No traits'); await w.get('button.primary').trigger('click'); await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1]).toMatchObject({ profile_id: 'p', tools: { traits: [], context: {} } })
  })
  it('edits the published Block with the same trait adapter', async () => {
    setup(); mocks.props.value.config = { profile_id: 'p', prompt: 'task' }
    const w = render(TaskConfig); await flushPromises()
    const form = w.get('wc-schema-form')
    form.element.dispatchEvent(new CustomEvent('config-changed', { detail: { board_id: 'other-board', catalog_id: 'catalog' } }))
    await flushPromises()
    expect(mocks.emit.mock.calls.filter(c => c[0] === 'config-changed').at(-1)?.[1]).toMatchObject({ profile_id: 'p', tools: { ...tools, context: { board_id: 'other-board', catalog_id: 'catalog' } } })
  })
  it('keeps unavailable inherited traits visible and removable', async () => {
    setup()
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...(path === '/api/v1/agents/traits' ? { traits } : path.endsWith('/profiles') ? { profiles: [{ ...profile, tools: { traits: ['removed:trait'], context: { old_field: 'old' } } }] } : respond(path)) } }))
    const w = render(TaskForm, { accounts: [], images: [image], workspaces: [] })
    await flushPromises(); await w.get('[aria-label="Profile"]').setValue('p'); await flushPromises()
    expect(w.text()).toContain('removed:trait')
    await w.get('[aria-label="Remove unavailable trait removed:trait"]').trigger('click'); await flushPromises()
    expect(JSON.parse(w.get('wc-agent-trait-picker').attributes('value')!).traits).toEqual([])
    expect(mocks.post.mock.calls.at(-1)?.[1]).toEqual({ agent: 'agent', tools: { traits: [], context: {} } })
  })
  it('shows authoritative bound refusal and blocks submission until repaired', async () => {
    setup()
    mocks.post.mockResolvedValue({ data: { success: false, kind: 'INVALID', error: 'tool surface exceeds driver bound of 32', details: { code: 'autocode.tool_limit_exceeded', count: 38, limit: 32 }, retryable: false } })
    const w = render(TaskForm, { accounts: [{ ...account, agent: 'agent', usable: true }], images: [image], workspaces: [] })
    await flushPromises(); await choose(w); await w.get('textarea').setValue('task')
    expect(w.text()).toContain('38 / 32 tools')
    expect(w.text()).toContain('autocode.tool_limit_exceeded')
    expect(w.text()).toContain('tool surface exceeds driver bound of 32')
    expect(w.get('button.primary').attributes('disabled')).toBeDefined()
    expect(mocks.post.mock.calls.some(c => c[0].endsWith('/runs'))).toBe(false)
    mocks.post.mockResolvedValue({ data: { success: true, count: 12, limit: 32 } })
    await choose(w, { ...tools, context: { ...tools.context, board_id: 'repaired' } })
    expect(w.get('button.primary').attributes('disabled')).toBeUndefined()
  })
})
