<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, nextTick, onUnmounted, onMounted } from 'vue'
import { config } from '@wippy-fe/proxy'
import { Icon } from '@iconify/vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { agentIcon, relativeTime, duration, timeout, useRunClock, errorText, shortTime } from './presentation.ts'
import { autocode, ApiError, type Account, type Image, type Run, type RunEvent, type Workspace } from './api.ts'
import { live, serial } from './live.ts'

const props = defineProps<{ runId: string; accounts: Account[]; images: Image[]; workspaces: Workspace[] }>()

const catalog = useRequiredCatalog()
const run = ref<Run | null>(null)
const events = ref<RunEvent[]>([])
const WINDOW = 500
const nextSeq = ref(0)
const hasEarlier = ref(false)
const loadingEarlier = ref(false)
let earlierCursor: number | undefined
const history = ref(false)
const error = ref('')
const notFound = ref(false)
const detail = ref<HTMLElement | null>(null)
const linkCopied = ref(false)
const linkError = ref('')
let scrollOwner: HTMLElement | null = null
const promptExpanded = ref(false)
const resultExpanded = ref(false)
const copied = ref(false)
const copyError = ref('')
const now = useRunClock()
const longPrompt = computed(() => (run.value?.prompt.length ?? 0) > 500 || (run.value?.prompt.split('\n').length ?? 0) > 5)
const longResult = computed(() => (run.value?.result.length ?? 0) > 1800 || (run.value?.result.split('\n').length ?? 0) > 10)
let alive = true
let following = true
let linkTimer: ReturnType<typeof setTimeout> | undefined
let copyTimer: ReturnType<typeof setTimeout> | undefined

const active = (r: Run) => r.status === 'queued' || r.status === 'running'
function trackScroll() {
  if (scrollOwner) following = scrollOwner.scrollHeight - scrollOwner.scrollTop - scrollOwner.clientHeight < 40
}

onMounted(() => {
  scrollOwner = detail.value?.closest<HTMLElement>('.ac') ?? null
  scrollOwner?.addEventListener('scroll', trackScroll, { passive: true })
})
onUnmounted(() => { scrollOwner?.removeEventListener('scroll', trackScroll); scrollOwner = null })

const refresh = serial(async () => {
  try {
    const before = earlierCursor ?? (run.value ? undefined : 0)
    earlierCursor = undefined
    let data = await autocode.run(props.runId, before === undefined ? nextSeq.value : undefined, before)
    if (!alive) return
    // A burst or a history view resumes at the latest bounded window.
    if (before === undefined && (data.more || (history.value && data.events.length))) {
      data = await autocode.run(props.runId, undefined, 0)
      if (!alive) return
      events.value = data.events
      hasEarlier.value = data.more
      history.value = false
    } else if (before !== undefined) {
      events.value = data.events
      hasEarlier.value = data.more
      history.value = before !== 0
    } else if (data.events.length) {
      const overflow = Math.max(0, events.value.length + data.events.length - WINDOW)
      if (overflow) events.value.splice(0, overflow)
      events.value.push(...data.events)
      hasEarlier.value = hasEarlier.value || overflow > 0
    }
    notFound.value = false
    run.value = data.run
    if (!history.value) nextSeq.value = data.next_seq
    await nextTick()
    if (alive && following && scrollOwner) scrollOwner.scrollTo({ top: scrollOwner.scrollHeight })
    error.value = ''
  } catch (e) {
    if (!alive) return
    notFound.value = e instanceof ApiError && e.code === 'autocode.run_not_found'
    if (notFound.value) { run.value = null; events.value = [] }
    error.value = notFound.value ? '' : errorText(e, 'Could not load the task.')
  } finally {
    loadingEarlier.value = false
  }
})
function loadEarlier() {
  if (loadingEarlier.value || !events.value.length) return
  following = false
  loadingEarlier.value = true
  earlierCursor = events.value[0]!.seq
  void refresh()
}
function loadLatest() {
  if (loadingEarlier.value) return
  following = true
  loadingEarlier.value = true
  earlierCursor = 0
  void refresh()
}
const unsubscribe = live.run(props.runId, () => { void refresh() })
useHostVisibilityRefresh(refresh)
onUnmounted(() => {
  alive = false
  unsubscribe()
  clearTimeout(copyTimer)
  clearTimeout(linkTimer)
})

