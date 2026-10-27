// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { computed, ref, watch, type Ref } from 'vue'
import type { Account, Catalog, Image, Workspace } from './api.ts'
import type { TaskConfig } from '../task-config-types.ts'
import { defaultAgent, driverDefaults, matchingImages, normalizeOptions } from './defaults.ts'
import { accountState, useRunClock } from './presentation.ts'

interface Sources {
  catalog: () => Catalog | null
  accounts: () => Account[]
  images: () => Image[]
  workspaces: () => Workspace[]
}

// Live forms reconcile vanished selections. Saved workflows retain unavailable
// ids until the user chooses a replacement.
export function useTaskTargeting(config: Ref<TaskConfig>, sources: Sources, policy: 'live' | 'saved') {
  const now = useRunClock()
  const invalidOptions = ref(0)
  const drivers = computed(() => sources.catalog()?.agents ?? [])
  const driver = computed(() => drivers.value.find(d => d.id === config.value.agent))
  const agentAccounts = computed(() => sources.accounts().filter(a => a.agent === config.value.agent && a.usable && a.enabled))
  const ready = computed(() => agentAccounts.value.filter(a => accountState(a, now.value) === 'ready'))
  const agentImages = computed(() => matchingImages(sources.images(), config.value.agent ?? ''))
  const invalidAgent = computed(() => !!config.value.agent && !driver.value)
  const invalidImage = computed(() => !agentImages.value.some(i => i.id === config.value.image_id))
  const invalidAccount = computed(() => !!config.value.account_id && !agentAccounts.value.some(a => a.id === config.value.account_id))
  const invalidWorkspace = computed(() => !!config.value.workspace_id && !sources.workspaces().some(w => w.id === config.value.workspace_id))

  function normalizeConfig(value: TaskConfig): TaskConfig {
    const selected = drivers.value.find(d => d.id === value.agent)
    if (!selected) return value
    const options = policy === 'saved' ? { ...driverDefaults(selected), ...value.options } : value.options ?? {}
    return { ...value, options: normalizeOptions(selected, options, value.unattended !== false) }
  }
  const optionValues = computed(() => normalizeConfig(config.value).options ?? {})

  function selectAgent(agent: string): TaskConfig {
    invalidOptions.value = 0
    const choices = matchingImages(sources.images(), agent)
    const selected = drivers.value.find(d => d.id === agent)
    return normalizeConfig({ ...config.value, agent, account_id: '', options: driverDefaults(selected), unattended: !!selected?.unattended,
      image_id: choices.find(i => i.id === config.value.image_id)?.id ?? choices[0]?.id ?? '' })
  }

  function initialSelection(): TaskConfig {
    const catalog = sources.catalog()
    return { ...selectAgent(catalog ? defaultAgent(catalog, sources.accounts()) : ''), workspace_id: '' }
  }

  if (policy === 'live') {
    watch([agentImages, agentAccounts, sources.workspaces], () => {
      if (invalidImage.value) config.value.image_id = agentImages.value[0]?.id ?? ''
      if (invalidAccount.value) config.value.account_id = ''
      if (invalidWorkspace.value) config.value.workspace_id = ''
    }, { immediate: true })
    watch(() => driver.value?.id, () => {
      invalidOptions.value = 0
      config.value.unattended = !!driver.value?.unattended
      config.value.options = normalizeOptions(driver.value, driverDefaults(driver.value), config.value.unattended)
    }, { immediate: true })
    watch([driver, () => config.value.unattended], () => {
      config.value.options = normalizeConfig(config.value).options
    })
  }

  return { now, driver, agentAccounts, ready, agentImages, invalidAgent, invalidImage, invalidAccount, invalidWorkspace,
    invalidOptions, optionValues, normalizeConfig, selectAgent, initialSelection }
}
