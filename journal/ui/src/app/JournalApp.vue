<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useHostVisibilityRefresh, useProps } from '@wippy-fe/webcomponent-vue'
import AgentsRail from './AgentsRail.vue'
import FocusPath from './FocusPath.vue'
import GraphCatalog from './GraphCatalog.vue'
import GraphLens from './GraphLens.vue'
import JournalContextMenu from './JournalContextMenu.vue'
import LanesLens from './LanesLens.vue'
import NowLens from './NowLens.vue'
import OrbitPanel from './OrbitPanel.vue'
import OutlineTree from './OutlineTree.vue'
import SearchLens from './SearchLens.vue'
import StaleReview from './StaleReview.vue'
import TimelineLens from './TimelineLens.vue'
import { spanTarget } from './lanes'
import { useJournal } from './useJournal'
import { agentDestination } from './agents'
import type { AgentRow } from './agents'
import type { Lens } from './navigation'

interface Props { entryId?: string; mode?: string; readOnly?: boolean }

const props = useProps<Props>()
const entryId = computed(() => props.value?.entryId || '')
const isPreview = computed(() => (props.value?.mode || 'preview') === 'preview')
const canEdit = computed(() => !isPreview.value && !props.value?.readOnly)
const navOpen = ref(!isPreview.value)
const orbitOpen = ref(false)
const staleOpen = ref(false)
const orbitWidth = ref(400)
const rootEl = ref<HTMLElement | null>(null)
const nodeMenu = ref<{ id: string; x: number; y: number } | null>(null)
let resizeState: { x: number; width: number } | null = null

const {
  lens, focus, graphId, graphs, health, cursors, spans, spanCounts, workControl, tasks, events,
  buckets, bucketWidthS, stats, taskHasMore, selectedId, loading, error, query, searchMode, searchResults, searchLoading, timeline,
  searchInput, clock, activeGraph, nodes, edges, nodeById, selectedNode, presence, touchedIds,
  foldedCount, activeCount, maxDepth, outsideWindow, wholeLoad, recordActivity, assembly, assembling, recomputeMap: recomputeWritableMap,
  healthLabel, loadAll, selectGraph, selectNode, descend, ascend, toCrumb, back, forward, changeLens,
  runSearch, openSearchResult, canBack, canForward, loadWholeGraphNow, cancelWholeGraph,
  jumpToRecord, labelIndex, viewport, rememberViewport,
} = useJournal(entryId)

function recomputeMap() {
  if (canEdit.value) void recomputeWritableMap()
}

useHostVisibilityRefresh(loadAll)

const graphKind = computed(() => String(activeGraph.value?.kind || 'graph').replace(/[-_]+/g, ' '))
/**
 * The journal state read answers with one page of tasks and no continuation
 * door, so any count taken over it is a count over that page. The lenses say so
 * rather than presenting a page total as a journal total.
 */
const taskBound = computed(() => ({
  loaded: tasks.value.length,
  total: stats.value.tasks || tasks.value.length,
  hasMore: taskHasMore.value || (stats.value.tasks || 0) > tasks.value.length,
}))
const LENS_TITLES: Record<Lens, string> = {
  now: 'Now', outline: 'Outline', graph: 'Graph', lanes: 'Lanes', recall: 'Recall', changes: 'Changes',
}
const LENS_ICONS: Record<Lens, string> = {
  now: 'tabler:bolt',
  outline: 'tabler:list-tree',
  graph: 'tabler:topology-star-3',
  lanes: 'tabler:timeline',
  recall: 'tabler:search',
  changes: 'tabler:history',
}
const LENS_HINTS: Record<Lens, string> = {
  now: 'Now (n)', outline: 'Outline (o)', graph: 'Graph (g)', lanes: 'Lanes (t)', recall: 'Recall (/)', changes: 'Changes (c)',
}
const ORDER: Lens[] = ['now', 'outline', 'graph', 'lanes', 'recall', 'changes']

/**
 * Selecting inside the navigator is reading, not leaving: the pane stays open
 * until the reader closes it. Only the ✕ and the toggle close it.
 */
function inspect(id: string) {
  selectNode(id)
  orbitOpen.value = true
}

async function chooseGraph(id: string) {
  await selectGraph(id)
}

function openNodeMenu(id: string, event: MouseEvent) {
  selectNode(id)
  nodeMenu.value = {
    id,
    x: event.clientX,
    y: event.clientY,
  }
}
async function closeNodeMenu() {
  nodeMenu.value = null
  await nextTick()
  rootEl.value?.focus()
}
function menuDetails() { if (nodeMenu.value) inspect(nodeMenu.value.id); nodeMenu.value = null }
async function menuFocus() { const id = nodeMenu.value?.id; nodeMenu.value = null; if (id) await descend(id) }
async function copyAddress() {
  const id = nodeMenu.value?.id
  nodeMenu.value = null
  if (id) await navigator.clipboard.writeText(`${graphId.value}/${id}`)
}

async function openResult(id: string) {
  await openSearchResult(id)
  orbitOpen.value = true
}

