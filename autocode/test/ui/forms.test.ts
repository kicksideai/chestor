// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, driver, claudeLike, option, render, respond, normal, account, image } from './fixtures.ts'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
import DriverOptions from '../../ui/src/app/driver-options.vue'
import TaskForm from '../../ui/src/app/task-form.vue'
import TaskConfig from '../../ui/src/app/task-config.vue'
import DriverAccount from '../../ui/src/app/driver-account.vue'
import { driverDefaults } from '../../ui/src/app/defaults.ts'

describe('option drafts', () => {
  it.each([
    { type: 'number', schema: { type: 'number', minimum: 0 }, raw: '1.5', value: 1.5 },
    { type: 'integer', schema: { type: 'integer', minimum: 1 }, raw: '3', value: 3 },
    { type: 'string', schema: { type: 'number' }, raw: '2.5', value: 2.5 },
  ])('parses $type options before schema validation', async ({ type, schema, raw, value }) => {
    const w = render(DriverOptions, { options: [{ ...option, name: 'limit', type, schema }], modelValue: {} })
    await w.get('input[aria-label="Configuration"]').setValue(raw)
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([{ limit: value }])
    expect(w.emitted('invalid')?.at(-1)).toEqual([0])
  })
  it('rejects nonfinite numbers and fractional integers without replacing the last valid value', async () => {
    const w = render(DriverOptions, { options: [{ ...option, type: 'integer', schema: { type: 'integer' } }], modelValue: { config: 3 } })
    for (const raw of ['no number', 'Infinity', '1.5']) {
      await w.get('input[aria-label="Configuration"]').setValue(raw)
      expect(w.emitted('update:modelValue')).toBeUndefined()
      expect(w.emitted('invalid')?.at(-1)).toEqual([1])
    }
    await w.get('input[aria-label="Configuration"]').setValue('')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([{}])
  })

  it('keeps the valid value when a draft is invalid', async () => {
    const w = render(DriverOptions, { options: [option], modelValue: { config: { keep: true } } })
    await w.get('textarea').setValue('{broken')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('invalid')?.at(-1)).toEqual([1])
  })
  it('reconciles drafts after an authoritative value change', async () => {
    const w = render(DriverOptions, { options: [option], modelValue: { config: {} } })
    await w.get('textarea').setValue('{broken')
    await w.setProps({ modelValue: { config: { replacement: true } } })
    expect(w.get('textarea').element.value).toContain('replacement')
    expect(w.emitted('invalid')?.at(-1)).toEqual([0])
  })
  it('rejects valid JSON that fails the supplied option schema', async () => {
    const w = render(DriverOptions, { options: [option], modelValue: {} })
    await w.get('textarea').setValue('[]')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('invalid')?.at(-1)).toEqual([1])
  })
  it('filters batch profiles and labels controls', () => {
    const w = render(DriverOptions, { options: [option, { ...option, name: 'interactive', profiles: ['interactive'] }], modelValue: {} })
    expect(w.findAll('textarea')).toHaveLength(1)
    expect(w.get('textarea').attributes('aria-label')).toBeTruthy()
    expect(w.get('input').attributes('aria-label')).toBeTruthy()
  })
})
describe('credential selection', () => {
  function card() {
    mocks.props.value.config = { driver, busy: false }
    return render(DriverAccount)
  }
  it('clears secrets and endpoints on a credential-kind change', async () => {
    const w = card()
    await w.get('textarea').setValue('old secret')
    await w.get('select').setValue('login')
    expect(w.get('textarea').element.value).toBe('')
  })
  it('ignores a late file read after the kind changes', async () => {
    const w = card()
    let complete: (value: string) => void = () => {}
    await w.get('.da-drop').trigger('drop', { dataTransfer: { files: [{ name: 'key.txt', size: 5, text: () => new Promise<string>(resolve => { complete = resolve }) }] } })
    await w.get('select').setValue('login')
    complete('late secret')
    await flushPromises()
    expect(w.get('textarea').element.value).toBe('')
    expect(w.text()).not.toContain('key.txt loaded')
  })
  it('catches file read errors and clears them on a successful drop', async () => {
    const w = card()
    await w.get('.da-drop').trigger('drop', { dataTransfer: { files: [{ name: 'bad.txt', size: 5, text: () => Promise.reject(new Error('read failed')) }] } })
    await flushPromises()
    expect(w.text()).toContain('Could not read')
    await w.get('.da-drop').trigger('drop', { dataTransfer: { files: [{ name: 'key.txt', size: 5, text: () => Promise.resolve('valid') }] } })
    await flushPromises()
    expect(w.text()).not.toContain('Could not read')
  })
  it('freezes the credential fields while saving', async () => {
    const w = card()
    reactive(mocks.props).value.config.busy = true
    await nextTick()
    expect(w.get('select').element.disabled).toBe(true)
    expect(w.get('textarea').element.disabled).toBe(true)
  })
})

