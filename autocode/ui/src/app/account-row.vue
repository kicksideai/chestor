<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import Menu from 'primevue/menu'
import Tag from 'primevue/tag'
import type { MenuItem } from 'primevue/menuitem'
import ShareControl from './share-control.vue'
import AccountUsage from './account-usage.vue'
import { accountHealth } from './account-health.ts'
import { type Account } from './api.ts'
import { relativeTime, useRunClock, accountState, shortTime } from './presentation.ts'

// One account in its agent's list, with ownership and editable actions.
const props = withDefaults(defineProps<{ account: Account; kindLabel: string; ownerLabel: string; management?: boolean; editCredentials?: boolean; nativeReconnect?: boolean }>(), { editCredentials: true })
const emit = defineEmits<{ toggle: []; rename: [label: string]; remove: []; edit: [] }>()

const STATE_LABEL = { ready: 'ready', cooling: 'cooling down', disabled: 'disabled', unavailable: 'unavailable' } as const
const now = useRunClock()
const state = computed(() => accountState(props.account, now.value))
const health = computed(() => accountHealth(props.account, now.value))
const severity = computed(() => ({ ready: 'success', cooling: 'warn', disabled: 'secondary', unavailable: 'warn', failed: 'danger' })[health.value.state])
const actions = ref<InstanceType<typeof Menu>>()
const share = ref<InstanceType<typeof ShareControl>>()
const items = computed<MenuItem[]>(() => [
  ...(props.account.writable ? [
    { label: 'Rename', icon: 'tabler:pencil', command: startRename },
    ...(props.editCredentials ? [{ label: props.nativeReconnect ? 'Reconnect' : 'Edit credential', icon: 'tabler:key', command: () => emit('edit') }] : []),
    { label: props.account.enabled ? 'Disable' : 'Enable', icon: 'tabler:power', command: () => emit('toggle') },
  ] : []),
  ...(props.account.shareable ? [{ label: 'Share', icon: 'tabler:share', command: () => share.value?.show() }] : []),
  ...(props.account.deletable ? [{ label: 'Delete', icon: 'tabler:trash', command: () => emit('remove') }] : []),
])

const ownership = computed(() => props.account.mine ? '' : props.management ? `Owned by ${props.ownerLabel}` : `Shared with you by ${props.ownerLabel}`)

const renaming = ref(false)
const draft = ref('')
const input = ref<HTMLInputElement | null>(null)

function startRename() {
  draft.value = props.account.label
  renaming.value = true
  void nextTick(() => input.value?.select())
}

function finishRename() {
  if (!renaming.value) return
  renaming.value = false
  const next = draft.value.trim()
  if (next && next !== props.account.label) emit('rename', next)
}
</script>

