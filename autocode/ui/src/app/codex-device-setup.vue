<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { autocode, type Account } from './api.ts'
import type { deviceResult } from './codex-device-api.ts'
import type { z } from 'zod'

const props = defineProps<{ account?: Account; labelBytes?: number }>()
const emit = defineEmits<{ busy: [value: boolean]; saved: [] }>()
type Result = z.infer<typeof deviceResult>
type Code = Extract<Result, { ticket: string }>
const label = ref(props.account?.label ?? 'Codex')
const code = ref<Code>()
const state = ref<Result['state'] | 'start' | 'starting' | 'cancelling'>('start')
const active = computed(() => !!code.value)
const valid = computed(() => !!label.value.trim() && new TextEncoder().encode(label.value.trim()).length <= (props.labelBytes ?? 200))
const copyFeedback = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
let stopped = false
let cancelRequested = false
let checking = false

const messages = {
  expired: 'The code expired. Start again for a new one.',
  denied: 'ChatGPT declined the request. Start again when you are ready to approve it.',
  cancelled: 'Sign-in was cancelled. You can start again at any time.',
  unavailable: 'Could not reach ChatGPT. Try signing in again shortly.',
  save_failed: 'ChatGPT approved the request, but the account could not be saved. Start again.',
  busy: 'Another sign-in request is finishing. Try again shortly.',
} as const

const message = computed(() => {
  const key = state.value
  return key in messages ? messages[key as keyof typeof messages] : ''
})

function finish(result: Result['state']) {
  state.value = result
  code.value = undefined
  emit('busy', false)
  if (result === 'ready') emit('saved')
}

function schedule(delay: number) {
  clearTimeout(timer)
  timer = setTimeout(() => { void check() }, delay * 1000)
}

async function check() {
  const current = code.value
  if (!current || stopped || checking) return
  const action = cancelRequested ? 'cancel' : 'poll'
  checking = true
  try {
    const result = await autocode.codexDevice({ action, ticket: current.ticket })
    if (stopped || code.value !== current) return
    if ('retry_after' in result) {
      state.value = cancelRequested ? 'cancelling' : result.state
      schedule(cancelRequested && action === 'poll' ? 0 : result.retry_after)
    } else {
      finish(result.state)
    }
  } catch {
    if (!stopped && code.value === current) {
      if (cancelRequested && action === 'poll') schedule(0)
      else finish('unavailable')
    }
  } finally {
    checking = false
  }
}

async function start() {
  if (stopped || !valid.value || state.value === 'starting' || active.value || state.value === 'rate_limited') return
  cancelRequested = false
  copyFeedback.value = ''
  state.value = 'starting'
  emit('busy', true)
  try {
    const result = await autocode.codexDevice({ action: 'start', label: label.value.trim(), account_id: props.account?.id })
    if (stopped) {
      if ('ticket' in result) void autocode.codexDevice({ action: 'cancel', ticket: result.ticket }).catch(() => {})
      return
    }
    if ('ticket' in result) {
      code.value = result
      state.value = 'waiting'
      schedule(result.retry_after)
    } else {
      finish(result.state)
      if (result.state === 'rate_limited') {
        timer = setTimeout(() => { state.value = 'start' }, result.retry_after * 1000)
      }
    }
  } catch {
    if (!stopped) finish('unavailable')
  }
}

function cancel() {
  clearTimeout(timer)
  cancelRequested = true
  state.value = 'cancelling'
  void check()
}

async function copy() {
  if (!code.value) return
  try {
    await navigator.clipboard.writeText(code.value.user_code)
    copyFeedback.value = 'Code copied'
  } catch {
    copyFeedback.value = 'Select the code to copy it.'
  }
}

onBeforeUnmount(() => {
  stopped = true
  clearTimeout(timer)
  if (code.value) void autocode.codexDevice({ action: 'cancel', ticket: code.value.ticket }).catch(() => {})
})
</script>

<template>
  <section class="ac-stack" aria-label="ChatGPT sign-in">
    <template v-if="active && code">
      <ol class="ac-setup-steps">
        <li>Open ChatGPT in a new tab and sign in with the account you want to use.</li>
        <li>Enter this code to approve access for Codex.</li>
      </ol>
      <div class="ac-device-code">
        <code>{{ code.user_code }}</code>
        <Button label="Copy code" text severity="secondary" size="small" @click="copy">
          <template #icon><Icon icon="tabler:copy" aria-hidden="true" /></template>
        </Button>
        <span class="ac-muted" role="status">{{ copyFeedback }}</span>
      </div>
      <div class="ac-setup-actions">
        <Button as="a" label="Open ChatGPT" :href="code.verification_url" target="_blank" rel="noopener noreferrer">
          <template #icon><Icon icon="tabler:external-link" aria-hidden="true" /></template>
        </Button>
        <Button text severity="secondary" label="Cancel sign-in" :disabled="state === 'cancelling'" @click="cancel" />
      </div>
      <Message severity="info" :closable="false" role="status">
        {{ state === 'cancelling' ? 'Cancelling sign-in…' : state === 'rate_limited' ? 'ChatGPT asked us to slow down. We’ll check again shortly.' : 'Waiting for approval in ChatGPT…' }}
      </Message>
    </template>
    <Message v-else-if="state === 'ready'" severity="success" :closable="false" role="status">
      Codex is ready to run tasks with this ChatGPT account.
    </Message>
    <template v-else>
      <p class="ac-hint">Connect your personal ChatGPT account to run tasks with Codex. Enable device code authorization in ChatGPT security settings if asked.</p>
      <label v-if="!account" class="ac-field"><span>Account name</span><InputText v-model="label" :disabled="state === 'starting'" autocomplete="off" /></label>
      <Message v-if="message" :severity="state === 'cancelled' ? 'secondary' : 'warn'" :closable="false" role="status">{{ message }}</Message>
      <Message v-if="state === 'rate_limited'" severity="warn" :closable="false" role="status">ChatGPT asked us to slow down. Try again in a moment.</Message>
      <div class="ac-setup-actions">
        <Button :label="account ? 'Reconnect with ChatGPT' : 'Sign in with ChatGPT'" :disabled="!valid || state === 'rate_limited'" :loading="state === 'starting'" @click="start">
          <template #icon><Icon icon="tabler:brand-openai" aria-hidden="true" /></template>
        </Button>
      </div>
    </template>
  </section>
</template>
