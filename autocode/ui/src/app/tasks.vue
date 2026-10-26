<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { useRequiredCatalog } from './catalog.ts'
import { ref, computed, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import Button from 'primevue/button'
import AppDialog from './app-dialog.vue'
import { agentIcon, relativeTime, duration, useRunClock } from './presentation.ts'
import TaskForm from './task-form.vue'
import RunDetail from './run-detail.vue'
import { autocode, errorText, live, serial, shortTime, type Account, type DriverInfo, type Image, type Run, type Workspace } from './api.ts'
import { useComponentTopics } from './live.ts'

const props = defineProps<{ query: string }>()
const emit = defineEmits<{ goto: [agent?: string]; agentChanged: [agent: string]; count: [value: number] }>()
const catalog = useRequiredCatalog()
const composing = ref(false)
defineExpose({ open: () => { composing.value = true } })

const accounts = ref<Account[]>([])
const images = ref<Image[]>([])
const workspaces = ref<Workspace[]>([])
const drivers = ref<DriverInfo[]>([])
const runs = ref<Run[]>([])
const loaded = ref(false)
const error = ref('')
const selected = ref<string | null>(null)
const now = useRunClock()

const refreshAll = serial(async () => {
  try {
    const [a, i, r, w, d] = await Promise.all([autocode.accounts(), autocode.images(), autocode.runs(), autocode.workspaces(), autocode.drivers()])
    accounts.value = a
    images.value = i
    runs.value = r
    workspaces.value = w.workspaces
    drivers.value = d
    loaded.value = true
    error.value = ''
  } catch (e) {
    error.value = errorText(e, 'Could not load tasks.')
  }
})
const unsubscribeRuns = live.runs(() => { void refreshAll() })
useComponentTopics(() => [...images.value, ...accounts.value].map(i => i.id), () => { void refreshAll() })
useHostVisibilityRefresh(refreshAll)
onUnmounted(unsubscribeRuns)

async function started(id: string) {
  composing.value = false
  await refreshAll()
  selected.value = id
}

// Detail notifications join the list queue so an older list cannot overwrite them.
function changed() { void refreshAll() }

const usable = computed(() => accounts.value.some(a => a.usable && a.enabled))
const filtered = computed(() => runs.value.filter(r => [r.prompt, r.status, r.agent, agentTitle(r.agent), accountLabel(r.account_id)].join(' ').toLowerCase().includes(props.query.trim().toLowerCase())))
watch(runs, value => emit('count', value.length))
function agentTitle(id: string) { return catalog.value.agents.find(a => a.id === id)?.title ?? id }
function imageLabel(id: string) { return images.value.find(i => i.id === id)?.label ?? 'Unlisted image' }
function accountLabel(id: string) { return accounts.value.find((a) => a.id === id)?.label ?? 'unlisted account' }
</script>

<template>
  <div v-if="!loaded" class="kx-loading">
    <template v-if="error">{{ error }} <button class="ac-link kx-focus-outline" type="button" @click="refreshAll">Retry</button></template>
    <template v-else><Icon icon="tabler:loader-2" class="spin" /> Loading tasks…</template>
  </div>
  <div v-else>
    <p v-if="error" class="kx-err" role="alert">{{ error }} <button class="ac-link kx-focus-outline" type="button" @click="refreshAll">Retry</button></p>
    <div v-if="!runs.length" class="kx-empty">
      <div class="kx-empty-ico"><Icon icon="tabler:terminal-2" /></div>
      <div class="kx-empty-title">No tasks yet</div>
      <div class="kx-empty-sub">{{ usable ? 'Give a coding agent a task and follow its progress here.' : 'Add an account to give your coding agent a place to start.' }}</div>
      <Button :label="usable ? 'New task' : 'Add account'" @click="usable ? composing = true : emit('goto')"><template #icon><Icon icon="tabler:plus" /></template></Button>
    </div>
    <div v-else-if="!filtered.length" class="kx-empty"><div class="kx-empty-title">No matches</div><div class="kx-empty-sub">Try another task, agent or account.</div></div>
    <p v-if="runs.length" class="ac-muted">Search filters the loaded tasks.</p>
    <ul v-if="filtered.length" class="ac-run-list">
      <li v-for="r in filtered" :key="r.id" class="ac-run">
        <button type="button" class="ac-run-main kx-focus-halo" @click="selected = r.id">
          <span class="ac-run-copy">
            <span class="ac-run-title-row"><span class="ac-run-title">{{ r.prompt.split('\n')[0] }}</span><span class="kx-tag-sm ac-tone" :class="r.status">{{ r.status }}</span><span v-if="r.workflow" class="kx-tag-sm ac-tone">Workflow</span></span>
            <span class="ac-run-meta"><span><Icon :icon="agentIcon(r.agent, catalog.agents)" />{{ agentTitle(r.agent) }}</span><span>{{ accountLabel(r.account_id) }}</span><span>{{ imageLabel(r.image_id) }}</span><span :title="shortTime(r.started_at || r.created_at)">{{ relativeTime(r.started_at || r.created_at, now) }}</span><span v-if="r.started_at">{{ duration(r, now) }} {{ r.status === 'running' ? 'elapsed' : 'duration' }}</span></span>
          </span>
          <Icon icon="tabler:chevron-right" class="ac-run-chevron ac-muted" />
        </button>
      </li>
    </ul>
    <AppDialog v-if="composing" title="New task" wide @close="composing = false">
      <TaskForm :accounts="accounts" :images="images" :workspaces="workspaces" :drivers="drivers" @started="started" @cancel="composing = false" @agent-changed="emit('agentChanged', $event)" @goto="(_tab, agent) => emit('goto', agent)" />
    </AppDialog>
    <AppDialog v-if="selected" title="Task details" wide @close="selected = null">
      <RunDetail :key="selected" :run-id="selected" :accounts="accounts" :images="images" :workspaces="workspaces" @changed="changed" />
      <template #footer><button type="button" class="ac-btn kx-focus-halo" @click="selected = null">Close</button></template>
    </AppDialog>
  </div>
</template>