<template>
  <li v-if="management" class="ac-row ac-account ac-managed-account">
    <div class="ac-account-main">
      <div class="ac-row-title">
        <input v-if="renaming" ref="input" v-model="draft" class="ac-rename kx-focus-halo" aria-label="Account label"
          @keydown.enter.prevent="finishRename" @keydown.escape.prevent="renaming = false" @blur="finishRename" />
        <span v-else class="ac-row-name">{{ account.label }}</span>
      </div>
      <div class="ac-account-summary">
        <Tag :severity="severity" :value="health.label" />
        <span class="ac-muted">{{ kindLabel }}<template v-if="ownership"> · {{ ownership }}</template></span>
      </div>
      <p v-if="health.help" class="ac-hint">{{ health.help }}</p>
      <p v-if="account.subscription" class="ac-hint">A subscription login runs tasks for its owner.</p>
      <slot name="usage" :account="account"><AccountUsage :account="account" /></slot>
      <span class="ac-muted">{{ account.runs_day }} {{ account.runs_day === 1 ? 'task' : 'tasks' }} in the last 24 hours<template v-if="account.failures_day"> · {{ account.failures_day }} failed</template></span>
      <details v-if="health.code" class="ac-account-details">
        <summary class="kx-focus-outline">Technical details</summary>
        <code>{{ health.code }}</code>
      </details>
    </div>
    <div v-if="items.length" class="ac-account-menu">
      <Button type="button" text rounded severity="secondary" size="small" :aria-label="`Actions for ${account.label}`"
        aria-haspopup="menu" @click="actions?.toggle($event)">
        <template #icon><Icon icon="tabler:dots" aria-hidden="true" /></template>
      </Button>
      <Menu ref="actions" :model="items" popup append-to="self" :aria-label="`Actions for ${account.label}`">
        <template #itemicon="{ item }"><Icon v-if="item.icon" :icon="item.icon" aria-hidden="true" /></template>
      </Menu>
      <ShareControl v-if="account.shareable" ref="share" :id="account.id" :title="account.label" hide-button />
    </div>
  </li>
  <li v-else class="ac-row ac-account ac-hover-actions" :class="{ off: !account.enabled || !account.usable }">
    <div class="ac-account-main">
      <div class="ac-row-title">
        <span class="kx-tag-sm ac-tone" :class="state">{{ STATE_LABEL[state] }}</span>
        <input v-if="renaming" ref="input" v-model="draft" class="ac-rename kx-focus-halo" aria-label="Account label"
          @keydown.enter.prevent="finishRename" @keydown.escape.prevent="renaming = false" @blur="finishRename" />
        <span v-else class="ac-row-name">{{ account.label }}</span>
        <span v-if="account.subscription" class="kx-tag-sm ac-tone">personal</span>
      </div>
      <div class="ac-muted">
        {{ kindLabel }} · {{ account.runs_day }} {{ account.runs_day === 1 ? 'task' : 'tasks' }} in the last 24 hours · {{ account.failures_day }} {{ account.failures_day === 1 ? 'failure' : 'failures' }}
        · <span v-if="account.last_used_at" :title="shortTime(account.last_used_at)">last used {{ relativeTime(account.last_used_at, now) }}</span><span v-else>never used</span>
      </div>
      <div v-if="ownership" class="ac-muted">{{ ownership }}</div>
      <div v-if="!account.usable" class="ac-muted ac-strong"><Icon icon="tabler:lock" /> {{ account.unavailable_reason || 'Account unavailable for tasks' }}</div>
      <div v-else-if="account.subscription" class="ac-muted">Subscription login: personal use only</div>
      <div v-if="account.endpoint" class="ac-muted ac-mono">{{ account.endpoint.protocol }} · {{ account.endpoint.base_url }}{{ account.endpoint.model ? ' · ' + account.endpoint.model : '' }}</div>
      <div v-if="state === 'cooling' && account.cooldown_until" class="ac-muted">Available at {{ shortTime(account.cooldown_until) }}</div>
        <div v-for="window in account.rate_limits?.windows ?? []" :key="window.window" class="ac-muted">
          {{ window.window.replace('seven_day', '7-day').replace('five_hour', '5-hour').replaceAll('_', ' ') }}: {{ window.utilization === undefined ? window.status : `${Math.round(window.utilization * 100)}% used` }}<template v-if="window.resets_at">, resets {{ new Date(window.resets_at * 1000).toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' }) }}</template>
        </div>
        <div v-if="account.rate_limits?.overage_status" class="ac-muted">Overage: {{ account.rate_limits.overage_status }}{{ account.rate_limits.overage_disabled_reason ? ' · ' + account.rate_limits.overage_disabled_reason : '' }}</div>
        <div v-if="account.last_error" class="kx-err ac-small">{{ account.last_error }}</div>

    </div>
    <div class="ac-row-actions">
      <ToggleSwitch v-if="account.writable" :model-value="account.enabled"
        :aria-label="account.enabled ? 'Disable account' : 'Enable account'" @change="emit('toggle')" />
      <button v-if="account.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Rename" aria-label="Rename account" @click="startRename"><Icon icon="tabler:pencil" /></button>
      <button v-if="account.writable && editCredentials" type="button" class="ac-icon-btn kx-focus-outline" title="Edit credential and endpoint" aria-label="Edit account" @click="emit('edit')"><Icon icon="tabler:key" /></button>
      <button v-if="account.deletable" type="button" class="ac-icon-btn kx-focus-outline" title="Delete" aria-label="Delete account" @click="emit('remove')"><Icon icon="tabler:trash" /></button>
    </div>
  </li>
</template>
