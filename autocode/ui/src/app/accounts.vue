<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { defineComponent, h, ref, computed, onMounted, watch, onUnmounted, type Component } from 'vue'
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
import Message from 'primevue/message'
import { providerProduct } from './account-health.ts'
import { accountSubmission } from '../driver-account-types.ts'

const alive = useAlive()
const topicIds = ref<string[]>([])
const props = withDefaults(defineProps<{
  query: string
  selectedAgent: string
  management?: boolean
  providerId?: string
  allowSetup?: boolean
  provider?: 'claude' | 'codex'
}>(), { allowSetup: true })
defineSlots<{
  guide(): unknown
  usage(props: { account: Account }): unknown
  setup(props: { account?: Account; labelBytes?: number; busy: (busy: boolean) => void; saved: () => void; credential: Component }): unknown
}>()
const emit = defineEmits<{ count: [value: number]; changed: [] }>()
const adding = ref(false)
const providerName = computed(() => agentInfo.value?.title)
const dialogTitle = computed(() => props.management && providerName.value
  ? editing.value ? `Edit ${providerName.value} account` : `Add ${providerName.value} account`
  : editing.value ? 'Edit account' : 'Add account')
const editing = ref<Account | null>(null)
function open() { editing.value = null; saveError.value = ''; setupResult.value = ''; adding.value = true }
function edit(account: Account) {
  editing.value = account
  setupResult.value = ''
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
const credentialError = ref('')
const credentialLoading = ref(false)
const saving = ref(false)
const signingIn = ref(false)
const setupResult = ref('')
const saveError = ref('')
const saved = ref(0)

const agent = ref(props.selectedAgent || catalog.value.agents[0]?.id || '')
watch(() => props.selectedAgent, value => { if (value) agent.value = value })
const agentInfo = computed(() => {
  const info = catalog.value.agents.find(a => a.id === agent.value)
  if (!info || !props.management) return info
  return { ...info, title: providerProduct(info.id, info.title).name, credentials: info.credentials.map(credential => ({
    ...credential, ...credentialCopy(credential),
  })) }
})
// The driver's credential card, mounted by tag; it emits `submit`.
const card = computed(() => JSON.stringify({ driver: agentInfo.value, busy: saving.value, error: saveError.value, saved: saved.value, guided: props.management, initialKind: props.provider === 'claude' ? 'env:CLAUDE_CODE_OAUTH_TOKEN' : undefined, account: editing.value ? { id: editing.value.id, label: editing.value.label, credential_kind: editing.value.credential_kind, endpoint: editing.value.endpoint } : undefined, limits: catalog.value.account_limits }))

// Accounts grouped under the agents the catalog lists, in catalog order.
const groups = computed(() => [...catalog.value.agents, ...[...new Set(accounts.value.map(a => a.agent))]
  .filter(id => !catalog.value.agents.some(a => a.id === id))
  .map(id => ({ id, title: `Unavailable agent: ${id}`, icon: 'tabler:terminal-2' }))]
  .map((a) => ({ agent: a, accounts: accounts.value.filter((x) => x.agent === a.id && [x.label, a.title, x.credential_kind].join(' ').toLowerCase().includes(props.query.toLowerCase())) }))
  .filter((g) => g.accounts.length))

const keyIssuers: Record<string, string> = {
  ANTHROPIC: 'Anthropic', CODEX: 'OpenAI', DEEPSEEK: 'DeepSeek', GEMINI: 'Gemini', GROQ: 'Groq',
  META: 'Meta', MISTRAL: 'Mistral', OPENAI: 'OpenAI', OPENROUTER: 'OpenRouter', XAI: 'xAI',
}

function credentialCopy(credential: { id: string; label: string; hint?: string; file?: string; subscription?: boolean }) {
  if (!props.management) return { label: credential.label, hint: credential.hint }
  if (credential.file) return { label: 'CLI login file', hint: credential.hint }
  if (credential.subscription) return { label: 'Subscription token', hint: 'Paste the subscription token from the provider.' }
  const prefix = credential.id.match(/^env:([A-Z]+)_API_KEY$/)?.[1]
  const issuer = prefix && keyIssuers[prefix]
  return { label: issuer ? `${issuer} API key` : credential.label, hint: 'Paste the key generated in the provider dashboard.' }
}

function kindLabel(a: Account) {
  const credential = catalog.value.agents.find(x => x.id === a.agent)?.credentials.find(c => c.id === a.credential_kind)
  return credential ? credentialCopy(credential).label : props.management ? 'Saved credential' : a.credential_kind
}

const nativeReconnect = (a: Account) => props.provider === 'codex' && a.mine && a.credential_kind === 'file:.codex/auth.json'
const credentialEditor = defineComponent({
  name: 'CredentialEditor',
  setup: () => () => h('chestor-autocode-driver-account', { config: card.value, onSubmit: submit }),
})
function signInBusy(value: boolean) { signingIn.value = value }
async function signedIn() {
  setupResult.value = 'The Codex account is ready to run tasks.'
  await refresh()
  if (alive()) emit('changed')
}

// Keep the ownership line for accounts shared with the caller.
async function annotate(list: Account[]) {
  const foreign = [...new Set(list.filter((a) => !a.mine).map((a) => a.owner_user_id))].filter((id) => !(id in owners.value))
  const labels = await principalLabels(foreign)
  if (alive()) owners.value = { ...owners.value, ...labels }
}

async function fetchAccounts() {
  if (!props.management) return autocode.accounts()
  const filter = props.providerId ? { provider_id: props.providerId } : { agent: props.selectedAgent }
  const result = await autocode.managedAccounts(filter)
  if (alive() && result.agent) agent.value = result.agent
  return result.accounts
}

const refresh = serial(async () => {
  try {
    const list = await reconcile(fetchAccounts, list => list.map(a => a.id), topicIds, alive, list => {
      accounts.value = list
      loaded.value = true
      error.value = ''
    }, () => { void refresh() })
    if (!alive()) return
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
    if (alive()) emit('changed')
  } catch (e) {
    if (alive()) error.value = errorText(e, failure)
  }
}

async function submit(event: Event) {
  if (!(event instanceof CustomEvent)) return
  const decoded = accountSubmission.safeParse(event.detail)
  if (saving.value) return
  if (!decoded.success || decoded.data.agent !== agent.value || (editing.value && (!editing.value.writable || decoded.data.credential_kind !== editing.value.credential_kind))) { saveError.value = 'Invalid account submission.'; return }
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
    } else if (props.management) {
      const connected = await autocode.connectAccount(account)
      if (alive()) setupResult.value = connected.checked
        ? 'The provider accepted the credential. Your account is ready to run tasks.'
        : 'Credential saved. Run a task to confirm this account can connect to the provider.'
    } else await autocode.createAccount(account)
    if (!alive()) return
    saved.value++
    if (!props.management || editing.value) adding.value = false
    await refresh()
    if (alive()) emit('changed')
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

async function loadCredentialEditor() {
  if (!props.allowSetup) return
  credentialLoading.value = true
  credentialError.value = ''
  try {
    await loadByTagName('chestor-autocode-driver-account', { timeoutMs: 8000 })
  } catch {
    if (alive()) credentialError.value = 'The credential form could not load.'
  } finally {
    if (alive()) credentialLoading.value = false
  }
}
onMounted(loadCredentialEditor)
</script>

<template>
  <div class="ac-stack">
    <p v-if="error" class="kx-err inline">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <p v-if="warning" class="kx-err inline" role="status">{{ warning }}</p>
    <div v-if="!loaded && !error" class="kx-loading">Loading accounts…</div>
    <div v-if="management && loaded && allowSetup" class="ac-card-head ac-provider-actions">
      <p v-if="!accounts.length" class="ac-hint">Add an account to let tasks use this provider.</p>
      <Button label="Add account" :disabled="!agentInfo" @click="open"><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button>
    </div>
    <div v-if="!management && loaded && !accounts.length" class="kx-empty">
      <div class="kx-empty-ico"><Icon icon="tabler:key" /></div><div class="kx-empty-title">No accounts yet</div>
      <div class="kx-empty-sub">Add an API key, your own endpoint or a personal subscription login.</div>
      <Button label="Add account" @click="open"><template #icon><Icon icon="tabler:plus" /></template></Button>
    </div>
    <div v-else-if="!management && loaded && !groups.length" class="kx-empty"><div class="kx-empty-title">No matches</div><div class="kx-empty-sub">Try another account or agent.</div></div>
    <section v-for="g in groups" :key="g.agent.id" class="ac-stack">
      <div v-if="!management" class="ac-card-head"><h2 class="ac-card-title"><Icon :icon="agentIcon(g.agent.id, catalog.agents)" />{{ g.agent.title }}</h2><span class="ac-muted">{{ g.accounts.filter(a => a.usable && accountState(a, now) === 'ready').length }} of {{ g.accounts.length }} ready</span></div>
      <ul class="ac-account-grid">
        <AccountRow v-for="a in g.accounts" :key="a.id" :account="a" :kind-label="kindLabel(a)" :owner-label="owners[a.owner_user_id] || a.owner_user_id" :management="management" :edit-credentials="allowSetup" :native-reconnect="nativeReconnect(a)" @edit="edit(a)" @toggle="toggle(a)"
          @rename="(label: string) => rename(a, label)" @remove="remove(a)">
          <template v-if="$slots.usage" #usage="scope"><slot name="usage" v-bind="scope" /></template>
        </AccountRow>
      </ul>
    </section>
    <AppDialog v-if="adding" :title="dialogTitle" :busy="saving || signingIn" :icon="management ? agentInfo?.icon : undefined" @close="adding = false">
      <div class="ac-form">
        <p v-if="credentialLoading" class="kx-loading" role="status">Loading the credential form…</p>
        <p v-else-if="credentialError" class="kx-err" role="alert">{{ credentialError }}
          <Button label="Retry" severity="secondary" text size="small" @click="loadCredentialEditor" />
        </p>
        <template v-if="setupResult">
          <Message severity="success" :closable="false" role="status">{{ setupResult }}</Message>
          <div class="ac-setup-actions"><Button label="Done" @click="adding = false" /></div>
        </template>
        <template v-else-if="management && (!editing || nativeReconnect(editing))">
          <slot name="setup" :account="editing ?? undefined" :labelBytes="catalog.account_limits?.label_bytes"
            :busy="signInBusy" :saved="signedIn" :credential="credentialEditor">
            <slot name="guide">
              <p class="ac-hint">Add a credential from the provider dashboard or from the CLI on a machine that is already signed in.</p>
            </slot>
            <component v-if="agentInfo && !credentialError && !credentialLoading" :is="credentialEditor" />
          </slot>
        </template>
        <template v-else>
          <AgentPicker v-if="!editing && !management" :disabled="saving" v-model="agent" :agents="catalog.agents" />
          <p v-if="!editing && !management" class="ac-hint">Tasks balance across your ready accounts automatically.</p>
          <component v-if="agentInfo && !credentialError && !credentialLoading" :is="credentialEditor" />
          <p v-else-if="!agentInfo" class="kx-err" role="alert">Install this account’s agent to edit its credential.</p>
        </template>
      </div>
    </AppDialog>
  </div>
</template>
