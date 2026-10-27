<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, nextTick, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { agentIcon, relativeTime, duration, timeout, useRunClock } from './presentation.ts'
import { autocode, errorText, live, serial, shortTime, type Account, type Image, type Run, type RunEvent, type Workspace } from './api.ts'

const props = defineProps<{ runId: string; accounts: Account[]; images: Image[]; workspaces: Workspace[] }>()
const emit = defineEmits<{ changed: [run: Run] }>()

const catalog = useRequiredCatalog()
const run = ref<Run | null>(null)
const events = ref<RunEvent[]>([])
const nextSeq = ref(0)
const error = ref('')
const stream = ref<HTMLElement | null>(null)
const result = ref<HTMLElement | null>(null)
const promptExpanded = ref(false)
const resultExpanded = ref(false)
const copied = ref(false)
const copyError = ref('')
const now = useRunClock()
const longPrompt = computed(() => (run.value?.prompt.length ?? 0) > 500 || (run.value?.prompt.split('\n').length ?? 0) > 5)
const longResult = computed(() => (run.value?.result.length ?? 0) > 1800 || (run.value?.result.split('\n').length ?? 0) > 10)
let alive = true
let following = true
let copyTimer: ReturnType<typeof setTimeout> | undefined

const active = (r: Run) => r.status === 'queued' || r.status === 'running'
function trackScroll() {
  if (stream.value) following = stream.value.scrollHeight - stream.value.scrollTop - stream.value.clientHeight < 40
}

const refresh = serial(async () => {
  try {
    let more = true
    while (more && alive) {
      const data = await autocode.run(props.runId, nextSeq.value)
      if (!alive) return
      run.value = data.run
      nextSeq.value = data.next_seq
      if (data.events.length) {
        events.value = events.value.concat(data.events)
        await nextTick()
        if (following) stream.value?.scrollTo({ top: stream.value.scrollHeight })
      }
      more = data.more
    }
    if (alive && run.value) emit('changed', run.value)
    error.value = ''
  } catch (e) {
    error.value = errorText(e, 'Could not load the task.')
  }
})
const unsubscribe = live.run(props.runId, () => { void refresh() })
useHostVisibilityRefresh(refresh)
onUnmounted(() => {
  alive = false
  unsubscribe()
  clearTimeout(copyTimer)
})

async function cancel() {
  try {
    await autocode.cancelRun(props.runId)
    await refresh()
  } catch (e) {
    error.value = errorText(e, 'Could not cancel the task.')
  }
}

async function copyResult() {
  try {
    const text = run.value?.result ?? ''
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const field = document.createElement('textarea')
      const root = result.value?.getRootNode()
      const focused = root instanceof ShadowRoot || root instanceof Document ? root.activeElement : null
      const previous = focused instanceof HTMLElement ? focused : null
      field.value = text
      field.readOnly = true
      field.style.cssText = 'position:fixed;opacity:0;pointer-events:none;'
      result.value?.parentElement?.append(field)
      try {
        field.select()
        if (!document.execCommand('copy')) throw new Error('Copy failed')
      } finally {
        field.remove()
        previous?.focus({ preventScroll: true })
      }
    }
    copied.value = true
    copyError.value = ''
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copyError.value = 'Could not copy. Select the result text to copy it.'
  }
}

function toggleResult() {
  resultExpanded.value = !resultExpanded.value
  if (!resultExpanded.value) result.value?.scrollTo({ top: 0 })
}
function runModel(r: Run) { return typeof r.options?.model === 'string' ? r.options.model : '' }
function accountLabel(id: string) { return props.accounts.find((a) => a.id === id)?.label ?? 'Unlisted account' }
function workspaceLabel(id: string) { return props.workspaces.find((w) => w.id === id)?.name ?? 'Unlisted workspace' }
function imageLabel(id: string) { return props.images.find((i) => i.id === id)?.label ?? 'Unlisted image' }
function usageLine(r: Run) {
  const parts: string[] = []
  if (r.usage.input_tokens !== undefined) parts.push(`${r.usage.input_tokens} input`)
  if (r.usage.output_tokens !== undefined) parts.push(`${r.usage.output_tokens} output`)
  if (r.usage.cached_tokens !== undefined) parts.push(`${r.usage.cached_tokens} cached`)
  return parts.length ? `${parts.join(' · ')} tokens` : ''
}
</script>

