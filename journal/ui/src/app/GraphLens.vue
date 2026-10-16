<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import LayoutWorker from './layout-worker?worker&inline'
import { FAMILY_LABELS, FAMILY_ORDER, familyMark, isPresenceEdge, nodeFamily } from './force-layout'
import FamilyMark from './FamilyMark.vue'
import type { NodeFamily } from './force-layout'
import { LayoutEngine, EMPTY_PLACEMENT, positionOf } from './layout-engine'
import type { Placement } from './layout-engine'
import { buildScene, drawScene, hitPort, hitTest } from './graph-draw'
import type { Palette, PresencePin, Scene } from './graph-draw'
import { createProbe, readPalette, watchTheme } from './palette'
import { clampZoom, detailFor, fitTransform, layoutWorld, toWorld, zoomAbout } from './view'
import type { Transform } from './view'
import { isAgentNode } from './tree'
import { assemblyDetail, assemblySummary } from './assembly'
import type { AssemblyRun } from './assembly'
import type { ViewportMemory } from './navigation'
import type { AgentPresence, GraphEdge, GraphNode, WholeGraphLoad } from './types'

const props = defineProps<{
  readOnly?: boolean
  nodes: GraphNode[]
  edges: GraphEdge[]
  presence: AgentPresence[]
  touchedIds?: Set<string>
  selectedId?: string
  omittedNodes?: number
  omittedEdges?: number
  loading?: boolean
  assembly?: AssemblyRun | null
  assembling?: boolean
  whole?: WholeGraphLoad | null
  /** Names for records outside this canvas, so a cut relation can say where it goes. */
  labels?: ReadonlyMap<string, string>
  /** Sessions and last activity per record, from the work-span store. */
  activity?: ReadonlyMap<string, { sessions: number; lastActivityAt: number }>
  /** How this lens last had this focus arranged, when the reader has been here before. */
  viewport?: ViewportMemory | null
  now: number
}>()
const emit = defineEmits<{
  select: [id: string]
  focus: [id: string]
  port: [id: string]
  menu: [id: string, event: MouseEvent]
  recompute: []
  loadAll: []
  cancelLoad: []
  viewport: [value: ViewportMemory]
}>()

const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const probe = ref<HTMLElement | null>(null)
let inkProbe: HTMLElement | null = null
const viewport = ref({ width: 900, height: 620 })
const transform = ref<Transform>({ zoom: 1, x: 0, y: 0 })
const hovered = ref('')
const mutedFamily = ref<NodeFamily | ''>('')
const showRegions = ref(true)
const solving = ref(false)
const solveMs = ref(0)
const drawn = ref({ nodes: 0, edges: 0, labels: 0, territories: 0, territoriesHeld: 0 })
const held = shallowRef(new Map<string, { px: number; py: number }>())
const panState = ref<{ x: number; y: number; from: Transform } | null>(null)
const scene = shallowRef<Scene | null>(null)
const placement = shallowRef<Placement>(EMPTY_PLACEMENT)

let engine: LayoutEngine | null = null
let palette: Palette | null = null
let context: CanvasRenderingContext2D | null = null
let observer: ResizeObserver | undefined
let stopTheme: (() => void) | undefined
let frame = 0
let solveTimer: ReturnType<typeof setTimeout> | undefined
/** A reader who has moved the view owns it; only they give it back. */
let reader = false

let dragState: { id: string; offsetX: number; offsetY: number; moved: boolean } | null = null
/**
 * A gesture that travelled is a pan or a placement, never a press. The distance
 * outlives the gesture because `click` and `dblclick` are delivered after
 * `pointerup`, and a graph that descends on the end of a drag is unusable.
 */
let travel = 0
let gestureStart = { x: 0, y: 0 }
const PRESS_SLOP = 4

// Presence is its own layer over the topology, so agent records never take a
// slot in the knowledge graph.
const knowledgeNodes = computed(() => props.nodes.filter(node => !isAgentNode(node)))
const knowledgeEdges = computed(() => {
  const agents = new Set(props.nodes.filter(isAgentNode).map(node => node.id))
  return props.edges.filter(edge => !isPresenceEdge(edge) && !agents.has(edge.from) && !agents.has(edge.to))
})