describe('workflow option validity', () => {
  it('does not publish another configuration while an option draft is invalid', async () => {
    normal()
    mocks.props.value.config = { agent: 'agent', image_id: 'i', prompt: 'Task', options: { config: {} } }
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path), ...(path.endsWith('/catalog') ? { agents: [{ ...driver, options: [option] }] } : {}) } }))
    const w = render(TaskConfig)
    await flushPromises()
    mocks.emit.mockClear()
    await w.get('textarea[rows="2"]').setValue('{broken')
    await w.get('textarea[rows="4"]').setValue('Changed task')
    expect(mocks.emit.mock.calls.filter(([name]) => name === 'config-changed')).toHaveLength(0)
    expect(w.text()).toContain('invalid')
    await w.get('textarea[rows="2"]').setValue('{"fixed":true}')
    const changes = mocks.emit.mock.calls.filter(([name]) => name === 'config-changed')
    expect(changes).toHaveLength(1)
    expect(changes[0]?.[1]).toMatchObject({ prompt: 'Changed task', options: { config: { fixed: true } } })
  })
})

describe('workflow run timeout', () => {
  it('emits the run timeout and omits it when the field is cleared', async () => {
    normal()
    mocks.props.value.config = { agent: 'agent', image_id: 'i', prompt: 'Task', run_timeout: '5m' }
    const w = render(TaskConfig)
    await flushPromises()
    mocks.emit.mockClear()
    const input = w.findAll('input').find(i => i.attributes('placeholder') === 'Use configured timeout')!
    expect((input.element as HTMLInputElement).value).toBe('5m')
    await input.setValue('10m')
    await input.trigger('change')
    let changes = mocks.emit.mock.calls.filter(([name]) => name === 'config-changed')
    expect(changes.at(-1)?.[1]).toMatchObject({ run_timeout: '10m' })
    expect(changes.at(-1)?.[1]).not.toHaveProperty('timeout')
    await input.setValue('')
    await input.trigger('change')
    changes = mocks.emit.mock.calls.filter(([name]) => name === 'config-changed')
    expect(changes.at(-1)?.[1]?.run_timeout).toBeUndefined()
  })
})

describe('credential metadata validation', () => {
  it('validates the declared credential format before submission', async () => {
    mocks.props.value.config = { driver: { ...driver, credentials: [{ ...driver.credentials[0], format: 'single_line' }] }, limits: { label_bytes: 10, secret_bytes: 20, endpoint_url_bytes: 50, endpoint_model_bytes: 10 } }
    const w = render(DriverAccount)
    await w.get('textarea').setValue('line one\nline two')
    expect(w.text()).toContain('single line')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(true)
  })
  it('rejects arrays for a credential declared as a JSON object', async () => {
    mocks.props.value.config = { driver: { ...driver, credentials: [{ ...driver.credentials[1], format: 'json_object' }] } }
    const w = render(DriverAccount)
    await w.get('textarea').setValue('[]')
    expect(w.text()).toContain('JSON object')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(true)
  })
})

