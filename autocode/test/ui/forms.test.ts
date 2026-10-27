// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, driver, option, render, respond, normal } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
import DriverOptions from '../../ui/src/app/driver-options.vue'
import TaskConfig from '../../ui/src/app/task-config.vue'
import DriverAccount from '../../ui/src/app/driver-account.vue'
import { driverDefaults } from '../../ui/src/app/defaults.ts'

describe('option drafts', () => {
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
    mocks.get.mockImplementation(async path => ({ data: { success: true, ...respond(path), ...(path.endsWith('/drivers') ? { drivers: [{ ...driver, options: [option] }] } : {}) } }))
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