const families = computed(() => {
  const counts = new Map<NodeFamily, number>()
  for (const node of knowledgeNodes.value) {
    const family = nodeFamily(node.kind)
    counts.set(family, (counts.get(family) || 0) + 1)
  }
  return FAMILY_ORDER.filter(family => counts.has(family)).map(family => ({ family, count: counts.get(family) || 0 }))
})

/**
 * Landmarks keep names on screen when the reader is zoomed out. The set comes
 * from the projection alone — never from hover or selection — so reading the
 * graph never moves it.
 */
const emphasis = computed(() => {
  const ids = new Set<string>()
  for (const item of props.presence) if (item.positionId) ids.add(item.positionId)
  return ids
})

const pins = computed<PresencePin[]>(() => props.presence
  .filter(agent => agent.positionId)
  .map(agent => ({ id: agent.id, nodeId: agent.positionId!, initials: agent.initials, label: agent.label, stale: agent.stale })))

const detail = computed(() => detailFor(transform.value.zoom, drawn.value.nodes || knowledgeNodes.value.length))
const zoomPercent = computed(() => Math.round(transform.value.zoom * 100))
const detailLabel = computed(() => detail.value === 'envelope' ? 'territories'
  : detail.value === 'dot' ? 'marks' : detail.value === 'mark' ? 'marks and landmarks' : 'full detail')

const clock = ref(Math.floor(Date.now() / 1000))
let clockTimer: ReturnType<typeof setInterval> | undefined
const assemblyLine = computed(() => assemblySummary(props.assembly, clock.value))
const assemblyTitle = computed(() => assemblyDetail(props.assembly))

const outside = computed(() => (props.omittedNodes || 0) + (props.omittedEdges || 0))
const loadRatio = computed(() => {
  const whole = props.whole
  if (!whole || !whole.total) return 0
  return Math.min(1, whole.loaded / whole.total)
})

// The card answers a pointer, not a selection: the orbit panel already holds
// the selected record, and a second copy of it would sit over the graph.
const hoveredNode = computed(() => hovered.value
  ? props.nodes.find(node => node.id === hovered.value) || null
  : null)

function schedule() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    paint()
  })
}

function paint() {
  const value = scene.value
  if (!context || !canvas.value || !palette || !value) return
  const ratio = Math.min(2, window.devicePixelRatio || 1)
  const width = Math.round(viewport.value.width * ratio)
  const height = Math.round(viewport.value.height * ratio)
  if (canvas.value.width !== width || canvas.value.height !== height) {
    canvas.value.width = width
    canvas.value.height = height
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  drawn.value = drawScene(context, value, transform.value, viewport.value, palette, {
    detail: detailFor(transform.value.zoom, value.nodes.length),
    now: props.now,
    selectedId: props.selectedId || '',
    hoveredId: hovered.value,
    mutedFamily: mutedFamily.value,
    touched: props.touchedIds || new Set<string>(),
    showRegions: showRegions.value,
    pins: pins.value,
  })
}

async function solve(fresh = false, unpin = false) {
  if (!engine) return
  const nodes = knowledgeNodes.value
  const edges = knowledgeEdges.value
  const world = layoutWorld(nodes.length, viewport.value)
  solving.value = true
  const result = await engine.solve({
    nodes,
    edges,
    width: world.width,
    height: world.height,
    emphasis: emphasis.value,
    held: held.value,
    fresh,
    unpin,
  })
  // A superseded solve answers nothing: a newer one is already running and its
  // layout is the one this canvas will paint. Painting this one would put a
  // graph on screen that the projection has already moved past.
  if (!result) return
  solving.value = false
  solveMs.value = result.ms
  placement.value = result
  scene.value = buildScene(result, nodes, edges, props.labels || new Map(), props.activity || new Map())
  if (!reader) fit()
  schedule()
}

function queueSolve(fresh = false) {
  clearTimeout(solveTimer)
  solveTimer = setTimeout(() => { void solve(fresh) }, 60)
}

function fit() {
  const value = scene.value
  transform.value = fitTransform(value?.bounds || null, viewport.value)
}

/**
 * Hands the arrangement the reader has made back to the navigator, so returning
 * to this focus returns them to the view they left rather than to a fresh fit.
 */
function remember() {
  emit('viewport', { zoom: transform.value.zoom, x: transform.value.x, y: transform.value.y })
}

/** Gives the view back to the graph. */
function resetView() {
  reader = false
  fit()
  remember()
  schedule()
}

function stepZoom(factor: number) {
  reader = true
  transform.value = zoomAbout(transform.value, factor, viewport.value.width / 2, viewport.value.height / 2)
  remember()
  schedule()
}

function centreSelection() {
  const id = props.selectedId
  const point = id ? positionOf(placement.value, id) : null
  if (!point) { resetView(); return }
  reader = true
  const zoom = clampZoom(Math.max(transform.value.zoom, 1.2))
  transform.value = { zoom, x: viewport.value.width / 2 - point.x * zoom, y: viewport.value.height / 2 - point.y * zoom }
  remember()
  schedule()
}

function release() {
  held.value = new Map()
  queueSolve()
}

/**
 * Lays the whole graph out afresh and fits it to the pane. Remembered and
 * persisted coordinates are set aside for this solve — the reader pressed the
 * button because the current arrangement stopped serving them — and nothing is
 * written back, so the stored arrangement survives untouched.
 */
function relayout() {
  held.value = new Map()
  reader = false
  void solve(true, true)
}

function toggleFamily(family: NodeFamily) {
  mutedFamily.value = mutedFamily.value === family ? '' : family
  schedule()
}

function pointerWorld(event: PointerEvent | WheelEvent | MouseEvent): { x: number; y: number } {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }
  return toWorld(transform.value, event.clientX - rect.left, event.clientY - rect.top)
}