<template>
  <section class="ac-form ac-detail">
    <p v-if="error" class="kx-err" role="alert">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <div v-if="!run && !error" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" /> Loading the task…</div>
    <template v-else-if="run">
      <header class="ac-detail-head">
        <div class="ac-card-head">
          <span class="kx-tag-sm ac-tone" :class="run.status">{{ run.status }}</span>
          <button v-if="active(run)" type="button" class="ac-btn danger kx-focus-halo" :disabled="run.cancel_requested" @click="cancel"><Icon icon="tabler:player-stop" /> {{ run.cancel_requested ? 'Cancelling…' : 'Cancel' }}</button>
        </div>
        <h2 class="ac-detail-title">{{ run.prompt.split('\n')[0] }}</h2>
        <div class="ac-run-meta ac-detail-meta">
          <span><Icon :icon="agentIcon(run.agent, catalog.agents)" />{{ catalog.agents.find(a => a.id === run?.agent)?.title ?? run.agent }}</span>
          <span>{{ accountLabel(run.account_id) }}</span><span>{{ imageLabel(run.image_id) }}</span>
          <span :title="shortTime(run.started_at || run.created_at)">{{ run.started_at ? 'Started' : 'Queued' }} {{ relativeTime(run.started_at || run.created_at, now) }}</span>
          <span v-if="run.started_at">{{ duration(run, now) }} {{ active(run) ? 'elapsed' : 'duration' }}</span>
          <span v-if="run.timeout_ms">{{ timeout(run.timeout_ms) }}</span>
          <span>{{ run.unattended ? 'Unattended' : 'Attended' }}</span><span v-if="run.workflow">Workflow</span>
          <span v-if="run.workspace_id">{{ workspaceLabel(run.workspace_id) }}</span><span v-if="runModel(run)">{{ runModel(run) }}</span><span v-if="usageLine(run)">{{ usageLine(run) }}</span>
        </div>
      </header>
      <section class="ac-detail-section" aria-labelledby="ac-prompt-heading">
        <div class="ac-section-head"><h3 id="ac-prompt-heading">Prompt</h3><button v-if="longPrompt" type="button" class="ac-link kx-focus-outline" :aria-expanded="promptExpanded" aria-controls="ac-prompt-text" @click="promptExpanded = !promptExpanded">{{ promptExpanded ? 'Collapse prompt' : 'Expand prompt' }}</button></div>
        <pre id="ac-prompt-text" class="ac-pre ac-prompt" :class="{ expanded: promptExpanded || !longPrompt }"><span>{{ run.prompt }}</span></pre>
      </section>
      <section v-if="run.result" class="ac-detail-section ac-result" aria-labelledby="ac-result-heading">
        <div class="ac-section-head"><h3 id="ac-result-heading">{{ run.status === 'succeeded' ? 'Result' : 'Partial result' }}</h3><div class="ac-row-actions"><button v-if="longResult" type="button" class="ac-link kx-focus-outline" :aria-expanded="resultExpanded" aria-controls="ac-result-text" @click="toggleResult">{{ resultExpanded ? 'Collapse result' : 'Expand result' }}</button><button type="button" class="ac-btn kx-focus-halo" @click="copyResult"><Icon :icon="copied ? 'tabler:check' : 'tabler:copy'" />{{ copied ? 'Copied' : 'Copy' }}</button></div></div>
        <p v-if="copyError" class="kx-err" role="alert">{{ copyError }}</p>
        <pre id="ac-result-text" ref="result" class="ac-pre ac-result-text" :class="{ expanded: resultExpanded }" tabindex="0" aria-label="Result">{{ run.result }}</pre>
      </section>
      <p v-if="run.error" class="kx-err" role="alert">{{ run.error }}</p>
      <section class="ac-detail-section" aria-labelledby="ac-log-heading">
        <div class="ac-section-head"><h3 id="ac-log-heading">Log</h3><span class="ac-muted">{{ events.length }} events</span></div>
        <div ref="stream" class="ac-stream" tabindex="0" aria-label="Task log" @scroll="trackScroll">
          <div v-for="e in events" :key="e.seq" class="ac-event" :class="e.kind">
            <span class="ac-event-kind">{{ e.kind }}</span>
            <pre class="ac-event-text">{{ e.text }}</pre>
          </div>
          <div v-if="active(run)" class="ac-muted ac-pulse">Working…</div>
          <div v-else-if="!events.length" class="ac-muted">No log events.</div>
        </div>
      </section>
    </template>
  </section>
</template>
