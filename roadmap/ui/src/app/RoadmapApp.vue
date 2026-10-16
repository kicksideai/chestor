<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useProps } from '@wippy-fe/webcomponent-vue'
import { on } from '@wippy-fe/proxy'
import ContextMenu, { type MenuItem } from './ContextMenu.vue'
import EmptyState from './EmptyState.vue'
import HorizonsLens from './HorizonsLens.vue'
import Inspector, { type ScheduleSuggestion, type Selection, type SelectionKind } from './Inspector.vue'
import OutcomesLens from './OutcomesLens.vue'
import StrataLens from './StrataLens.vue'
import TimelineLens from './TimelineLens.vue'
import { RoadmapApi } from './api'
import * as C from './commands'
import { buildHorizons, scheduleFor } from './horizons'
import { forgetPendingRevision, projectionTopic, reconcilePendingMoves, rememberPendingMoves, type PendingMoves } from './live-sync'
import { isEditingTarget, resolveAction, resolveLens } from './keymap'
import { buildLedger } from './outcomes'
import { formatPeriod, periodLabel, shiftPeriod } from './periods'
import { strataBands, strataEdges } from './strata'
import { buildTimeline } from './timeline'
import { indexDependencies, rankByBlocking, traceSelection } from './trace'
import { DEFAULT_SETTINGS, LENSES, PROJECTION_KIND, type Horizon, type Lens, type RoadmapState } from './types'

interface Props { entryId?: string; mode?: string; readOnly?: boolean }

const props = useProps<Props>()
const entryId = computed(() => props.value?.entryId || '')
const isFull = computed(() => (props.value?.mode || 'preview') === 'full')
const canEdit = computed(() => isFull.value && !props.value?.readOnly)

const state = ref<RoadmapState | null>(null)
const loading = ref(true)
const error = ref('')
const lens = ref<Lens>('timeline')
const selection = ref<Selection | null>(null)
const panelOpen = ref(true)
const contextMenu = ref<{ x: number; y: number; items: MenuItem[] } | null>(null)
const suggestion = ref<ScheduleSuggestion | null>(null)
const rootEl = ref<HTMLElement | null>(null)
// Which lens is open and what each lens is filtered to is how this reader is
// looking at the roadmap right now, not what the roadmap says; both stay here
// until the reader asks for them to become the roadmap's own default.
const lensState = ref<Record<string, Record<string, unknown>>>({})

// A drag owns its bar until the committed projection reaches the same
// placement; commands stay ordered and projection reads stay monotonic.
const pendingMoves: PendingMoves = new Map()
let moveRevision = 0
let loadRevision = 0
let viewSeeded = false
let mutationTail: Promise<void> = Promise.resolve()

const client = computed(() => new RoadmapApi(entryId.value))

// Decorative domain colours for new layers; they label a lane, never a state.
const LAYER_PALETTE = ['var(--p-text-muted-color)', 'var(--p-primary-color)', 'color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))', 'color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))', 'color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))']
const STARTER_LAYERS = ['Platform', 'Product', 'Cloud', 'Services', 'Monetization']

function lensFlag(target: Lens, key: string): boolean {
  return lensState.value[target]?.[key] === true
}

function toggleLensFlag(target: Lens, key: string) {
  const next = { ...(lensState.value[target] || {}), [key]: !lensFlag(target, key) }
  lensState.value = { ...lensState.value, [target]: next }
}

// ── Derived views ──
const showDropped = computed(() => lensFlag('timeline', 'dropped'))
const showPast = computed(() => lensFlag('horizons', 'past'))
const showInforms = computed(() => lensFlag('strata', 'informs'))
const criticalRank = computed(() => lensFlag('strata', 'critical'))
const sortByProgress = computed(() => lensFlag('outcomes', 'progress'))
const dependencyIndex = computed(() => indexDependencies(state.value?.dependencies || []))
const selectedInitiativeId = computed(() => selection.value?.kind === 'initiative' ? selection.value.id : null)
const trace = computed(() => traceSelection(selectedInitiativeId.value, dependencyIndex.value, lens.value === 'strata'))
const timelineModel = computed(() => state.value ? buildTimeline(state.value, { includeDropped: showDropped.value }) : null)
const horizonColumns = computed(() => state.value ? buildHorizons(state.value, { includePast: showPast.value }) : [])
const strataRanks = computed(() => {
  if (!state.value || !criticalRank.value) return undefined
  return new Map(rankByBlocking(state.value.initiatives.map(i => i.id), dependencyIndex.value).map(r => [r.id, r.score]))
})
const bands = computed(() => state.value ? strataBands(state.value, { includeDropped: showDropped.value, rank: strataRanks.value }) : [])
const strataEdgeList = computed(() => strataEdges(state.value?.dependencies || [], { includeInforms: showInforms.value }))
const ledger = computed(() => state.value ? buildLedger(state.value, { sortByProgress: sortByProgress.value }) : [])
const hasLayers = computed(() => (state.value?.layers.length || 0) > 0)
const windowLabel = computed(() => {
  const model = timelineModel.value
  if (!model || !model.columns.length) return ''
  return `${model.columns[0].label} – ${model.columns[model.columns.length - 1].label}`
})

