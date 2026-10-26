<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { accountState, shortTime, type Account } from './api.ts'
import { relativeTime, useRunClock } from './presentation.ts'

// One account in its agent's list, with ownership and editable actions.
const props = defineProps<{ account: Account; kindLabel: string; ownerLabel: string }>()
const emit = defineEmits<{ toggle: []; rename: [label: string]; remove: [] }>()

const STATE_LABEL = { ready: 'ready', cooling: 'cooling down', disabled: 'disabled' } as const
const now = useRunClock()
const state = computed(() => accountState(props.account, now.value))

const ownership = computed(() => props.account.mine ? '' : `Shared with you by ${props.ownerLabel}`)

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
  <li class="ac-row ac-account ac-hover-actions" :class="{ off: !account.enabled || !account.usable }">
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
      <div v-if="state === 'cooling'" class="ac-muted">Back in rotation at {{ shortTime(account.cooldown_until) }}</div>
      <div v-if="account.last_error" class="kx-err ac-small">{{ account.last_error }}</div>

    </div>
    <div class="ac-row-actions">
      <label v-if="account.writable" class="ac-switch" :title="account.enabled ? 'Takes tasks' : 'Out of rotation'">
        <input type="checkbox" :checked="account.enabled" :aria-label="account.enabled ? 'Take out of rotation' : 'Put in rotation'" @change="emit('toggle')" />
        <span />
      </label>
      <button v-if="account.writable" type="button" class="ac-icon-btn kx-focus-outline" title="Rename" aria-label="Rename account" @click="startRename"><Icon icon="tabler:pencil" /></button>
      <button v-if="account.deletable" type="button" class="ac-icon-btn kx-focus-outline" title="Delete" aria-label="Delete account" @click="emit('remove')"><Icon icon="tabler:trash" /></button>
    </div>
  </li>
</template>
