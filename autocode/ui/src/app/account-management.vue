<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode } from './api.ts'
import type { Account, AccountProvider } from './dto.ts'
import { serial, useAlive } from './live.ts'
import { accountState, errorText, useRunClock } from './presentation.ts'
import AccountProviderMount from './account-provider-mount.vue'
import AccountList from './accounts.vue'

const providers = ref<AccountProvider[]>([])
const accounts = ref<Account[]>([])
const selected = ref('')
const loaded = ref(false)
const error = ref('')
const now = useRunClock()
const alive = useAlive()
const active = computed(() => providers.value.find(provider => provider.provider_id === selected.value))
const inactive = computed(() => {
  const available = new Set(providers.value.map(provider => provider.agent))
  return [...new Set(accounts.value.map(account => account.agent).filter(agent => !available.has(agent)))]
})
const summaries = computed(() => {
  const counts = new Map<string, { total: number; ready: number }>()
  for (const account of accounts.value) {
    const count = counts.get(account.agent) ?? { total: 0, ready: 0 }
    count.total++
    if (accountState(account, now.value) === 'ready') count.ready++
    counts.set(account.agent, count)
  }
  return counts
})
function status(provider: AccountProvider) {
  const count = summaries.value.get(provider.agent)
  if (!count) return provider.create_ui_id ? 'Set up an account' : 'Setup unavailable'
  return `${count.ready} of ${count.total} ready`
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
  <section class="ac-stack" aria-labelledby="ac-accounts-title">
    <header>
      <h2 id="ac-accounts-title" class="ac-card-title">Accounts</h2>
      <p class="ac-hint">Choose a provider to add an account, check its usage or manage access.</p>
    </header>
    <p v-if="!loaded && !error" class="kx-loading" role="status">Loading account providers…</p>
    <p v-if="error" class="kx-err" role="alert">{{ error }} <Button label="Retry" severity="secondary" text size="small" @click="load" /></p>
    <p v-if="loaded && !providers.length && !inactive.length" class="ac-muted">No Autocode providers are installed.</p>
    <div v-if="providers.length || inactive.length" class="ac-provider-layout">
      <nav aria-label="Account providers" class="ac-provider-list">
        <button v-for="provider in providers" :key="provider.provider_id" type="button" class="ac-provider-choice kx-focus-halo"
          :aria-pressed="selected === provider.provider_id" @click="selected = provider.provider_id">
          <Icon :icon="provider.icon || 'tabler:terminal-2'" aria-hidden="true" />
          <span><strong>{{ provider.title }}</strong><span class="ac-muted">{{ status(provider) }}</span></span>
        </button>
        <button v-for="agent in inactive" :key="agent" type="button" class="ac-provider-choice kx-focus-halo"
          :aria-pressed="selected === agent" @click="selected = agent">
          <Icon icon="tabler:terminal-off" aria-hidden="true" /><span><strong>{{ agent }}</strong><span class="ac-muted">Provider unavailable</span></span>
        </button>
      </nav>
      <div v-if="active" class="ac-card ac-provider-detail">
        <h3 class="ac-card-title">{{ active.title }}</h3>
        <AccountProviderMount v-if="active.create_ui_id" :key="active.provider_id"
          :tag="active.create_ui_id" :provider-id="active.provider_id" @changed="load" />
        <template v-else>
          <p class="ac-hint">This provider hasn't supplied an account setup component.</p>
          <AccountList v-if="summaries.has(active.agent)" :key="active.agent" query="" :selected-agent="active.agent"
            management :allow-setup="false" @changed="load" />
        </template>
      </div>
      <div v-else-if="inactive.includes(selected)" class="ac-card ac-provider-detail">
        <h3 class="ac-card-title">{{ selected }}</h3>
        <p class="ac-hint">This provider is unavailable. You can still manage its existing accounts.</p>
        <AccountList :key="selected" query="" :selected-agent="selected" management :allow-setup="false" @changed="load" />
      </div>
      <div v-else class="ac-card ac-provider-detail">
        <h3 class="ac-card-title">Choose a provider</h3>
        <p class="ac-hint">Each provider shows whether its accounts are ready to run tasks.</p>
      </div>
    </div>
  </section>
</template>