const LENS_ICONS: Record<Lens, string> = {
  timeline: 'tabler:timeline',
  horizons: 'tabler:layout-columns',
  strata: 'tabler:stack-2',
  outcomes: 'tabler:target-arrow',
}

// ── State write path ──
function setState(next: RoadmapState, committed = false) {
  const reconciled = reconcilePendingMoves(next, pendingMoves, committed)
  const settings = reconciled.settings || DEFAULT_SETTINGS
  state.value = {
    entry_id: reconciled.entry_id || entryId.value,
    thread_id: reconciled.thread_id || '',
    settings: {
      period_kind: settings.period_kind || 'quarter',
      origin: settings.origin || '',
      columns: Math.max(1, Number(settings.columns) || DEFAULT_SETTINGS.columns),
      default_lens: settings.default_lens || 'timeline',
      lens_state: settings.lens_state || {},
    },
    current_period: reconciled.current_period || '',
    current_position: typeof reconciled.current_position === 'number' ? reconciled.current_position : undefined,
    layers: reconciled.layers || [],
    outcomes: reconciled.outcomes || [],
    initiatives: reconciled.initiatives || [],
    dependencies: reconciled.dependencies || [],
    milestones: reconciled.milestones || [],
    counts: reconciled.counts || { layers: 0, outcomes: 0, initiatives: 0, dependencies: 0, milestones: 0 },
    can_undo: reconciled.can_undo === true,
    can_redo: reconciled.can_redo === true,
  }
  // The saved view is a starting point, not a running instruction: seeding it
  // once leaves a later projection free to arrive without moving the reader.
  if (!viewSeeded) {
    viewSeeded = true
    lensState.value = state.value.settings.lens_state
    lens.value = isFull.value ? state.value.settings.default_lens : 'timeline'
  }
  if (selection.value && !resolveSelection(selection.value)) selection.value = null
}

function resolveSelection(current: Selection): boolean {
  const snapshot = state.value
  if (!snapshot) return false
  const pools: Record<SelectionKind, Array<{ id: string }>> = {
    initiative: snapshot.initiatives,
    dependency: snapshot.dependencies,
    milestone: snapshot.milestones,
    layer: snapshot.layers,
    outcome: snapshot.outcomes,
  }
  return pools[current.kind].some(row => row.id === current.id)
}

async function load(committed = false) {
  if (!entryId.value) { error.value = 'entry id required'; loading.value = false; return }
  const revision = ++loadRevision
  try {
    const next = await client.value.state()
    if (revision !== loadRevision) return
    setState(next, committed)
    error.value = ''
  } catch (err) {
    if (revision !== loadRevision) return
    error.value = err instanceof Error ? err.message : 'Couldn’t load the roadmap.'
  } finally {
    if (revision === loadRevision) loading.value = false
  }
}

function enqueueMutation(task: () => Promise<void>): Promise<void> {
  const queued = mutationTail.then(task)
  mutationTail = queued.catch(err => { error.value = err instanceof Error ? err.message : 'Couldn’t save the change.' })
  return queued
}

async function applyNow(commands: C.Command[], options: { moveRevision?: number } = {}) {
  try {
    setState(await client.value.apply(commands))
    error.value = ''
  } catch (err) {
    if (options.moveRevision !== undefined) {
      forgetPendingRevision(pendingMoves, options.moveRevision)
      await load()
    }
    error.value = err instanceof Error ? err.message : 'Couldn’t save the change.'
  }
}

