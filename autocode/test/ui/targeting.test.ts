// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { account, catalog, claudeLike, image, render } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { useTaskTargeting } from '../../ui/src/app/task-targeting.ts'
import type { TaskConfig } from '../../ui/src/task-config-types.ts'

describe('shared task targeting', () => {
  function targeting(policy: 'live' | 'saved') {
    const config = ref<TaskConfig>({ agent: claudeLike.id, account_id: 'a', image_id: 'i', workspace_id: 'w', repo_url: 'https://example/repo', options: { model: 'custom', permission_mode: 'manual' }, unattended: true })
    const accounts = ref([{ ...account, agent: claudeLike.id, usable: true }])
    const images = ref([{ ...image, agents: [claudeLike.id, 'other'] }])
    const workspaces = ref([{ id: 'w', name: 'Workspace', writable: true, deletable: false, shareable: false }])
    let targets!: ReturnType<typeof useTaskTargeting>
    render(defineComponent({ setup() {
      targets = useTaskTargeting(config, { catalog: () => ({ ...catalog, agents: [claudeLike, { ...claudeLike, id: 'other' }] }), accounts: () => accounts.value, images: () => images.value, workspaces: () => workspaces.value }, policy)
      return () => null
    } }))
    return { config, accounts, images, workspaces, targets }
  }
  it.each(['live', 'saved'] as const)('keeps compatibility and driver option rules in %s mode', async policy => {
    const { targets, config, accounts } = targeting(policy)
    expect(targets.agentAccounts.value.map(a => a.id)).toEqual(['a'])
    expect(targets.agentImages.value.map(i => i.id)).toEqual(['i'])
    expect(targets.optionValues.value).toEqual({ model: policy === 'live' ? 'sonnet' : 'custom' })
    accounts.value = [{ ...accounts.value[0]!, enabled: false }]
    await nextTick()
    expect(targets.ready.value).toEqual([])
    const next = targets.selectAgent('other')
    expect(next).toMatchObject({ agent: 'other', account_id: '', image_id: 'i', options: { model: 'sonnet' }, unattended: true })
    expect(next.workspace_id).toBe('w')
    expect(next.repo_url).toBe(config.value.repo_url)
  })
  it.each(['live', 'saved'] as const)('keeps usable refreshing and failed images selectable in %s mode', async policy => {
    const { targets, images, config } = targeting(policy)
    for (const status of ['preparing', 'failed']) {
      images.value = [{ ...images.value[0]!, status, usable: true }]
      await nextTick()
      expect(targets.agentImages.value.map(i => i.id)).toEqual(['i'])
      expect(targets.invalidImage.value).toBe(false)
      expect(config.value.image_id).toBe('i')
    }
    images.value = [{ ...images.value[0]!, status: 'ready', usable: false }]
    await nextTick()
    expect(targets.agentImages.value).toEqual([])
  })
  it('reconciles vanished live targets while preserving repository settings', async () => {
    const { targets, config, images, workspaces } = targeting('live')
    images.value = []
    workspaces.value = []
    await nextTick()
    expect(config.value.image_id).toBe('')
    expect(config.value.workspace_id).toBe('')
    expect(config.value.repo_url).toBe('https://example/repo')
    expect(targets.invalidImage.value).toBe(true)
  })
  it('preserves unavailable saved targets and reports them for explicit replacement', async () => {
    const { targets, config, accounts, images, workspaces } = targeting('saved')
    accounts.value = []
    images.value = []
    workspaces.value = []
    await nextTick()
    expect(config.value).toMatchObject({ account_id: 'a', image_id: 'i', workspace_id: 'w' })
    expect(targets.invalidAccount.value).toBe(true)
    expect(targets.invalidImage.value).toBe(true)
    expect(targets.invalidWorkspace.value).toBe(true)
  })
})