function onWheel(event: WheelEvent) {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  reader = true
  transform.value = zoomAbout(transform.value, event.deltaY > 0 ? 0.9 : 1.1, event.clientX - rect.left, event.clientY - rect.top)
  remember()
  schedule()
}

function onPointerDown(event: PointerEvent) {
  const point = pointerWorld(event)
  ;(event.currentTarget as Element).setPointerCapture(event.pointerId)
  travel = 0
  gestureStart = { x: event.clientX, y: event.clientY }
  // A press on a port jumps and a drag from a port pans, so the gesture starts
  // as a pan either way and the press is decided when it ends.
  const onPort = Boolean(scene.value && hitPort(scene.value, point.x, point.y))
  const id = !onPort && scene.value ? hitTest(scene.value, point.x, point.y) : ''
  if (id) {
    const at = placement.value.index.get(id)!
    dragState = { id, offsetX: placement.value.positions[at * 2] - point.x, offsetY: placement.value.positions[at * 2 + 1] - point.y, moved: false }
    return
  }
  panState.value = { x: event.clientX, y: event.clientY, from: { ...transform.value } }
}

function onPointerMove(event: PointerEvent) {
  if (dragState || panState.value) {
    travel = Math.max(travel, Math.hypot(event.clientX - gestureStart.x, event.clientY - gestureStart.y))
  }
  if (dragState) {
    const point = pointerWorld(event)
    const next = new Map(held.value)
    next.set(dragState.id, { px: point.x + dragState.offsetX, py: point.y + dragState.offsetY })
    held.value = next
    dragState.moved = true
    // The dragged record moves with the pointer immediately; the solve that
    // relaxes its neighbours around it lands when the drag ends.
    const at = placement.value.index.get(dragState.id)
    if (at !== undefined) {
      placement.value.positions[at * 2] = point.x + dragState.offsetX
      placement.value.positions[at * 2 + 1] = point.y + dragState.offsetY
      const node = scene.value?.nodes[at]
      if (node) { node.x = point.x + dragState.offsetX; node.y = point.y + dragState.offsetY }
    }
    schedule()
    return
  }
  if (panState.value) {
    reader = true
    transform.value = {
      zoom: panState.value.from.zoom,
      x: panState.value.from.x + event.clientX - panState.value.x,
      y: panState.value.from.y + event.clientY - panState.value.y,
    }
    schedule()
    return
  }
  const point = pointerWorld(event)
  const id = scene.value ? hitTest(scene.value, point.x, point.y) : ''
  if (id !== hovered.value) { hovered.value = id; schedule() }
}

function onPointerUp() {
  if (panState.value) remember()
  panState.value = null
  if (dragState?.moved) queueSolve()
  dragState = null
}

/**
 * True when the gesture that just ended moved the canvas or a record. The
 * distance is cleared by the next `pointerdown`, never by reading it, because
 * `click` is delivered before `dblclick` and clearing it here would let the
 * second one through.
 */
function dragged(): boolean { return travel > PRESS_SLOP }