async function cancel() {
  try {
    await autocode.cancelRun(props.runId)
    await refresh()
  } catch (e) {
    error.value = errorText(e, 'Could not cancel the task.')
  }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const field = document.createElement('textarea')
    const root = detail.value?.getRootNode()
    const focused = root instanceof ShadowRoot || root instanceof Document ? root.activeElement : null
    const previous = focused instanceof HTMLElement ? focused : null
    field.value = text
    field.readOnly = true
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none;'
    detail.value?.append(field)
    try {
      field.select()
      if (!document.execCommand('copy')) throw new Error('Copy failed')
    } finally {
      field.remove()
      previous?.focus({ preventScroll: true })
    }
  }
}
async function copyResult() {
  try {
    await copyText(run.value?.result ?? '')
    copied.value = true
    copyError.value = ''
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copyError.value = 'Could not copy. Select the result text to copy it.'
  }
}
async function copyLink() {
  try {
    // The shell page claims /:part(.*)*. Use the deployment origin supplied by
    // the proxy, since this component can run inside the shell's iframe.
    const base = new URL(config.env.APP_API_URL || '/', window.location.href)
    await copyText(new URL(`/autocode/runs/${encodeURIComponent(props.runId)}`, base).href)
    linkCopied.value = true
    linkError.value = ''
    clearTimeout(linkTimer)
    linkTimer = setTimeout(() => { linkCopied.value = false }, 2000)
  } catch {
    linkError.value = 'Could not copy the link. Try again.'
  }
}

function toggleResult() {
  resultExpanded.value = !resultExpanded.value
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
  <section ref="detail" class="ac-form ac-detail">
    <div v-if="notFound" class="kx-empty" role="status"><h1>Run not found</h1><p>This run does not exist or you do not have access to it.</p></div>
    <p v-if="error" class="kx-err" role="alert">{{ error }} <button type="button" class="ac-link kx-focus-outline" @click="refresh">Retry</button></p>
    <div v-if="!run && !error && !notFound" class="kx-loading"><Icon icon="tabler:loader-2" class="spin" /> Loading the task…</div>
    <template v-else-if="run">
      <header class="ac-detail-head">
        <div class="ac-card-head">
          <span class="kx-tag-sm ac-tone" :class="run.status">{{ run.status }}</span>
          <button type="button" class="ac-btn kx-focus-halo" aria-live="polite" @click="copyLink"><Icon :icon="linkCopied ? 'tabler:check' : 'tabler:link'" />{{ linkCopied ? 'Link copied' : 'Copy link' }}</button>
          <button v-if="active(run)" type="button" class="ac-btn danger kx-focus-halo" :disabled="run.cancel_requested" @click="cancel"><Icon icon="tabler:player-stop" /> {{ run.cancel_requested ? 'Cancelling…' : 'Cancel' }}</button>
        </div>
        <h1 class="ac-detail-title">{{ run.prompt.split('\n')[0] }}</h1>
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
      <p v-if="linkError" class="kx-err" role="alert">{{ linkError }}</p>
      <section class="ac-detail-section" aria-labelledby="ac-prompt-heading">
        <div class="ac-section-head"><h3 id="ac-prompt-heading">Prompt</h3><button v-if="longPrompt" type="button" class="ac-link kx-focus-outline" :aria-expanded="promptExpanded" aria-controls="ac-prompt-text" @click="promptExpanded = !promptExpanded">{{ promptExpanded ? 'Collapse prompt' : 'Expand prompt' }}</button></div>
        <pre id="ac-prompt-text" class="ac-pre ac-prompt" :class="{ expanded: promptExpanded || !longPrompt }"><span>{{ run.prompt }}</span></pre>
      </section>
      <section v-if="run.result" class="ac-detail-section ac-result" aria-labelledby="ac-result-heading">
        <div class="ac-section-head"><h3 id="ac-result-heading">{{ run.status === 'succeeded' ? 'Result' : 'Partial result' }}</h3><div class="ac-row-actions"><button v-if="longResult" type="button" class="ac-link kx-focus-outline" :aria-expanded="resultExpanded" aria-controls="ac-result-text" @click="toggleResult">{{ resultExpanded ? 'Collapse result' : 'Expand result' }}</button><button type="button" class="ac-btn kx-focus-halo" @click="copyResult"><Icon :icon="copied ? 'tabler:check' : 'tabler:copy'" />{{ copied ? 'Copied' : 'Copy' }}</button></div></div>
        <p v-if="copyError" class="kx-err" role="alert">{{ copyError }}</p>
        <pre id="ac-result-text" class="ac-pre ac-result-text" :class="{ expanded: resultExpanded }" tabindex="0" aria-label="Result">{{ run.result }}</pre>
      </section>
      <p v-if="run.error" class="kx-err" role="alert">{{ run.error }}</p>
      <section class="ac-detail-section" aria-labelledby="ac-log-heading">
        <div class="ac-section-head"><h3 id="ac-log-heading">Log</h3><span class="ac-muted">{{ events.length }} events</span></div>
        <button v-if="hasEarlier" type="button" class="ac-link kx-focus-outline" :disabled="loadingEarlier" @click="loadEarlier">{{ loadingEarlier ? 'Loading…' : 'Load earlier' }}</button>
        <button v-if="history" type="button" class="ac-link kx-focus-outline" :disabled="loadingEarlier" @click="loadLatest">Latest</button>
        <div class="ac-stream" tabindex="0" aria-label="Task log">
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
