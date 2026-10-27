<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { host, loadByTagName } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { autocode, principalLabels, type Account } from './api.ts'
import { reconcile, useComponentTopics, serial, live, useAlive } from './live.ts'
import Button from 'primevue/button'
import AppDialog from './app-dialog.vue'
import AgentPicker from './agent-picker.vue'
import { agentIcon, useRunClock, accountState, errorText } from './presentation.ts'
import AccountRow from './account-row.vue'
import { accountSubmission } from '../driver-account-types.ts'

const alive = useAlive()
const topicIds = ref<string[]>([])
const props = defineProps<{ query: string; selectedAgent: string }>()
const emit = defineEmits<{ count: [value: number] }>()
const adding = ref(false)
const editing = ref<Account | null>(null)
function open() { editing.value = null; saveError.value = ''; adding.value = true }
function edit(account: Account) {
  editing.value = account
  agent.value = account.agent
  saveError.value = ''
  adding.value = true
}
defineExpose({ open })
const catalog = useRequiredCatalog()
const now = useRunClock()
const accounts = ref<Account[]>([])
const owners = ref<Record<string, string>>({})
const error = ref('')
const warning = ref('')
const loaded = ref(false)
const saving = ref(false)
const saveError = ref('')
const saved = ref(0)

const agent = ref(props.selectedAgent || catalog.value.agents[0]?.id || '')
watch(() => props.selectedAgent, value => { if (value) agent.value = value })
const agentInfo = computed(() => catalog.value.agents.find((a) => a.id === agent.value))
// The driver's credential card, mounted by tag; it emits `submit`.
const card = computed(() => JSON.stringify({ driver: agentInfo.value, busy: saving.value, error: saveError.value, saved: saved.value, account: editing.value ? { id: editing.value.id, label: editing.value.label, credential_kind: editing.value.credential_kind, endpoint: editing.value.endpoint } : undefined, limits: catalog.value.account_limits }))

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
  const labels = await principalLabels(foreign)
  if (alive()) owners.value = { ...owners.value, ...labels }
}

const refresh = serial(async () => {
  try {
    const list = await reconcile(autocode.accounts, list => list.map(a => a.id), topicIds, alive)
    if (!alive()) return
    accounts.value = list
    await annotate(list)
    if (!alive()) return
    loaded.value = true
    error.value = ''
  } catch (e) {
    if (alive()) error.value = errorText(e, 'Could not load accounts.')
  }
}, alive)
useComponentTopics(() => topicIds.value, () => { void refresh() })
const unsubscribeRuns = live.runs(() => { void refresh() })
onUnmounted(unsubscribeRuns)
useHostVisibilityRefresh(refresh)

async function attempt(action: () => Promise<unknown>, failure: string) {
  error.value = ''
  warning.value = ''
  try {
    await action()
    if (!alive()) return
    await refresh()
  } catch (e) {
    if (alive()) error.value = errorText(e, failure)
  }
}

async function submit(event: Event) {
  if (!(event instanceof CustomEvent)) return
  const decoded = accountSubmission.safeParse(event.detail)
  if (saving.value) return
  if (!decoded.success || decoded.data.agent !== agent.value || (editing.value && !editing.value.writable)) { saveError.value = 'Invalid account submission.'; return }
  const account = decoded.data
  saveError.value = ''
  saving.value = true
  try {
    if (editing.value) {
      const updated = await autocode.updateAccount(editing.value.id, {
        label: account.label, endpoint: account.endpoint ?? { base_url: '' },
        ...(account.secret ? { secret: account.secret } : {}),
      })
      if (!alive()) return
      warning.value = updated.health_error ? `Account saved, but its health could not be refreshed: ${updated.health_error.message}` : ''
    } else await autocode.createAccount(account)
    if (!alive()) return
    saved.value++
    adding.value = false
    await refresh()
  } catch (e) {
    if (alive()) saveError.value = errorText(e, 'Could not save the account.')
  } finally {
    if (alive()) saving.value = false
  }
}

watch(accounts, value => emit('count', value.length))

const update = (a: Account, body: { label?: string; enabled?: boolean }, failure: string) => attempt(async () => {
  const saved = await autocode.updateAccount(a.id, body)
  if (!alive()) return
  if (saved.health_error) warning.value = `Account saved, but its health could not be refreshed: ${saved.health_error.message}`
}, failure)
const toggle = (a: Account) => update(a, { enabled: !a.enabled }, 'Could not update the account.')
const rename = (a: Account, label: string) => update(a, { label }, 'Could not rename the account.')

async function remove(a: Account) {
  const ok = await host.confirm({
    header: 'Delete account',
    message: `Delete account "${a.label}"? Tasks keep their history.`,
    icon: 'tabler:trash',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
  })
  if (alive() && ok) await attempt(() => autocode.deleteAccount(a.id), 'Could not delete the account.')
}

onMounted(() => {
  loadByTagName('chestor-autocode-driver-account', { timeoutMs: 8000 }).catch(() => { if (alive()) error.value = 'The driver account card could not load.' })
})
</script>

<template>
  <div class="ac-stack">
    <p v-if="error" class="kx-err inline">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <p v-if="warning" class="kx-err inline" role="status">{{ warning }}</p>
    <div v-if="!loaded && !error" class="kx-loading">Loading accounts…</div>
    <div v-if="loaded && !accounts.length" class="kx-empty">
      <div class="kx-empty-ico"><Icon icon="tabler:key" /></div><div class="kx-empty-title">No accounts yet</div>
      <div class="kx-empty-sub">Add an API key, your own endpoint or a personal subscription login.</div>
      <Button label="Add account" @click="open"><template #icon><Icon icon="tabler:plus" /></template></Button>
    </div>
    <div v-else-if="loaded && !groups.length" class="kx-empty"><div class="kx-empty-title">No matches</div><div class="kx-empty-sub">Try another account or agent.</div></div>
    <section v-for="g in groups" :key="g.agent.id" class="ac-stack">
      <div class="ac-card-head"><h2 class="ac-card-title"><Icon :icon="agentIcon(g.agent.id, catalog.agents)" />{{ g.agent.title }}</h2><span class="ac-muted">{{ g.accounts.filter(a => a.usable && accountState(a, now) === 'ready').length }} of {{ g.accounts.length }} ready</span></div>
      <ul class="ac-account-grid">
        <AccountRow v-for="a in g.accounts" :key="a.id" :account="a" :kind-label="kindLabel(a)" :owner-label="owners[a.owner] || a.owner" @edit="edit(a)" @toggle="toggle(a)" @rename="(label: string) => rename(a, label)" @remove="remove(a)" />
      </ul>
    </section>
    <AppDialog v-if="adding" :title="editing ? 'Edit account' : 'Add account'" :busy="saving" @close="adding = false">
      <div class="ac-form"><AgentPicker v-if="!editing" :disabled="saving" v-model="agent" :agents="catalog.agents" /><p v-if="!editing" class="ac-hint">Tasks balance across your ready accounts automatically.</p><chestor-autocode-driver-account v-if="agentInfo" :config.attr="card" @submit="submit" /><p v-else class="kx-err" role="alert">This account’s agent is unavailable.</p></div>
    </AppDialog>
  </div>
</template>