// Every mutation path in the component funnels through here, so preview mode
// is read-only by construction rather than by remembering to guard each call.
function apply(commands: C.Command[], options: { moveRevision?: number } = {}): Promise<void> {
  if (!canEdit.value || !commands.length) return Promise.resolve()
  return enqueueMutation(() => applyNow(commands, options))
}

async function runHistoryNow(action: 'undo' | 'redo') {
  const snapshot = state.value
  if (!snapshot) return
  if (action === 'undo' && !snapshot.can_undo) return
  if (action === 'redo' && !snapshot.can_redo) return
  try {
    pendingMoves.clear()
    setState(action === 'undo' ? await client.value.undo() : await client.value.redo())
    error.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : `Couldn’t ${action}.`
  }
}

function runHistory(action: 'undo' | 'redo'): Promise<void> {
  if (!canEdit.value) return Promise.resolve()
  return enqueueMutation(() => runHistoryNow(action))
}

// ── Selection ──
function select(kind: SelectionKind, id: string) {
  const current = selection.value
  selection.value = current && current.kind === kind && current.id === id ? null : { kind, id }
  if (selection.value) panelOpen.value = true
  suggestion.value = null
}

function setLens(next: Lens) {
  lens.value = next
}

// ── View defaults ──
const isDefaultLens = computed(() => state.value?.settings.default_lens === lens.value)

// The roadmap's default lens is an editorial choice about how the work should
// first be read, so it is stated once, deliberately, rather than trailed by
// every glance at another lens.
function setDefaultLens() {
  if (isDefaultLens.value) return
  void apply([C.updateSettings({ default_lens: lens.value })])
}

function rememberView() {
  void apply([C.setLensState(lens.value, lensState.value[lens.value] || {})])
}

async function closeMenu() {
  contextMenu.value = null
  await nextTick()
  rootEl.value?.focus()
}

function openViewMenu(event: MouseEvent) {
  contextMenu.value = {
    x: event.clientX,
    y: event.clientY,
    items: [
      { label: 'Set as default lens', action: setDefaultLens, disabled: isDefaultLens.value },
      { label: 'Remember view', action: rememberView },
    ],
  }
}

// ── Mutations ──
function patchEntity(kind: SelectionKind, id: string, patch: Record<string, unknown>) {
  const builders: Record<SelectionKind, (id: string, patch: Record<string, unknown>) => C.Command> = {
    initiative: C.updateInitiative,
    dependency: C.updateDependency,
    milestone: C.updateMilestone,
    layer: C.updateLayer,
    outcome: C.updateOutcome,
  }
  void apply([builders[kind](id, patch)])
}

// The backend refuses a removal while the row is still referenced, so the
// references go in the same batch, ahead of it.
function removalBatch(kind: SelectionKind, id: string): C.Command[] {
  const snapshot = state.value
  if (!snapshot) return []
  if (kind !== 'initiative') {
    const builders: Record<Exclude<SelectionKind, 'initiative'>, (id: string) => C.Command> = {
      dependency: C.removeDependency,
      milestone: C.removeMilestone,
      layer: C.removeLayer,
      outcome: C.removeOutcome,
    }
    return [builders[kind](id)]
  }
  const commands: C.Command[] = []
  for (const dep of snapshot.dependencies) {
    if (dep.from_id === id || dep.to_id === id) commands.push(C.removeDependency(dep.id))
  }
  for (const milestone of snapshot.milestones) {
    if (milestone.initiative_ids.includes(id)) {
      commands.push(C.updateMilestone(milestone.id, { initiative_ids: milestone.initiative_ids.filter(other => other !== id) }))
    }
  }
  commands.push(C.removeInitiative(id))
  return commands
}

function removeEntity(kind: SelectionKind, id: string) {
  const commands = removalBatch(kind, id)
  if (!commands.length) return
  if (selection.value?.id === id) selection.value = null
  void apply(commands)
}

function placeInitiative(id: string, place: { startPeriod?: string; span?: number; layerId?: string }) {
  const command = C.placeInitiative(id, place)
  const revision = ++moveRevision
  rememberPendingMoves(pendingMoves, [command], revision)
  void apply([command], { moveRevision: revision })
}

