// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { computed, ref, watch, type Ref } from 'vue'
import type { Account, Catalog, Image, Workspace, Profile } from './api.ts'
import type { TaskConfig } from '../task-config-types.ts'
import { defaultAgent, matchingImages } from './defaults.ts'
import { accountState, useRunClock } from './presentation.ts'

interface Sources {
  catalog: () => Catalog | null
  accounts: () => Account[]
  images: () => Image[]
  workspaces: () => Workspace[]
}

export function effectiveTask(config: TaskConfig, profile?: Profile): TaskConfig {
  if (!profile) return config
  return { tools: profile.tools, isolation: profile.isolation, agent: profile.agent, account_id: profile.account_id,
    account_pool: profile.account_pool, endpoint: profile.endpoint, image_id: profile.image_id, workspace_id: profile.workspace_id,
    repo_url: profile.repo_url, repo_ref: profile.repo_ref, run_timeout: profile.run_timeout, unattended: profile.unattended,
    ...Object.fromEntries(Object.entries(config).filter(([, value]) => value !== undefined)) }
}

// Live forms reconcile vanished selections. Saved workflows retain unavailable
// ids until the user chooses a replacement.
export function useTaskTargeting(config: Ref<TaskConfig>, sources: Sources, policy: 'live' | 'saved', inherited: () => boolean = () => false) {
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

  const optionValues = computed(() => config.value.options ?? {})

  function selectAgent(agent: string): TaskConfig {
    invalidOptions.value = 0
    const choices = matchingImages(sources.images(), agent)
    const selected = drivers.value.find(d => d.id === agent)
    return { ...config.value, agent, account_id: '', options: {}, unattended: !!selected?.unattended,
      image_id: choices.find(i => i.id === config.value.image_id)?.id ?? choices[0]?.id ?? '' }
  }

  function initialSelection(): TaskConfig {
    const catalog = sources.catalog()
    return { ...selectAgent(catalog ? defaultAgent(catalog, sources.accounts()) : ''), workspace_id: '' }
  }

  if (policy === 'live') {
    watch([agentImages, agentAccounts, sources.workspaces], () => {
      if (inherited()) return
      if (invalidImage.value) config.value.image_id = agentImages.value[0]?.id ?? ''
      if (invalidAccount.value) config.value.account_id = ''
      if (invalidWorkspace.value) config.value.workspace_id = ''
    }, { immediate: true })
    watch(() => driver.value?.id, () => { invalidOptions.value = 0 })
  }

  return { now, driver, agentAccounts, ready, agentImages, invalidAgent, invalidImage, invalidAccount, invalidWorkspace,
    invalidOptions, optionValues, selectAgent, initialSelection }
}