describe('web component props', () => {
  it('reports malformed credential-card configuration before rendering fields', () => {
    mocks.props.value.config = { driver: { ...driver, credentials: 4 } }
    const w = render(DriverAccount)
    expect(w.text()).toContain('configuration is invalid')
    expect(w.find('textarea').exists()).toBe(false)
  })
  it('reports malformed workflow configuration instead of normalizing it', async () => {
    normal()
    mocks.props.value.config = { agent: 'agent', options: [] }
    const w = render(TaskConfig)
    await flushPromises()
    expect(w.text()).toContain('configuration is invalid')
    expect(w.find('textarea').exists()).toBe(false)
  })
})

describe('batch defaults', () => {
  it('does not seed task options from an interactive-only default', () => {
    const defaults = driverDefaults({ ...driver, options: [{ ...option, name: 'batch', profiles: ['batch'], default: {} }, { ...option, name: 'interactive', profiles: ['interactive'], default: {} }] })
    expect(defaults).toEqual({ batch: {} })
  })
})


describe('task account cooldown', () => {
  it('enables Start when cooldown expires without another account response', async () => {
    vi.useFakeTimers()
    try {
      const cooling = { ...account, agent: 'agent', label: 'Cooling', usable: true, unavailable_reason: undefined, cooldown_until: new Date(Date.now() + 2000).toISOString() }
      const w = render(TaskForm, { accounts: [cooling, { ...cooling, id: 'unavailable', label: 'Unavailable', usable: false }], images: [image], workspaces: [] })
      await w.get('textarea').setValue('Task')
      expect(w.get<HTMLButtonElement>('button.primary').element.disabled).toBe(true)
      expect(w.text()).toContain('cooling down until')
      expect(w.text()).not.toContain('Unavailable')
      await vi.advanceTimersByTimeAsync(3000)
      await nextTick()
      expect(w.get<HTMLButtonElement>('button.primary').element.disabled).toBe(false)
      expect(w.text()).toContain('Auto (1 ready)')
    } finally {
      vi.useRealTimers()
    }
  })
})


describe('task submission retries', () => {
  it('reuses the committed request key after its response is lost', async () => {
    const committed = new Map<string, string>()
    const requests: Record<string, unknown>[] = []
    mocks.post.mockImplementation(async (_path: string, body: Record<string, unknown>) => {
      requests.push(JSON.parse(JSON.stringify(body)) as Record<string, unknown>)
      const key = String(body.idempotency_key)
      const existing = committed.get(key)
      if (existing) return { data: { success: true, run_id: existing } }
      committed.set(key, `run-${committed.size + 1}`)
      throw new Error('Response lost')
    })
    const w = render(TaskForm, { accounts: [{ ...account, agent: 'agent', usable: true }], images: [image], workspaces: [] })
    await w.get('textarea').setValue('Task')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Response lost')
    expect(requests[0]?.idempotency_key).toEqual(expect.any(String))
    expect(requests[0]?.idempotency_key).toBeTruthy()
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(requests[1]).toEqual(requests[0])
    expect(committed.size).toBe(1)
    expect(w.emitted('started')).toEqual([['run-1']])
    await w.get('textarea').setValue('Task')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(requests[2]?.idempotency_key).not.toBe(requests[0]?.idempotency_key)
    await w.get('textarea').setValue('Changed task')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(requests[3]?.idempotency_key).not.toBe(requests[2]?.idempotency_key)
    expect(committed.size).toBe(3)
  })
})