/** A rail entry opens the record that identity last wrote, when it is loaded. */
/**
 * Pressing an agent always lands somewhere: on the record it stands on — in
 * that record's own graph, fetched into focus even when it sits outside the
 * open window — else on the task its latest span worked, else on its lane.
 */
async function openAgent(row: AgentRow) {
  const destination = agentDestination(row, cursors.value, spans.value)
  if (destination.kind === 'node') {
    if (destination.graphId && destination.graphId !== graphId.value) await selectGraph(destination.graphId)
    if (nodeById.value.has(destination.nodeId)) { inspect(destination.nodeId); return }
    await jumpToRecord(destination.nodeId)
    return
  }
  if (destination.kind === 'task' && openTask(destination.taskId)) return
  changeLens('lanes')
}
function openAgentById(agentId: string) {
  void openAgent({ agentId, cursorId: agentId } as AgentRow)
}

/** The graph nodes projected from one task, so a task opens where it lives. */
function openTask(taskId: string): boolean {
  const node = nodes.value.find(item => item.id === taskId || item.id === `task:${taskId}`)
  if (!node) return false
  changeLens('outline')
  inspect(node.id)
  return true
}

/**
 * A lane bar is one identity's stretch of work on one task, so pressing it
 * opens that task where it lives in the graph. A span that never named a task
 * opens the identity that worked it, which is the rest of what the bar says.
 */
function openSpan(spanId: string) {
  const target = spanTarget(spans.value, spanId)
  if (!target) return
  if (target.taskId && openTask(target.taskId)) return
  if (target.agentId) openAgentById(target.agentId)
}

function startOrbitResize(event: PointerEvent) {
  resizeState = { x: event.clientX, width: orbitWidth.value }
  window.addEventListener('pointermove', resizeOrbit)
  window.addEventListener('pointerup', stopOrbitResize, { once: true })
}
function resizeOrbit(event: PointerEvent) {
  if (!resizeState) return
  orbitWidth.value = Math.max(320, Math.min(640, resizeState.width + resizeState.x - event.clientX))
}
function stopOrbitResize() {
  resizeState = null
  window.removeEventListener('pointermove', resizeOrbit)
  window.removeEventListener('pointerup', stopOrbitResize)
}
onBeforeUnmount(stopOrbitResize)

watch(lens, value => { if (value !== 'now') staleOpen.value = false })
</script>