/** A drag places a record; only a stationary press selects one. */
function onClick(event: MouseEvent) {
  if (dragged()) return
  const point = pointerWorld(event)
  const port = scene.value ? hitPort(scene.value, point.x, point.y) : null
  if (port) { emit('port', port.targetId); return }
  const id = scene.value ? hitTest(scene.value, point.x, point.y) : ''
  if (id) emit('select', id)
}

function onDoubleClick(event: MouseEvent) {
  if (dragged()) return
  const point = pointerWorld(event)
  const id = scene.value ? hitTest(scene.value, point.x, point.y) : ''
  if (id) emit('focus', id)
}

function onContextMenu(event: MouseEvent) {
  const point = pointerWorld(event)
  const id = scene.value ? hitTest(scene.value, point.x, point.y) : ''
  if (id) emit('menu', id, event)
}

function refreshPalette() {
  if (!inkProbe) return
  palette = readPalette(inkProbe)
  schedule()
}

onMounted(() => {
  engine = new LayoutEngine(() => new LayoutWorker())
  context = canvas.value?.getContext('2d') || null
  if (probe.value) {
    inkProbe = createProbe(document)
    probe.value.appendChild(inkProbe)
  }
  nextTick(refreshPalette)
  stopTheme = watchTheme(refreshPalette)
  clockTimer = setInterval(() => { clock.value = Math.floor(Date.now() / 1000) }, 30000)
  observer = new ResizeObserver(entries => {
    const box = entries[0]?.contentRect
    if (!box) return
    const next = { width: Math.max(200, Math.round(box.width)), height: Math.max(160, Math.round(box.height)) }
    if (next.width === viewport.value.width && next.height === viewport.value.height) return
    viewport.value = next
    // The world the layout solves in takes the pane's shape, so a resize that
    // changes the aspect ratio has to be re-solved for the fit to stay honest.
    queueSolve()
  })
  if (host.value) observer.observe(host.value)
  void solve()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = undefined
  stopTheme?.()
  stopTheme = undefined
  if (clockTimer) clearInterval(clockTimer)
  clockTimer = undefined
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  clearTimeout(solveTimer)
  solveTimer = undefined
  // Dropping the probe releases the element and makes a palette read that was
  // already queued a no-op, so nothing schedules a frame on a gone canvas.
  inkProbe = null
  engine?.dispose()
  engine = null
})

/**
 * Re-entering a focus this lens has read before opens it where the reader left
 * it. A restored view is the reader's own, so the next solve leaves it alone
 * rather than fitting the graph over it.
 */
watch(() => props.viewport, memory => {
  if (!memory || memory.zoom === undefined) return
  reader = true
  transform.value = { zoom: clampZoom(memory.zoom), x: memory.x || 0, y: memory.y || 0 }
  schedule()
}, { immediate: true })

watch(() => [props.nodes, props.edges], () => queueSolve())

/**
 * A completed whole-graph load ends with a from-scratch arrangement. The
 * streaming chunks were seated against the window's layout to keep the screen
 * steady while records poured in; the reader asked for the whole graph, so the
 * finished graph earns the layout its full size asks for, fitted to the pane.
 */
watch(() => props.whole?.done, (done, was) => {
  if (!done || was) return
  reader = false
  void solve(true)
})
watch(() => props.selectedId, schedule)
watch(() => props.touchedIds, schedule)
watch(() => props.presence, schedule)
watch(() => props.activity, () => {
  const value = scene.value
  if (value) for (const node of value.nodes) {
    const stats = props.activity?.get(node.id)
    node.sessions = stats?.sessions || 0
    node.lastWorkedAt = stats?.lastActivityAt || 0
  }
  schedule()
})
</script>