describe('unattended driver options', () => {
  const other = { ...claudeLike, id: 'other', title: 'Other', unattended: { permission_mode: 'bypassPermissions', model: 'managed' } }
  function form() {
    mocks.post.mockClear()
    mocks.post.mockResolvedValue({ data: { success: true, run_id: 'queued' } })
    return render(TaskForm, {
      accounts: [claudeLike, other].map(d => ({ ...account, id: d.id, agent: d.id, usable: true })),
      images: [{ ...image, agents: [claudeLike.id, other.id] }], workspaces: [],
    }, [claudeLike, other])
  }
  it('omits conflicting defaults on task mount and submission', async () => {
    const w = form()
    expect(w.getComponent(DriverOptions).props('modelValue')).toEqual({ model: 'sonnet' })
    await w.get('textarea').setValue('Task')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1]).toMatchObject({ unattended: true, options: { model: 'sonnet' } })
    expect(mocks.post.mock.calls.at(-1)?.[1].options).not.toHaveProperty('permission_mode')
  })
  it('normalizes a switch between unattended drivers even when the toggle stays on', async () => {
    const w = form()
    w.getComponent({ name: 'agent-picker' }).vm.$emit('update:modelValue', other.id)
    await nextTick()
    expect(w.getComponent(DriverOptions).props('modelValue')).toEqual({})
    await w.get('textarea').setValue('Task')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1]).toMatchObject({ agent: other.id, unattended: true, options: {} })
  })
  it('drops edited options when unattended mode is enabled again', async () => {
    const w = form()
    const toggle = w.get('input[type="checkbox"]')
    await toggle.setValue(false)
    w.getComponent(DriverOptions).vm.$emit('update:modelValue', { permission_mode: 'manual', model: 'custom' })
    await nextTick()
    await toggle.setValue(true)
    expect(w.getComponent(DriverOptions).props('modelValue')).toEqual({ model: 'custom' })
  })
  function workflow(config: Record<string, unknown>) {
    normal()
    mocks.emit.mockClear()
    mocks.props.value.config = config
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path), ...(path.endsWith('/catalog') ? { agents: [claudeLike, other] } : {}) } }))
    return render(TaskConfig)
  }
  it('normalizes new workflow defaults before emitting them', async () => {
    const w = workflow({})
    await flushPromises()
    expect(w.getComponent(DriverOptions).props('modelValue')).toEqual({ model: 'sonnet' })
    expect(mocks.emit.mock.calls.at(-1)?.[1].options).toEqual({ model: 'sonnet' })
  })
  it('normalizes saved workflow options on mount and every unattended toggle', async () => {
    const w = workflow({ agent: claudeLike.id, prompt: 'Task', unattended: true, options: { permission_mode: 'manual', model: 'custom' } })
    await flushPromises()
    expect(w.getComponent(DriverOptions).props('modelValue')).toEqual({ model: 'custom' })
    const toggle = w.get('details input[type="checkbox"]')
    await toggle.setValue(false)
    expect(mocks.emit.mock.calls.at(-1)?.[1].options).toEqual({ permission_mode: 'manual', model: 'custom' })
    await toggle.setValue(true)
    expect(mocks.emit.mock.calls.at(-1)?.[1].options).toEqual({ model: 'custom' })
  })
  it('normalizes workflow driver switches before emitting config', async () => {
    const w = workflow({})
    await flushPromises()
    await w.get('select').setValue(other.id)
    expect(w.getComponent(DriverOptions).props('modelValue')).toEqual({})
    expect(mocks.emit.mock.calls.at(-1)?.[1]).toMatchObject({ agent: other.id, unattended: true, options: {} })
  })
})


describe('task advanced settings', () => {
  it('submits timeout and repository ref, and changes the retry key when either changes', async () => {
    mocks.post.mockRejectedValue(new Error('Response lost'))
    const w = render(TaskForm, { accounts: [{ ...account, agent: 'agent', usable: true }], images: [image], workspaces: [] })
    await w.get('textarea').setValue('Task')
    const timeout = w.get('details input[placeholder="Use configured timeout"]')
    const repoRef = w.get<HTMLInputElement>('details input[aria-label="Repository ref"]')
    await timeout.setValue(' 10m ')
    await repoRef.setValue(' feature/test ')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    const first = mocks.post.mock.calls.at(-1)?.[1]
    expect(first).toMatchObject({ timeout: '10m', repo_ref: 'feature/test' })
    await timeout.setValue('15m')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    const second = mocks.post.mock.calls.at(-1)?.[1]
    expect(second.idempotency_key).not.toBe(first.idempotency_key)
    await repoRef.setValue('main')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1].idempotency_key).not.toBe(second.idempotency_key)
    await timeout.setValue('')
    await repoRef.setValue('')
    await w.get('button.primary').trigger('click')
    await flushPromises()
    expect(mocks.post.mock.calls.at(-1)?.[1].timeout).toBeUndefined()
    expect(mocks.post.mock.calls.at(-1)?.[1].repo_ref).toBeUndefined()
  })
  it('loads, emits and clears a workflow repository ref', async () => {
    normal()
    mocks.props.value.config = { agent: 'agent', image_id: 'i', prompt: 'Task', repo_ref: 'release/v1' }
    const w = render(TaskConfig)
    await flushPromises()
    const input = w.get<HTMLInputElement>('details input[aria-label="Repository ref"]')
    expect(input.element.value).toBe('release/v1')
    await input.setValue(' feature/test ')
    await input.trigger('change')
    expect(mocks.emit.mock.calls.at(-1)?.[1]).toMatchObject({ repo_ref: 'feature/test' })
    await input.setValue('')
    await input.trigger('change')
    expect(mocks.emit.mock.calls.at(-1)?.[1].repo_ref).toBeUndefined()
  })
})