<template>
  <main ref="rootEl" tabindex="-1"
    :class="['jr-app', { preview: isPreview, 'nav-open': navOpen, 'orbit-open': orbitOpen }]"
    :style="{ '--jr-orbit-width': `${orbitWidth}px` }"
  >
    <div v-if="loading && !nodes.length && !tasks.length" class="jr-boot">
      <span class="jr-spinner" aria-hidden="true" />
      <h2>Opening the journal</h2>
      <p>Loading your journal entries.</p>
    </div>
    <div v-else-if="error && !nodes.length && !tasks.length" class="jr-boot error">
      <span class="jr-boot-mark"><Icon icon="tabler:alert-triangle" aria-hidden="true" /></span>
      <h2>Journal is unavailable</h2>
      <p>{{ error }}</p>
      <button @click="loadAll"><Icon icon="tabler:refresh" aria-hidden="true" /> Try again</button>
    </div>

    <template v-else>
      <header class="jr-toolbar">
        <button
          class="jr-nav-toggle" :class="{ active: navOpen }"
          aria-label="Toggle the journal navigator" title="Graphs and agents"
          @click="navOpen = !navOpen"
        >
          <Icon :icon="navOpen ? 'tabler:layout-sidebar-left-collapse' : 'tabler:layout-sidebar-left-expand'" aria-hidden="true" />
        </button>

        <div class="jr-identity" :title="activeGraph?.description || activeGraph?.title">
          <h1>{{ activeGraph?.title || 'Journal' }}</h1>
          <p>
            <span class="jr-kind-tag">{{ graphKind }}</span>
            <span :class="['jr-health', health.status]">{{ healthLabel() }}</span>
            <span class="jr-numeric">{{ (stats.events || 0).toLocaleString() }} facts</span>
          </p>
        </div>

        <div v-if="lens === 'recall'" class="jr-searchbox">
          <Icon icon="tabler:search" aria-hidden="true" />
          <input ref="searchInput" v-model="query" placeholder="Recall by text or meaning…" aria-label="Search this journal graph" @keydown.enter="runSearch">
          <span class="jr-searchbox-mode">{{ searchMode }}</span>
        </div>
        <FocusPath
          v-else
          :focus="focus" :can-back="canBack" :can-forward="canForward"
          @crumb="toCrumb" @back="back" @forward="forward" @up="ascend"
        />

        <nav class="jr-lens-switch" aria-label="Journal lens">
          <button
            v-for="value in ORDER" :key="value"
            :class="{ active: lens === value }"
            :aria-label="`${LENS_TITLES[value]} lens`" :title="LENS_HINTS[value]"
            @click="changeLens(value)"
          >
            <Icon :icon="LENS_ICONS[value]" aria-hidden="true" /><span>{{ LENS_TITLES[value] }}</span>
          </button>
        </nav>

        <button
          class="jr-detail-toggle" :class="{ active: orbitOpen }" :disabled="!selectedNode"
          aria-label="Toggle the record orbit" title="Record orbit"
          @click="orbitOpen = !orbitOpen"
        >
          <Icon icon="tabler:layout-sidebar-right-expand" aria-hidden="true" />
        </button>
        <span v-if="loading" class="jr-toolbar-spinner" aria-label="Refreshing"><span class="jr-spinner" /></span>
      </header>

      <div v-if="error" class="jr-error" role="status">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" />{{ error }}
        <button aria-label="Dismiss" title="Dismiss" @click="error = ''"><Icon icon="tabler:x" aria-hidden="true" /></button>
      </div>

      <section :class="['jr-view', { 'is-graph': lens === 'graph' }]" :aria-label="`${LENS_TITLES[lens]} lens`">
        <StaleReview v-if="staleOpen" :tasks="tasks" :now="clock" :task-bound="taskBound" @task="openTask" @close="staleOpen = false" />

        <NowLens
          v-else-if="lens === 'now'"
          :spans="spans" :work-control="workControl" :tasks="tasks" :events="events" :now="clock" :span-counts="spanCounts" :task-bound="taskBound"
          @task="openTask" @agent="openAgentById" @stale="staleOpen = true"
        />

        <template v-else-if="lens === 'outline'">
          <div class="jr-lens-meta">
            <span class="jr-lens-title">Outline</span>
            <span class="jr-lens-facts">
              <b class="jr-numeric">{{ activeCount }}</b> open
              <i aria-hidden="true"></i>
              <b class="jr-numeric">{{ foldedCount }}</b> folded
              <i aria-hidden="true"></i>
              <b class="jr-numeric">{{ maxDepth }}</b> levels
              <i aria-hidden="true"></i>
              <b class="jr-numeric">{{ nodes.length.toLocaleString() }}</b> records
            </span>
          </div>
          <OutlineTree
            :nodes="nodes" :edges="edges" :presence="presence" :touched-ids="touchedIds" :selected-id="selectedId"
            :viewport="viewport"
            @select="inspect" @focus="descend" @menu="openNodeMenu" @viewport="rememberViewport"
          />
        </template>

        <GraphLens
          v-else-if="lens === 'graph'"
          :nodes="nodes" :edges="edges" :presence="presence" :touched-ids="touchedIds" :selected-id="selectedId"
          :loading="loading" :omitted-nodes="outsideWindow.nodes" :omitted-edges="outsideWindow.edges"
          :read-only="!canEdit" :assembly="assembly" :assembling="assembling" :whole="wholeLoad" :labels="labelIndex" :activity="recordActivity" :now="clock"
          :viewport="viewport"
          @select="inspect" @focus="descend" @port="jumpToRecord" @menu="openNodeMenu" @recompute="recomputeMap"
          @load-all="loadWholeGraphNow" @cancel-load="cancelWholeGraph" @viewport="rememberViewport"
        />

        <LanesLens
          v-else-if="lens === 'lanes'"
          :spans="spans" :buckets="buckets" :bucket-width-s="bucketWidthS" :now="clock"
          @agent="openAgentById" @span="openSpan"
        />

        <SearchLens
          v-else-if="lens === 'recall'"
          :results="searchResults" :query="query" :mode="searchMode" :loading="searchLoading"
          @select="openResult"
        />

        <TimelineLens v-else :items="timeline" :nodes="nodes" @select="openResult" />
      </section>

      <aside v-if="navOpen" class="jr-nav-drawer" aria-label="Journal navigator">
        <header class="jr-drawer-head">
          <div>
            <b>Journal</b>
            <span>{{ graphs.length }} graph{{ graphs.length === 1 ? '' : 's' }} · {{ (stats.tasks || 0).toLocaleString() }} task{{ stats.tasks === 1 ? '' : 's' }}</span>
          </div>
          <button aria-label="Close the navigator" title="Close" @click="navOpen = false">
            <Icon icon="tabler:x" aria-hidden="true" />
          </button>
        </header>
        <GraphCatalog :graphs="graphs" :graph-id="graphId" :now="clock" @graph="chooseGraph" />
        <AgentsRail :cursors="cursors" :spans="spans" :now="clock" @agent="openAgent" />
      </aside>

      <aside v-if="orbitOpen" class="jr-orbit-drawer" aria-label="Record orbit">
        <button class="jr-resize-handle" aria-label="Resize the orbit panel" title="Drag to resize" @pointerdown.prevent="startOrbitResize"></button>
        <OrbitPanel
          :node="selectedNode" :nodes="nodes" :edges="edges" :presence="presence" :spans="spans"
          :events="events" :graph-id="graphId" :now="clock"
          @select="inspect" @focus="descend" @close="orbitOpen = false"
        />
      </aside>

      <JournalContextMenu v-if="nodeMenu" :x="nodeMenu.x" :y="nodeMenu.y" @close="closeNodeMenu" @details="menuDetails" @focus="menuFocus" @copy="copyAddress" />
    </template>
  </main>
</template>