<template>
  <section ref="host" class="jr-graph" aria-label="Knowledge graph">
    <canvas
      ref="canvas" class="jr-graph-canvas" :class="{ grabbing: panState }"
      role="application" aria-label="Bounded knowledge graph"
      @wheel.prevent="onWheel"
      @pointerdown="onPointerDown" @pointermove="onPointerMove"
      @pointerup="onPointerUp" @pointercancel="onPointerUp"
      @pointerleave="hovered = ''; schedule()"
      @click="onClick" @dblclick.prevent="onDoubleClick" @contextmenu.prevent="onContextMenu"
    />
    <div ref="probe" class="jr-ink-probe-host" aria-hidden="true"></div>

    <div class="jr-canvas-head">
      <div class="jr-canvas-stat">
        <b>{{ nodes.length.toLocaleString() }}</b><span>records</span>
        <i aria-hidden="true"></i>
        <b>{{ edges.length.toLocaleString() }}</b><span>relations</span>
        <template v-if="pins.length">
          <i aria-hidden="true"></i><b>{{ pins.length }}</b><span>agents here</span>
        </template>
      </div>
      <p class="jr-canvas-drawn jr-numeric">
        Drawing {{ drawn.nodes.toLocaleString() }} on screen at {{ detailLabel }}
        <template v-if="drawn.territories"> · {{ drawn.territories }} territories named</template>
        <template v-if="drawn.territoriesHeld"> of {{ (drawn.territories + drawn.territoriesHeld).toLocaleString() }}</template>
        <template v-if="solveMs"> · laid out in {{ solveMs }}ms</template>
      </p>
    </div>

    <!-- A bounded window is a reading aid, never a wall: the rest is one press away. -->
    <div v-if="outside || whole?.running || whole?.error || whole?.cancelled || whole?.done" class="jr-bound-dock" role="group" aria-label="Whole graph">
      <template v-if="whole?.running">
        <p class="jr-bound-line">
          <span class="jr-bound-label">Loading the whole graph</span>
          <b class="jr-numeric">{{ whole.loaded.toLocaleString() }} / {{ whole.total.toLocaleString() }}</b>
          <span class="jr-numeric">· {{ whole.chunks }} chunk{{ whole.chunks === 1 ? '' : 's' }}</span>
        </p>
        <div class="jr-bound-bar"><i :style="{ width: `${Math.round(loadRatio * 100)}%` }"></i></div>
        <button class="jr-bound-stop" @click="emit('cancelLoad')">
          <Icon icon="tabler:player-stop" aria-hidden="true" /> Stop
        </button>
      </template>
      <template v-else-if="outside">
        <p class="jr-bound-line">
          <span class="jr-bound-label">Window bounded</span>
          <b class="jr-numeric">{{ (omittedNodes || 0).toLocaleString() }}</b><span>records</span>
          <span class="jr-numeric">and</span>
          <b class="jr-numeric">{{ (omittedEdges || 0).toLocaleString() }}</b><span>relations outside</span>
        </p>
        <button class="jr-bound-load" @click="emit('loadAll')">
          <Icon icon="tabler:arrow-bar-to-down" aria-hidden="true" /> Load all
        </button>
      </template>
      <template v-else-if="whole?.error">
        <p class="jr-bound-line error">{{ whole.error }}</p>
        <button class="jr-bound-load" @click="emit('loadAll')"><Icon icon="tabler:refresh" aria-hidden="true" /> Try again</button>
      </template>
      <template v-else-if="whole?.cancelled">
        <p class="jr-bound-line">
          <span class="jr-bound-label">Stopped</span>
          <b class="jr-numeric">{{ whole.loaded.toLocaleString() }}</b><span>loaded</span>
        </p>
        <button class="jr-bound-load" @click="emit('loadAll')"><Icon icon="tabler:arrow-bar-to-down" aria-hidden="true" /> Continue</button>
      </template>
      <template v-else-if="whole?.done">
        <p class="jr-bound-line">
          <span class="jr-bound-label">Fully loaded</span>
          <b class="jr-numeric">{{ whole.loaded.toLocaleString() }}</b><span>records and relations</span>
          <template v-if="scene && scene.ports.length">
            <span class="jr-numeric">·</span>
            <b class="jr-numeric">{{ scene.ports.length }}</b><span>ports out</span>
          </template>
        </p>
      </template>
    </div>

    <div class="jr-legend" role="group" aria-label="Highlight a record family">
      <button
        v-for="item in families" :key="item.family"
        :class="['jr-legend-item', `family-${item.family}`, { on: mutedFamily === item.family }]"
        :aria-pressed="mutedFamily === item.family"
        :title="`Highlight ${FAMILY_LABELS[item.family].toLowerCase()}`"
        @click="toggleFamily(item.family)"
      >
        <FamilyMark class="jr-legend-mark" :family="item.family" :radius="7.2" view-box="-11 -11 22 22" />
        <span>{{ FAMILY_LABELS[item.family] }}</span>
        <em class="jr-numeric">{{ item.count.toLocaleString() }}</em>
      </button>
    </div>

    <div class="jr-canvas-tools">
      <button class="jr-tool" :class="{ on: showRegions }" aria-label="Toggle branch territories" title="Branch territories" @click="showRegions = !showRegions; schedule()">
        <Icon icon="tabler:chart-area-line" aria-hidden="true" />
      </button>
      <button class="jr-tool" :class="{ on: held.size > 0 }" :disabled="!held.size" aria-label="Release held records" title="Release held records" @click="release">
        <Icon icon="tabler:pinned-off" aria-hidden="true" />
      </button>
      <button class="jr-tool" :disabled="solving" aria-label="Re-layout the graph" title="Re-layout: arrange the whole graph afresh and fit it to the pane" @click="relayout">
        <Icon icon="tabler:refresh" aria-hidden="true" />
      </button>
      <i class="jr-tool-divider" aria-hidden="true"></i>
      <button class="jr-tool" aria-label="Zoom out" title="Zoom out" @click="stepZoom(.82)"><Icon icon="tabler:minus" aria-hidden="true" /></button>
      <span class="jr-zoom-value jr-numeric">{{ zoomPercent }}%</span>
      <button class="jr-tool" aria-label="Zoom in" title="Zoom in" @click="stepZoom(1.22)"><Icon icon="tabler:plus" aria-hidden="true" /></button>
      <i class="jr-tool-divider" aria-hidden="true"></i>
      <button class="jr-tool" aria-label="Centre the selected record" title="Centre selection" @click="centreSelection"><Icon icon="tabler:focus-2" aria-hidden="true" /></button>
      <button class="jr-tool" aria-label="Fit the graph to the canvas" title="Fit to canvas" @click="resetView"><Icon icon="tabler:arrows-maximize" aria-hidden="true" /></button>
    </div>

    <figure v-if="hoveredNode" class="jr-hovercard" :class="`family-${nodeFamily(hoveredNode.kind)}`">
      <figcaption>
        <span class="jr-hovercard-kind">{{ hoveredNode.kind.replace(/_/g, ' ') }}</span>
        <b>{{ hoveredNode.label }}</b>
      </figcaption>
      <p v-if="hoveredNode.summary">{{ hoveredNode.summary }}</p>
      <dl>
        <div><dt>Children</dt><dd>{{ hoveredNode.child_count }}</dd></div>
        <div><dt>Revision</dt><dd>{{ hoveredNode.revision }}</dd></div>
        <div v-if="hoveredNode.status"><dt>State</dt><dd>{{ hoveredNode.status }}</dd></div>
      </dl>
    </figure>

    <div class="jr-assemble-dock">
      <p class="jr-assemble-line" :title="assemblyTitle">
        <span :class="['jr-assemble-state', { busy: assembling || solving }]" aria-hidden="true"></span>
        {{ solving ? 'Laying out the graph…' : assemblyLine }}
      </p>
      <button
        v-if="!readOnly" class="jr-assemble-run" :disabled="assembling"
        :aria-busy="assembling ? 'true' : 'false'"
        :title="assembling ? 'An assembly pass is already running' : 'Derive every relation the records state, then propose the rest'"
        @click="emit('recompute')"
      >
        <span v-if="assembling" class="jr-spinner" aria-hidden="true" />
        <Icon v-else icon="tabler:topology-star-ring-3" aria-hidden="true" />
        <span>{{ assembling ? 'Assembling…' : 'Recompute map' }}</span>
      </button>
    </div>

    <div v-if="loading && !nodes.length" class="jr-canvas-state" role="status">
      <span class="jr-spinner" aria-hidden="true" />
      <h3>Projecting the window</h3>
      <p>Reading the bounded graph around the current focus.</p>
    </div>
    <div v-else-if="!nodes.length" class="jr-canvas-state">
      <svg class="jr-canvas-state-mark" viewBox="-30 -30 60 60" aria-hidden="true">
        <path :d="familyMark('anchor', 11)" transform="translate(-16 -8)" />
        <path :d="familyMark('rule', 9)" transform="translate(14 -12)" />
        <path :d="familyMark('evidence', 8)" transform="translate(2 14)" />
      </svg>
      <h3>Nothing in this window</h3>
      <p>This focus level holds no records yet. Step out, or pick another graph from the navigator.</p>
    </div>
  </section>
</template>
