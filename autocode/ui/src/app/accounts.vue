<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { host, loadByTagName } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, accountState, errorText, principalLabels, serial, live, type Account } from './api.ts'
import { useComponentTopics } from './live.ts'
import Button from 'primevue/button'
import AppDialog from './app-dialog.vue'
import AgentPicker from './agent-picker.vue'
import { agentIcon, useRunClock } from './presentation.ts'
import AccountRow from './account-row.vue'
import { accountSubmission } from '../driver-account-types.ts'

const props = defineProps<{ query: string; selectedAgent: string }>()
const emit = defineEmits<{ count: [value: number] }>()
const adding = ref(false)
defineExpose({ open: () => { adding.value = true } })
const catalog = useRequiredCatalog()
const now = useRunClock()
const accounts = ref<Account[]>([])
const owners = ref<Record<string, string>>({})
const error = ref('')
const loaded = ref(false)
const saving = ref(false)
const saveError = ref('')
const saved = ref(0)

const agent = ref(props.selectedAgent || catalog.value.agents[0]?.id || '')
watch(() => props.selectedAgent, value => { if (value) agent.value = value })
const agentInfo = computed(() => catalog.value.agents.find((a) => a.id === agent.value))
// The driver's credential card, mounted by tag; it emits `submit`.
const card = computed(() => JSON.stringify({ driver: agentInfo.value, busy: saving.value, error: saveError.value, saved: saved.value, limits: catalog.value.account_limits }))

// Accounts grouped under the agents the catalog lists, in catalog order.
const groups = computed(() => [...catalog.value.agents, ...[...new Set(accounts.value.map(a => a.agent))]
  .filter(id => !catalog.value.agents.some(a => a.id === id))
  .map(id => ({ id, title: `Unavailable agent: ${id}`, icon: 'tabler:terminal-2' }))]
  .map((a) => ({ agent: a, accounts: accounts.value.filter((x) => x.agent === a.id && [x.label, a.title, x.credential_kind].join(' ').toLowerCase().includes(props.query.toLowerCase())) }))
  .filter((g) => g.accounts.length))

function kindLabel(a: Account) {
  return catalog.value.agents.find((x) => x.id === a.agent)?.credentials.find((c) => c.id === a.credential_kind)?.label ?? a.credential_kind
}

// Keep the ownership line for accounts shared with the caller.
async function annotate(list: Account[]) {
  const foreign = [...new Set(list.filter((a) => !a.mine).map((a) => a.owner))].filter((id) => !(id in owners.value))
  owners.value = { ...owners.value, ...await principalLabels(foreign) }
}

const refresh = serial(async () => {
  try {
    const list = await autocode.accounts()
    accounts.value = list
    await annotate(list)
    loaded.value = true
    error.value = ''
  } catch (e) {
    error.value = errorText(e, 'Could not load accounts.')
  }
})
useComponentTopics(() => accounts.value.map((a) => a.id), () => { void refresh() })
const unsubscribeRuns = live.runs(() => { void refresh() })
onUnmounted(unsubscribeRuns)
useHostVisibilityRefresh(refresh)

async function attempt(action: () => Promise<unknown>, failure: string) {
  error.value = ''
  try {
    await action()
    await refresh()
  } catch (e) {
    error.value = errorText(e, failure)
  }
}

async function submit(event: Event) {
  if (!(event instanceof CustomEvent)) return
  const decoded = accountSubmission.safeParse(event.detail)
  if (!decoded.success || saving.value) { saveError.value = 'Invalid account submission.'; return }
  const account = decoded.data
  saveError.value = ''
  saving.value = true
  try {
    await autocode.createAccount(account)
    saved.value++
    adding.value = false
    await refresh()
  } catch (e) {
    saveError.value = errorText(e, 'Could not save the account.')
  } finally {
    saving.value = false
  }
}

watch(accounts, value => emit('count', value.length))

const toggle = (a: Account) => attempt(() => autocode.updateAccount(a.id, { enabled: !a.enabled }), 'Could not update the account.')
const rename = (a: Account, label: string) => attempt(() => autocode.updateAccount(a.id, { label }), 'Could not rename the account.')

async function remove(a: Account) {
  const ok = await host.confirm({
    header: 'Delete account',
    message: `Delete account "${a.label}"? Tasks keep their history.`,
    icon: 'tabler:trash',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
  })
  if (ok) await attempt(() => autocode.deleteAccount(a.id), 'Could not delete the account.')
}

onMounted(() => {
  loadByTagName('chestor-autocode-driver-account', { timeoutMs: 8000 }).catch(() => { error.value = 'The driver account card could not load.' })
})
</script>

<template>
  <div class="ac-stack">
    <p v-if="error" class="kx-err inline">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <div v-if="!loaded && !error" class="kx-loading">Loading accounts…</div>
    <div v-if="loaded && !accounts.length" class="kx-empty">
      <div class="kx-empty-ico"><Icon icon="tabler:key" /></div><div class="kx-empty-title">No accounts yet</div>
      <div class="kx-empty-sub">Add an API key, your own endpoint or a personal subscription login.</div>
      <Button label="Add account" @click="adding = true"><template #icon><Icon icon="tabler:plus" /></template></Button>
    </div>
    <div v-else-if="loaded && !groups.length" class="kx-empty"><div class="kx-empty-title">No matches</div><div class="kx-empty-sub">Try another account or agent.</div></div>
    <section v-for="g in groups" :key="g.agent.id" class="ac-stack">
      <div class="ac-card-head"><h2 class="ac-card-title"><Icon :icon="agentIcon(g.agent.id, catalog.agents)" />{{ g.agent.title }}</h2><span class="ac-muted">{{ g.accounts.filter(a => a.usable && accountState(a, now) === 'ready').length }} of {{ g.accounts.length }} ready</span></div>
      <ul class="ac-account-grid">
        <AccountRow v-for="a in g.accounts" :key="a.id" :account="a" :kind-label="kindLabel(a)" :owner-label="owners[a.owner] || a.owner" @toggle="toggle(a)" @rename="(label: string) => rename(a, label)" @remove="remove(a)" />
      </ul>
    </section>
    <AppDialog v-if="adding" title="Add account" :busy="saving" @close="adding = false">
      <div class="ac-form"><AgentPicker :disabled="saving" v-model="agent" :agents="catalog.agents" /><p class="ac-hint">Tasks balance across your ready accounts automatically.</p><chestor-autocode-driver-account v-if="agentInfo" :config.attr="card" @submit="submit" /></div>
    </AppDialog>
  </div>
</template>