describe('credential rotation card', () => {
  it('prefills editable public fields and permits endpoint-only updates without a secret', async () => {
    mocks.props.value.config = { driver, account: { id: 'a', label: 'Existing', credential_kind: 'key', endpoint: { protocol: 'openai', base_url: 'https://old.example/v1', model: 'old' } } }
    const w = render(DriverAccount)
    expect(w.text()).toContain('Edit')
    expect(w.get('textarea').element.value).toBe('')
    const url = w.get<HTMLInputElement>('input[placeholder^="http://api.example"]')
    expect(url.element.value).toBe('https://old.example/v1')
    await url.setValue('https://new.example/v1')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(false)
    await w.get('button.da-btn').trigger('click')
    expect(mocks.emit).toHaveBeenLastCalledWith('submit', expect.objectContaining({ label: 'Existing', secret: '', endpoint: { protocol: 'openai', base_url: 'https://new.example/v1', model: 'old' } }))
    await url.setValue('')
    await w.get('button.da-btn').trigger('click')
    expect(mocks.emit.mock.calls.at(-1)?.[1].endpoint).toBeUndefined()
    await w.get('select').setValue('login')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(true)
  })
  it.each(['single_line', 'json_object'])('validates replacement credentials with the same $0 format as Add', async format => {
    mocks.props.value.config = { driver: { ...driver, credentials: [{ ...driver.credentials[0], format }] }, account: { id: 'a', label: 'Existing', credential_kind: 'key' } }
    const w = render(DriverAccount)
    await w.get('textarea').setValue(format === 'single_line' ? 'first\nsecond' : '[]')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(true)
    await w.get('textarea').setValue(format === 'single_line' ? 'new-key' : '{"token":"new"}')
    expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(false)
  })
})


it('keeps task choices and option edits when the active agent chip is clicked again', async () => {
  const w = render(TaskForm, { accounts: [{ ...account, agent: claudeLike.id, usable: true }], images: [{ ...image, agents: [claudeLike.id] }], workspaces: [] }, [claudeLike])
  await w.findAll('select')[0]!.setValue('a')
  w.getComponent(DriverOptions).vm.$emit('update:modelValue', { model: 'edited' })
  await nextTick()
  await w.get('button.ac-chip').trigger('click')
  expect(w.findAll('select')[0]!.element.value).toBe('a')
  expect(w.getComponent(DriverOptions).props('modelValue')).toEqual({ model: 'edited' })
})

it('discards pending credential file reads when the card changes from Edit to Add', async () => {
  mocks.props.value.config = { driver, account: { id: 'a', label: 'Existing', credential_kind: 'key', endpoint: { protocol: 'openai', base_url: 'https://old.example' } } }
  const w = render(DriverAccount)
  let finish: (value: string) => void = () => {}
  await w.get('.da-drop').trigger('drop', { dataTransfer: { files: [{ name: 'key.txt', size: 5, text: () => new Promise<string>(resolve => { finish = resolve }) }] } })
  reactive(mocks.props).value.config = { driver }
  await nextTick()
  finish('old secret')
  await flushPromises()
  expect(w.text()).not.toContain('key.txt loaded')
  expect(w.get('textarea').element.value).toBe('')
  expect(w.get<HTMLInputElement>('input[placeholder^="http://api.example"]').element.value).toBe('')
  expect(w.get<HTMLButtonElement>('button.da-btn').element.disabled).toBe(true)
})
