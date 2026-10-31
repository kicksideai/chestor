// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import './fixtures.ts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AppDialog from '../../ui/src/app/app-dialog.vue'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()); vi.restoreAllMocks() })
describe('shadow root dialogs', () => {
  it('opens a native modal with an accessible name and closes it on unmount', async () => {
    const show = vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function(this: HTMLDialogElement) { this.open = true })
    const close = vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function(this: HTMLDialogElement) { this.open = false })
    const w = mount(AppDialog, { props: { title: 'Task' }, slots: { default: '<input autofocus />' } })
    wrappers.push(w)
    await flushPromises()
    expect(show).toHaveBeenCalledOnce()
    expect(w.get('dialog').attributes('aria-label')).toBe('Task')
    expect(w.find('input[autofocus]').exists()).toBe(true)
    w.unmount()
    expect(close).toHaveBeenCalledOnce()
    wrappers.pop()
  })
  it('observes native close events', async () => {
    vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function(this: HTMLDialogElement) { this.open = true })
    vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function(this: HTMLDialogElement) { this.open = false })
    const w = mount(AppDialog, { props: { title: 'Task', busy: true } })
    wrappers.push(w)
    await flushPromises()
    await w.get('dialog').trigger('close')
    expect(w.emitted('close')).toBeUndefined()
    await w.setProps({ busy: false })
    await w.get('dialog').trigger('close')
    expect(w.emitted('close')).toHaveLength(1)
  })
  it('prevents native cancel and close-button dismissal while busy', async () => {
    vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function(this: HTMLDialogElement) { this.open = true })
    vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function(this: HTMLDialogElement) { this.open = false })
    const w = mount(AppDialog, { props: { title: 'Task', busy: true } })
    wrappers.push(w)
    await flushPromises()
    const event = new Event('cancel', { cancelable: true })
    w.get('dialog').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    expect(w.emitted('close')).toBeUndefined()
    expect(w.get<HTMLButtonElement>('[aria-label="Close dialog"]').element.disabled).toBe(true)
    await w.setProps({ busy: false })
    await w.get('dialog').trigger('cancel')
    expect(w.emitted('close')).toHaveLength(1)
  })
})