function addInitiative(layerId?: string) {
  const snapshot = state.value
  if (!snapshot || !snapshot.layers.length) return
  const id = C.uid()
  const layer = layerId || (selectedInitiativeId.value ? snapshot.initiatives.find(i => i.id === selectedInitiativeId.value)?.layer_id : '') || snapshot.layers[0].id
  void apply([C.addInitiative({ id, title: 'New initiative', layerId: layer, startPeriod: snapshot.current_period, status: 'idea' })])
  select('initiative', id)
}

function addLayer() {
  const snapshot = state.value
  if (!snapshot) return
  const id = C.uid()
  const order = snapshot.layers.reduce((max, l) => Math.max(max, l.sort_order), -1) + 1
  void apply([C.addLayer({ id, title: 'New layer', color: LAYER_PALETTE[order % LAYER_PALETTE.length], sortOrder: order })])
  select('layer', id)
}

function addStarterLayers() {
  const commands = STARTER_LAYERS.map((title, index) => C.addLayer({ title, color: LAYER_PALETTE[index % LAYER_PALETTE.length], sortOrder: index }))
  void apply(commands)
}

function addOutcome() {
  const snapshot = state.value
  if (!snapshot) return
  const id = C.uid()
  void apply([C.addOutcome({ id, title: 'New outcome', sortOrder: snapshot.outcomes.length })])
  select('outcome', id)
}

function addMilestone() {
  const snapshot = state.value
  if (!snapshot || !snapshot.current_period) return
  const id = C.uid()
  void apply([C.addMilestone({ id, title: 'New milestone', period: snapshot.current_period })])
  select('milestone', id)
}

function shiftWindow(delta: number) {
  const snapshot = state.value
  if (!snapshot) return
  const origin = shiftPeriod(snapshot.settings.origin, delta, snapshot.settings.period_kind)
  if (origin) void apply([C.updateSettings({ origin })])
}

function setColumns(event: Event) {
  const columns = Math.max(1, Math.round(Number((event.target as HTMLSelectElement).value) || 0))
  void apply([C.updateSettings({ columns })])
}

// ── Horizon scheduling ──
// Horizon is derived, so a card dropped in another column is a proposal about
// its schedule rather than a move; the inspector states the change first.
function proposeSchedule(id: string, horizon: Horizon) {
  const snapshot = state.value
  if (!snapshot) return
  const index = scheduleFor(horizon, snapshot.current_period, snapshot.settings.period_kind)
  if (index === null) return
  select('initiative', id)
  suggestion.value = { id, horizon, period: formatPeriod(index, snapshot.settings.period_kind) }
}

function applySuggestion() {
  const proposal = suggestion.value
  if (!proposal) return
  suggestion.value = null
  placeInitiative(proposal.id, { startPeriod: proposal.period })
}

// ── Context menu ──
function openContext(event: MouseEvent, kind: SelectionKind, id: string) {
  if (!canEdit.value) return
  const items: MenuItem[] = [{ label: 'Open in panel', action: () => select(kind, id) }]
  if (kind === 'initiative') {
    const snapshot = state.value
    const other = selectedInitiativeId.value
    if (other && other !== id) {
      items.push({ label: `Make “${initiativeTitle(other)}” need this`, action: () => void apply([C.addDependency({ fromId: id, toId: other })]) })
      items.push({ label: `Make this need “${initiativeTitle(other)}”`, action: () => void apply([C.addDependency({ fromId: other, toId: id })]) })
    }
    if (snapshot) items.push({ label: 'Add initiative in this layer', action: () => addInitiative(snapshot.initiatives.find(i => i.id === id)?.layer_id) })
  }
  items.push({ label: `Remove ${kind}`, action: () => removeEntity(kind, id), danger: true })
  contextMenu.value = { x: event.clientX, y: event.clientY, items }
}

function initiativeTitle(id: string): string {
  return state.value?.initiatives.find(i => i.id === id)?.title || id
}

function openAddMenu(event: MouseEvent) {
  contextMenu.value = {
    x: event.clientX,
    y: event.clientY,
    items: [
      { label: 'Initiative', action: () => addInitiative() },
      { label: 'Layer', action: () => addLayer() },
      { label: 'Outcome', action: () => addOutcome() },
      { label: 'Milestone', action: () => addMilestone() },
    ],
  }
}

// ── Keyboard ──
function consume(event: KeyboardEvent) { event.preventDefault(); event.stopPropagation() }

