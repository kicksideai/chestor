<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode } from './api.ts'
import type { Account, AccountProvider } from './dto.ts'
import { serial, useAlive } from './live.ts'
import { errorText, useRunClock } from './presentation.ts'
import { accountHealth, providerProduct } from './account-health.ts'
import AccountProviderMount from './account-provider-mount.vue'
import AccountList from './accounts.vue'
import PageHead from './page-head.vue'
import ProviderChoice from './provider-choice.vue'

const props = withDefaults(defineProps<{ active?: boolean }>(), { active: true })
const emit = defineEmits<{ status: [value: string] }>()
const providers = ref<AccountProvider[]>([])
const accounts = ref<Account[]>([])
const selected = ref('')
const loaded = ref(false)
const error = ref('')
const detailHeading = ref<HTMLElement>()
let previousChoice: HTMLElement | undefined
const now = useRunClock()
const alive = useAlive()
const groups = computed(() => {
  const byAgent = new Map<string, Account[]>()
  for (const account of accounts.value) {
    const list = byAgent.get(account.agent) ?? []
    list.push(account)
    byAgent.set(account.agent, list)
  }
  return byAgent
})
const choices = computed(() => {
  const available = new Set(providers.value.map(provider => provider.agent))
  return [...providers.value, ...Array.from(groups.value.keys()).filter(agent => !available.has(agent))
    .map(agent => ({ agent, title: agent, provider_id: agent, icon: 'tabler:terminal-off', create_ui_id: undefined }))]
    .map(provider => {
      const list = groups.value.get(provider.agent) ?? []
      const health = list.map(account => accountHealth(account, now.value))
      const ready = health.filter(state => state.state === 'ready').length
      const limited = health.find(state => state.state === 'cooling')
      const product = providerProduct(provider.agent, provider.title)
      const rank = provider.agent === 'codex' ? 0 : provider.agent === 'claude' ? 1 : 2
      const installed = available.has(provider.agent)
      const status = !installed ? 'Provider unavailable' : ready ? 'Ready' : limited ? limited.label : list.length ? 'Needs attention' : 'Not set up'
      const severity = ready ? 'success' : limited ? 'warn' : list.length ? 'danger' : 'secondary'
      return { ...provider, ...product, rank, status, ready, total: list.length, installed,
        severity: severity as 'success' | 'warn' | 'danger' | 'secondary' }
    })
    .sort((a, b) => Number(!!b.total) - Number(!!a.total) || a.rank - b.rank || a.name.localeCompare(b.name))
})
const preferred = computed(() => choices.value.filter(provider => provider.total || provider.rank < 2))
const more = computed(() => choices.value.filter(provider => !provider.total && provider.rank === 2))
const current = computed(() => choices.value.find(provider => provider.provider_id === selected.value))

watch(() => props.active, active => { if (!active) selected.value = '' })
watch(() => {
  if (!loaded.value) return undefined
  if (!accounts.value.length) return 'No accounts'
  const ready = accounts.value.filter(account => accountHealth(account, now.value).state === 'ready').length
  return `${ready} of ${accounts.value.length} ready`
}, value => { if (value !== undefined) emit('status', value) })

async function choose(id: string, event: MouseEvent) {
  if (event.currentTarget instanceof HTMLElement) previousChoice = event.currentTarget
  selected.value = id
  await nextTick()
  detailHeading.value?.focus()
}
async function back() {
  selected.value = ''
  await nextTick()
  previousChoice?.focus()
}

const load = serial(async () => {
  try {
    const result = await autocode.managedAccounts()
    if (!alive()) return
    providers.value = result.providers
    accounts.value = result.accounts
    loaded.value = true
    error.value = ''
  } catch (cause) {
    if (alive()) error.value = errorText(cause, 'Could not load account providers.')
  }
}, alive)
useHostVisibilityRefresh(load)
</script>

<template>
  <section class="ac-stack ac-provider-page" aria-label="Accounts">
    <p v-if="!loaded && !error" class="kx-loading" role="status">Loading account providers…</p>
    <p v-if="error" class="kx-err inline" role="alert">{{ error }} <Button label="Retry" severity="secondary" text size="small" @click="load" /></p>
    <div v-if="current" class="ac-stack">
      <div>
        <Button label="All providers" text severity="secondary" size="small" @click="back">
          <template #icon><Icon icon="tabler:arrow-left" aria-hidden="true" /></template>
        </Button>
      </div>
      <div ref="detailHeading" tabindex="-1">
        <PageHead :title="current.name" :subtitle="current.hint" :icon="current.icon || 'tabler:key'" />
      </div>
      <AccountProviderMount v-if="current.create_ui_id" :key="current.provider_id"
        :tag="current.create_ui_id" :provider-id="current.provider_id" @changed="load" />
      <template v-else>
        <p class="ac-hint">{{ current.installed ? 'This provider does not offer account setup.' : 'This provider is unavailable. You can still manage its existing accounts.' }}</p>
        <AccountList v-if="current.total" :key="current.agent" query="" :selected-agent="current.agent"
          management :allow-setup="false" @changed="load" />
      </template>
    </div>
    <div v-if="loaded" v-show="!current" class="ac-stack">
      <PageHead title="Accounts" subtitle="Connect a provider to run tasks, see usage, and manage access." icon="tabler:key" />
      <p v-if="!choices.length" class="ac-muted">No Autocode providers are installed.</p>
      <nav v-else aria-label="Account providers" class="ac-stack">
        <div v-if="preferred.length" class="ac-provider-grid">
          <ProviderChoice v-for="provider in preferred" :key="provider.provider_id" :data-account-provider="provider.provider_id"
            :title="provider.name" :hint="provider.hint" :icon="provider.icon || 'tabler:terminal-2'"
            :status="provider.status" :severity="provider.severity" :count="provider.total ? `${provider.ready} of ${provider.total} ready` : undefined"
            @click="choose(provider.provider_id, $event)" />
        </div>
        <details v-if="more.length" class="ac-more-providers" :open="!preferred.length || undefined">
          <summary class="kx-focus-outline">More providers <span class="ac-muted">{{ more.length }}</span></summary>
          <div class="ac-provider-grid">
            <ProviderChoice v-for="provider in more" :key="provider.provider_id" :data-account-provider="provider.provider_id"
              :title="provider.name" :hint="provider.hint" :icon="provider.icon || 'tabler:terminal-2'"
              :status="provider.status" :severity="provider.severity" @click="choose(provider.provider_id, $event)" />
          </div>
        </details>
      </nav>
    </div>
  </section>
</template>