function onKeyDown(event: KeyboardEvent) {
  if (!isFull.value) return
  if (isEditingTarget(event.target)) {
    if (event.key === 'Escape') {
      const el = event.target as HTMLElement
      if (typeof el.blur === 'function') el.blur()
      consume(event)
    }
    return
  }
  const next = resolveLens({ key: event.key, ctrlKey: event.ctrlKey, metaKey: event.metaKey, shiftKey: event.shiftKey, altKey: event.altKey, target: event.target })
  if (next) { consume(event); setLens(next); return }

  const action = resolveAction({ key: event.key, ctrlKey: event.ctrlKey, metaKey: event.metaKey, shiftKey: event.shiftKey, target: event.target })
  if (!canEdit.value && ['undo', 'redo', 'delete'].includes(action || '')) return
  if (action === 'undo') { consume(event); void runHistory('undo') }
  else if (action === 'redo') { consume(event); void runHistory('redo') }
  else if (action === 'delete') {
    if (selection.value) { consume(event); removeEntity(selection.value.kind, selection.value.id) }
  } else if (action === 'escape') {
    if (contextMenu.value) { consume(event); contextMenu.value = null }
    else if (suggestion.value) { consume(event); suggestion.value = null }
    else if (selection.value) { consume(event); selection.value = null }
  }
}

// ── Lifecycle ──
let off: Array<() => void> = []
onMounted(async () => {
  await load()
  const threadId = state.value?.thread_id
  if (threadId) {
    try { off.push(on(projectionTopic(threadId, PROJECTION_KIND), () => { void load(true) })) } catch { error.value = 'Live updates are unavailable. Reload to read the latest roadmap.' }
  }
})
onBeforeUnmount(() => {
  const failures: unknown[] = []
  for (const fn of off) { try { fn() } catch (err) { failures.push(err) } }
  off = []
  if (failures.length) throw new AggregateError(failures, 'Couldn’t close live updates.')
})
</script>

<template>
  <div ref="rootEl" class="rm" :class="{ 'rm--preview': !isFull }" tabindex="0" @keydown="onKeyDown">
    <header class="rm-top">
      <span class="rm-brand">
        <Icon icon="tabler:map-2" aria-hidden="true" />
        <span>Roadmap</span>
      </span>

      <nav v-if="isFull" class="rm-lenses" aria-label="Lens">
        <button
          v-for="option in LENSES"
          :key="option"
          class="rm-lens-btn"
          :class="{ 'is-active': lens === option }"
          :aria-pressed="lens === option"
          :title="`${option[0].toUpperCase() + option.slice(1)} lens`"
          :aria-label="`${option[0].toUpperCase() + option.slice(1)} lens`"
          @click="setLens(option)"
        >
          <Icon :icon="LENS_ICONS[option]" aria-hidden="true" />
          <span>{{ option[0].toUpperCase() + option.slice(1) }}</span>
        </button>
      </nav>

      <span class="rm-spacer"></span>

      <div v-if="isFull && state" class="rm-tools">
        <template v-if="lens === 'timeline'">
          <button class="rm-icon-btn" title="Earlier window" aria-label="Earlier window" @click="shiftWindow(-1)"><Icon icon="tabler:chevron-left" aria-hidden="true" /></button>
          <span class="rm-window">{{ windowLabel }}</span>
          <button class="rm-icon-btn" title="Later window" aria-label="Later window" @click="shiftWindow(1)"><Icon icon="tabler:chevron-right" aria-hidden="true" /></button>
          <select class="rm-select" :value="state.settings.columns" title="Visible periods" aria-label="Visible periods" @change="setColumns">
            <option v-for="n in [3, 4, 5, 6, 8, 12]" :key="n" :value="n">{{ n }} cols</option>
          </select>
          <button class="rm-chip-btn" :class="{ 'is-on': showDropped }" @click="toggleLensFlag('timeline', 'dropped')">Dropped</button>
        </template>
        <template v-else-if="lens === 'horizons'">
          <button class="rm-chip-btn" :class="{ 'is-on': showPast }" @click="toggleLensFlag('horizons', 'past')">Shipped</button>
        </template>
        <template v-else-if="lens === 'strata'">
          <button class="rm-chip-btn" :class="{ 'is-on': showInforms }" @click="toggleLensFlag('strata', 'informs')">Informs</button>
          <button class="rm-chip-btn" :class="{ 'is-on': criticalRank }" @click="toggleLensFlag('strata', 'critical')">Critical</button>
        </template>
        <template v-else>
          <button class="rm-chip-btn" :class="{ 'is-on': sortByProgress }" @click="toggleLensFlag('outcomes', 'progress')">Sort by progress</button>
        </template>

        <button class="rm-icon-btn rm-more-btn" title="View options" aria-label="View options" @click="openViewMenu"><Icon icon="tabler:dots" aria-hidden="true" /></button>

        <span class="rm-vsep"></span>
        <button v-if="canEdit" class="rm-icon-btn" title="Add" aria-label="Add" @click="openAddMenu"><Icon icon="tabler:plus" aria-hidden="true" /></button>
        <button v-if="canEdit" class="rm-icon-btn" :disabled="!state.can_undo" title="Undo" aria-label="Undo" @click="runHistory('undo')"><Icon icon="tabler:arrow-back-up" aria-hidden="true" /></button>
        <button v-if="canEdit" class="rm-icon-btn" :disabled="!state.can_redo" title="Redo" aria-label="Redo" @click="runHistory('redo')"><Icon icon="tabler:arrow-forward-up" aria-hidden="true" /></button>
        <button class="rm-icon-btn" :class="{ 'is-on': panelOpen }" title="Toggle panel" aria-label="Toggle panel" @click="panelOpen = !panelOpen"><Icon icon="tabler:layout-sidebar-right" aria-hidden="true" /></button>
      </div>
    </header>

    <div v-if="error" class="rm-error" role="status">
      <span>{{ error }}</span>
      <button class="rm-icon-btn" title="Dismiss" aria-label="Dismiss" @click="error = ''"><Icon icon="tabler:x" aria-hidden="true" /></button>
    </div>

    <div class="rm-body">
      <main class="rm-stage">
        <p v-if="loading" class="rm-status">Loading the roadmap…</p>
        <EmptyState
          v-else-if="state && !hasLayers"
          :editable="canEdit"
          :starter="STARTER_LAYERS"
          @add-layer="addLayer"
          @add-starter="addStarterLayers"
        />
        <TimelineLens
          v-else-if="state && lens === 'timeline' && timelineModel"
          :state="state"
          :model="timelineModel"
          :selected-id="selectedInitiativeId"
          :trace="trace"
          :editable="canEdit"
          :compact="!isFull"
          @select="select"
          @place="placeInitiative"
          @context="openContext"
        />
        <HorizonsLens
          v-else-if="state && lens === 'horizons'"
          :columns="horizonColumns"
          :period-kind="state.settings.period_kind"
          :selected-id="selectedInitiativeId"
          :trace="trace"
          :editable="canEdit"
          @select="select"
          @schedule="proposeSchedule"
          @context="openContext"
        />
        <StrataLens
          v-else-if="state && lens === 'strata'"
          :bands="bands"
          :edges="strataEdgeList"
          :selected-id="selectedInitiativeId"
          :trace="trace"
          :ranks="strataRanks"
          @select="select"
          @context="openContext"
        />
        <OutcomesLens
          v-else-if="state"
          :cards="ledger"
          :layers="state.layers"
          :period-kind="state.settings.period_kind"
          :selected-id="selectedInitiativeId"
          :trace="trace"
          @select="select"
          @context="openContext"
        />
      </main>

      <Inspector
        v-if="isFull && panelOpen && state"
        :state="state"
        :selection="selection"
        :trace="trace"
        :editable="canEdit"
        :suggestion="suggestion"
        @patch="patchEntity"
        @remove="removeEntity"
        @select="select"
        @apply-suggestion="applySuggestion"
        @dismiss-suggestion="suggestion = null"
        @close="panelOpen = false"
      />
    </div>

    <footer v-if="!isFull && state" class="rm-foot">
      <span>{{ state.counts.initiatives }} initiatives across {{ state.counts.layers }} layers</span>
      <span v-if="state.current_period">{{ periodLabel(state.current_period, state.settings.period_kind) }}</span>
    </footer>

    <ContextMenu
      v-if="contextMenu"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :items="contextMenu.items"
      @close="closeMenu"
    />
  </div>
</template>
