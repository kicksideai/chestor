import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, triggerRef, watch } from 'vue'
import type { ComputedRef } from 'vue'
import { on } from '@wippy-fe/proxy'
import { JournalApi } from './api'
import { isAssemblyRunning } from './assembly'
import type { AssemblyRun } from './assembly'
import { spanTaskId } from './lanes'
import { loadWholeGraph, progressOf } from './load-all'
import type { Cancellation } from './load-all'
import { LENS_KEYS, NavigationStore, decodeRoute, graphOf, recordOf } from './navigation'
import type { Focus, Lens, Place, ViewportMemory } from './navigation'
import { mergePresence, touchedNodeIds } from './presence'
import { isFolded, isSettled } from './tree'
import type {
  ActivityBucket, GraphEdge, GraphNode, GraphWindow, HealthState, JournalCursor, JournalGraph,
  JournalEvent, JournalTask, SearchMode, TimelineItem, WholeGraphLoad, WorkSpan,
  WorkControlState,
} from './types'

const IDLE_LOAD: WholeGraphLoad = {
  running: false, loaded: 0, total: 0, chunks: 0, done: false, cancelled: false, error: '',
}

export function useJournal(entryId: ComputedRef<string>) {
  const client = computed(() => new JournalApi(entryId.value))

  const navigation = new NavigationStore(decodeRoute(''))
  const place = ref<Place>(navigation.place)
  const sync = () => { place.value = { lens: navigation.lens, focus: [...navigation.focus] } }
  /**
   * How the current lens last had the current focus arranged. The lenses read
   * it to reopen a place the way the reader left it, and write back to it as
   * the reader rearranges one.
   */
  const viewport = ref<ViewportMemory>({})

  const graphs = ref<JournalGraph[]>([])
  const graphWindow = shallowRef<GraphWindow | null>(null)
  /** Records loaded past the window, from a whole-graph or branch read. */
  const wholeNodes = shallowRef<GraphNode[] | null>(null)
  const wholeEdges = shallowRef<GraphEdge[] | null>(null)
  const wholeLoad = ref<WholeGraphLoad>({ ...IDLE_LOAD })
  const health = ref<HealthState>({ status: 'unknown' })
  const cursors = ref<JournalCursor[]>([])
  const spans = ref<WorkSpan[]>([])
  const workControl = ref<WorkControlState>({
    now: 0, leases: [], resumable: [],
    counts: { active: 0, write: 0, planning: 0, resumable: 0 },
    limit: 100, has_more: false,
  })
  const spanCounts = ref<{ open: number; sealed: number; total: number }>({ open: 0, sealed: 0, total: 0 })
  const tasks = ref<JournalTask[]>([])
  const events = ref<JournalEvent[]>([])
  const taskHasMore = ref(false)
  const buckets = ref<ActivityBucket[]>([])
  const bucketWidthS = ref(3600)
  // Every record name this graph has shown, kept so a relation that leaves the
  // open canvas can still say where it goes.
  const labelIndex = ref(new Map<string, string>())
  const stats = ref<Record<string, number>>({})
  const selectedId = ref('')
  const loading = ref(true)
  const error = ref('')
  const query = ref('')
  const searchMode = ref<SearchMode>('hybrid')
  const searchResults = ref<GraphNode[]>([])
  const searchLoading = ref(false)
  const timeline = ref<TimelineItem[]>([])
  const timelineLoading = ref(false)
  const assembly = ref<AssemblyRun | null>(null)
  const assembling = ref(false)
  const searchInput = ref<HTMLInputElement | null>(null)
  // Relative ages are read from a ticking clock so idle work goes quiet on its
  // own, without a projection signal to prompt the render.
  const clock = ref(Math.floor(Date.now() / 1000))

  let searchTimer: ReturnType<typeof setTimeout> | undefined
  let clockTimer: ReturnType<typeof setInterval> | undefined
  let refreshTimer: ReturnType<typeof setInterval> | undefined
  let assemblyTimer: ReturnType<typeof setTimeout> | undefined
  let windowGeneration = 0
  let cancellation: Cancellation | null = null
  const disposers: Array<() => void> = []

  const lens = computed(() => place.value.lens)
  const focus = computed(() => place.value.focus)
  const graphId = computed(() => graphOf(place.value))
  const focusRecord = computed(() => recordOf(place.value))
  const activeGraph = computed(() => graphs.value.find(graph => graph.id === graphId.value) || graphWindow.value?.graph || null)

  const nodes = computed<GraphNode[]>(() => wholeNodes.value || graphWindow.value?.nodes || [])
  const edges = computed<GraphEdge[]>(() => wholeEdges.value || graphWindow.value?.edges || [])
  const nodeById = computed(() => new Map(nodes.value.map(node => [node.id, node])))
  const selectedNode = computed<GraphNode | null>(() => nodeById.value.get(selectedId.value) || null)
  const presence = computed(() => mergePresence(nodes.value, edges.value, cursors.value, graphId.value, clock.value))
  const touchedIds = computed(() => touchedNodeIds(presence.value))
  const foldedCount = computed(() => nodes.value.filter(isFolded).length)
  const activeCount = computed(() => nodes.value.filter(node => !isFolded(node) && !isSettled(node)).length)

  /**
   * What the span store says about each record on the canvas. Spans name the
   * task they were opened on and the graph projects a task as `task:<id>`, so
   * the sessions a record carries are read from the store rather than guessed.
   */
  const recordActivity = computed(() => {
    const value = new Map<string, { sessions: number; lastActivityAt: number }>()
    for (const span of spans.value) {
      const task = spanTaskId(span)
      if (!task) continue
      const id = `task:${task}`
      const existing = value.get(id)
      if (existing) {
        existing.sessions += 1
        existing.lastActivityAt = Math.max(existing.lastActivityAt, span.last_activity_at)
      } else {
        value.set(id, { sessions: 1, lastActivityAt: span.last_activity_at })
      }
    }
    return value
  })

  /** What the window still holds back, once a whole-graph read has replaced it. */
  const outsideWindow = computed(() => {
    if (wholeNodes.value) return { nodes: 0, edges: 0 }
    return {
      nodes: graphWindow.value?.collapsed_node_count || 0,
      edges: graphWindow.value?.collapsed_edge_count || 0,
    }
  })

  const maxDepth = computed(() => {
    let max = 0
    for (const node of nodes.value) {
      let depth = 1
      let parent = node.parent_id
      const seen = new Set([node.id])
      while (parent && nodeById.value.has(parent) && !seen.has(parent)) {
        seen.add(parent)
        depth++
        parent = nodeById.value.get(parent)?.parent_id
      }
      max = Math.max(max, depth)
    }
    return max
  })

  function projectionTopic() { return `kickside.thread.${entryId.value}.projection.chestor.journal:graph_state` }
  function stateTopic() { return `kickside.thread.${entryId.value}.projection.chestor.journal:state` }
  function healthLabel() {
    return health.value.status === 'ok' ? 'Healthy' : health.value.status === 'degraded' ? 'Degraded' : 'Health unknown'
  }

  /** Crumb labels follow the data, so a renamed graph renames its breadcrumb. */
  function relabel() {
    const labels = new Map<string, string>()
    for (const graph of graphs.value) labels.set(`graph:${graph.id}`, graph.title)
    for (const node of nodes.value) {
      labels.set(`node:${node.id}`, node.label)
      labels.set(`branch:${node.id}`, node.label)
    }
    navigation.relabel(labels)
    const index = new Map(labelIndex.value)
    for (const node of nodes.value) index.set(node.id, node.label)
    labelIndex.value = index
    sync()
  }

  function dropWhole() {
    wholeNodes.value = null
    wholeEdges.value = null
    wholeLoad.value = { ...IDLE_LOAD }
    if (cancellation) cancellation.cancelled = true
    cancellation = null
  }

  async function loadCatalog() {
    graphs.value = await client.value.graphs()
    if (graphId.value || !graphs.value.length) return
    const preferred = graphs.value.find(graph => graph.kind === 'current-work')
      || graphs.value.find(graph => graph.id === 'map')
      || graphs.value[0]
    navigation.descend({ kind: 'graph', id: preferred.id, label: preferred.title, graphId: preferred.id })
    sync()
  }

  /**
   * The window around the current focus. A branch focus reads the branch as its
   * own canvas; anything else reads the bounded window the server offers.
   */
  /**
   * The record a freshly seated window opens on. The focus itself wins when it
   * names one; otherwise the record the reader was last reading here is
   * restored, and only the first record of the window stands in when neither
   * is available. A remembered record that the window does not hold is not a
   * place a reader can be put, so it is passed over rather than forced.
   */
  function seatSelection(available: GraphNode[], focused: string): string {
    if (focused) return focused
    const remembered = navigation.viewport()?.selectedId
    if (remembered && available.some(node => node.id === remembered)) return remembered
    return available[0]?.id || ''
  }

  async function loadWindow(preserveSelection = false) {
    if (!graphId.value) return
    const generation = ++windowGeneration
    const current = place.value.focus[place.value.focus.length - 1]
    if (current?.kind === 'branch') {
      const page = await client.value.subtree(graphId.value, current.id)
      if (generation !== windowGeneration) return
      wholeNodes.value = page.nodes || []
      wholeEdges.value = page.edges || []
      wholeLoad.value = {
        running: false,
        loaded: (page.nodes || []).length + (page.edges || []).length,
        total: (page.manifest?.node_count || 0) + (page.manifest?.edge_count || 0),
        chunks: 1,
        done: page.complete !== false,
        cancelled: false,
        error: '',
      }
      if (!preserveSelection) selectedId.value = seatSelection(page.nodes || [], '') || current.id
      return
    }
    const value = await client.value.window(graphId.value, current?.kind === 'node' ? current.id : undefined)
    if (generation !== windowGeneration) return
    graphWindow.value = value
    if (!preserveSelection || !value.nodes.some(node => node.id === selectedId.value)) {
      selectedId.value = seatSelection(value.nodes, current?.kind === 'node' ? current.id : '')
    }
  }

  async function loadJournal() {
    const [state, work] = await Promise.all([client.value.state(), client.value.tasks()])
    tasks.value = work.tasks
    taskHasMore.value = work.bounded
    events.value = state.events || []
    stats.value = {
      events: state.stats?.total || 0,
      lastSeq: state.stats?.last_seq || 0,
      lastTs: state.stats?.last_ts || 0,
      tasks: state.stats?.task_count || 0,
      openTasks: state.stats?.open_task_count || 0,
    }
    if (state.graphs?.length) graphs.value = state.graphs
    if (state.work_control) workControl.value = state.work_control
  }

  async function loadPresence() {
    const [roll, page] = await Promise.all([
      client.value.cursors(),
      client.value.spans({ limit: 200 }),
    ])
    cursors.value = roll
    spans.value = page.items || []
    spanCounts.value = {
      open: page.counts?.open || 0,
      sealed: page.counts?.sealed || 0,
      total: page.counts?.total || 0,
    }
  }

  /**
   * Hour buckets first — the finest picture the server counts at journal scale.
   * A journal whose history outruns the page falls back to day buckets and
   * follows the keyset continuation until the history is complete, so the
   * chart always carries the WHOLE history rather than a silent slice of it.
   * A response landing after the reader moved to another journal is dropped.
   */
  async function loadActivity() {
    const journal = entryId.value
    const held = client.value
    const wholeHistory = async (bucket: 'hour' | 'day') => {
      let page = await held.activity({ bucket, limit: 2000 })
      const all = [...(page.buckets || [])]
      // The page bound is a safety stop far above any real history at day
      // grain; hitting it still returns everything read so far.
      for (let rounds = 0; page.has_more && rounds < 20; rounds++) {
        const cursor = (page.next_cursor || {}) as { after_bucket_at?: number; after_agent_id?: string }
        if (cursor.after_bucket_at === undefined) break
        page = await held.activity({ bucket, limit: 2000, afterBucketAt: cursor.after_bucket_at, afterAgentId: cursor.after_agent_id })
        all.push(...(page.buckets || []))
      }
      return { all, width: page.width_s, exhausted: !page.has_more }
    }
    const hourly = await held.activity({ bucket: 'hour', limit: 2000 })
    if (journal !== entryId.value) return
    if (!hourly.has_more) {
      buckets.value = hourly.buckets || []
      bucketWidthS.value = hourly.width_s || 3600
      return
    }
    const daily = await wholeHistory('day')
    if (journal !== entryId.value) return
    buckets.value = daily.all
    bucketWidthS.value = daily.width || 86400
  }

  async function loadAll() {
    if (!entryId.value) {
      error.value = 'Journal entry id is required.'
      loading.value = false
      return
    }
    loading.value = true
    try {
      await loadCatalog()
      await Promise.all([
        loadWindow(),
        loadJournal(),
        loadPresence(),
        loadActivity(),
        client.value.health().then(value => { health.value = value }),
        loadAssembly(),
      ])
      relabel()
      error.value = ''
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Couldn’t load the Journal.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Every record in the open graph, fetched in pages with the count stated as
   * it goes. Stopping keeps what already arrived; nothing is thrown away to
   * make the view smaller.
   */
  async function loadWholeGraphNow() {
    const id = graphId.value
    if (!id || wholeLoad.value.running) return
    const token: Cancellation = { cancelled: false }
    cancellation = token
    wholeLoad.value = { ...IDLE_LOAD, running: true }
    const state = await loadWholeGraph(
      request => client.value.bundle(id, request.nodeOffset, request.edgeOffset),
      {
        cancellation: token,
        onChunk: value => {
          const progress = progressOf(value)
          // The loader appends into the arrays these hold, so the canvas is
          // handed the accumulator itself and told it grew. Copying it per
          // chunk would cost the whole graph read so far on every page, which
          // is the read squared.
          wholeNodes.value = value.nodes
          wholeEdges.value = value.edges
          triggerRef(wholeNodes)
          triggerRef(wholeEdges)
          wholeLoad.value = {
            running: true,
            loaded: progress.loaded,
            total: progress.total,
            chunks: value.chunks,
            done: false,
            cancelled: false,
            error: '',
          }
        },
      },
    )
    if (cancellation === token) cancellation = null
    const progress = progressOf(state)
    wholeNodes.value = state.nodes
    wholeEdges.value = state.edges
    triggerRef(wholeNodes)
    triggerRef(wholeEdges)
    wholeLoad.value = {
      running: false,
      loaded: progress.loaded,
      total: progress.total,
      chunks: state.chunks,
      done: state.done,
      cancelled: state.cancelled,
      error: state.error,
    }
    relabel()
  }

  function cancelWholeGraph() {
    if (cancellation) cancellation.cancelled = true
  }

  async function selectGraph(id: string) {
    if (id === graphId.value) return
    const graph = graphs.value.find(item => item.id === id)
    navigation.go({
      lens: navigation.lens === 'now' ? 'outline' : navigation.lens,
      focus: [place.value.focus[0], { kind: 'graph', id, label: graph?.title || id, graphId: id }],
    })
    sync()
    selectedId.value = ''
    query.value = ''
    searchResults.value = []
    assembly.value = null
    timeline.value = []
    dropWhole()
    graphWindow.value = null
    loading.value = true
    try {
      void loadAssembly()
      await loadWindow()
      relabel()
      restoreViewport()
      error.value = ''
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Couldn’t load graph.'
    } finally {
      loading.value = false
    }
  }

  function selectNode(id: string) { selectedId.value = id }

  /**
   * Publishes the arrangement this lens last had of the current focus, so the
   * lens reading it reopens the place the way the reader left it: a graph's
   * zoom and pan, an outline's scroll. The record the reader was reading is
   * restored where the window is seated, because only there is it known whether
   * that record is in the window that arrived.
   */
  function restoreViewport() {
    viewport.value = { ...navigation.viewport() }
  }

  /** Applies whatever the focus stack now says, after a move. */
  async function applyFocus() {
    sync()
    dropWhole()
    loading.value = true
    try {
      await loadWindow()
      relabel()
      restoreViewport()
      error.value = ''
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Couldn’t open this focus.'
    } finally {
      loading.value = false
    }
  }

  /** Descending onto a record with children opens that branch as the canvas. */
  async function descend(id: string) {
    const node = nodeById.value.get(id)
    if (!node) return
    navigation.descend({
      kind: node.child_count > 0 ? 'branch' : 'node',
      id,
      label: node.label,
      graphId: graphId.value,
    })
    selectedId.value = id
    await applyFocus()
  }

  /**
   * Follows a relation that leaves the open canvas. The reader lands on the
   * target inside its own graph rather than in a branch that does not hold it.
   */
  async function jumpToRecord(id: string) {
    const graph = place.value.focus.find(item => item.kind === 'graph')
    if (!graph) return
    navigation.go({
      lens: place.value.lens,
      focus: [place.value.focus[0], graph, { kind: 'node', id, label: labelIndex.value.get(id) || id, graphId: graph.id }],
    })
    selectedId.value = id
    await applyFocus()
  }

  async function ascend() {
    if (!navigation.ascend()) return false
    await applyFocus()
    return true
  }

  async function toCrumb(index: number) {
    navigation.toIndex(index)
    await applyFocus()
  }

  async function back() {
    if (!navigation.back()) return
    await applyFocus()
  }

  async function forward() {
    if (!navigation.forward()) return
    await applyFocus()
  }

  function changeLens(value: Lens) {
    navigation.setLens(value)
    sync()
    // Each lens keeps its own arrangement of a focus, so switching lens reopens
    // the one the reader left in the lens they are switching to.
    restoreViewport()
    if (value === 'recall') nextTick(() => searchInput.value?.focus())
    if (value === 'changes') void openTimeline()
    if (value === 'lanes' && !buckets.value.length) void loadActivity()
  }

  async function runSearch() {
    clearTimeout(searchTimer)
    if (!query.value.trim() || !graphId.value) {
      searchResults.value = []
      return
    }
    searchLoading.value = true
    try {
      searchResults.value = await client.value.search(graphId.value, query.value.trim(), searchMode.value)
      error.value = ''
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Search failed.'
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }

  function queueSearch() {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(runSearch, 320)
  }

  async function openSearchResult(id: string) {
    selectedId.value = id
    if (!nodeById.value.has(id)) await descend(id)
  }

  async function openTimeline() {
    if (timeline.value.length || timelineLoading.value || !graphId.value) return
    timelineLoading.value = true
    try {
      timeline.value = await client.value.timeline(graphId.value)
      error.value = ''
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Timeline failed.'
    } finally {
      timelineLoading.value = false
    }
  }

  async function refresh() {
    if (!entryId.value || loading.value || wholeLoad.value.running) return
    try {
      await Promise.all([
        loadCatalog(),
        loadWindow(true),
        loadJournal(),
        loadPresence(),
        loadActivity(),
        client.value.health().then(value => { health.value = value }),
        loadAssembly(),
      ])
      relabel()
    } catch {
      // Preserve the last committed view; the next projection signal retries.
    }
  }

  async function loadAssembly() {
    if (!graphId.value) return
    const value = await client.value.assembly(graphId.value)
    assembly.value = value
    assembling.value = isAssemblyRunning(value)
  }

  /**
   * A pass finishes in the background, so the control watches the run itself
   * rather than the window: when the run settles, the window is reloaded once
   * and the reader sees the relations the pass drew.
   */
  function watchAssembly() {
    clearTimeout(assemblyTimer)
    assemblyTimer = setTimeout(async () => {
      if (!entryId.value || !graphId.value) return
      const value = await client.value.assembly(graphId.value)
      assembly.value = value
      if (isAssemblyRunning(value)) { watchAssembly(); return }
      assembling.value = false
      await loadWindow(true)
      await loadCatalog()
    }, 1200)
  }

  async function recomputeMap() {
    if (!graphId.value || assembling.value) return
    assembling.value = true
    try {
      assembly.value = await client.value.assemble(graphId.value)
      error.value = ''
      watchAssembly()
    } catch (cause) {
      assembling.value = false
      error.value = cause instanceof Error ? cause.message : 'Couldn’t recompute this map.'
    }
  }

  /** The records that share a parent with `id`, in the order the outline shows them. */
  function siblingsOf(id: string): GraphNode[] {
    const node = nodeById.value.get(id)
    if (!node) return []
    return nodes.value
      .filter(item => (item.parent_id || '') === (node.parent_id || ''))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  /** Walks the selection one step: siblings sideways, the hierarchy vertically. */
  function walk(direction: 'prev' | 'next' | 'out' | 'in') {
    const current = selectedId.value || nodes.value[0]?.id || ''
    const node = nodeById.value.get(current)
    if (!node) {
      selectedId.value = nodes.value[0]?.id || ''
      return
    }
    if (direction === 'out') {
      if (node.parent_id && nodeById.value.has(node.parent_id)) selectedId.value = node.parent_id
      return
    }
    if (direction === 'in') {
      const child = nodes.value.find(item => item.parent_id === node.id)
      if (child) selectedId.value = child.id
      return
    }
    const row = siblingsOf(current)
    const at = row.findIndex(item => item.id === current)
    const next = direction === 'next' ? at + 1 : at - 1
    if (next >= 0 && next < row.length) selectedId.value = row[next].id
  }

  /**
   * Steps the selection through the records this graph holds, newest first —
   * the facts, in the order they were written.
   */
  function stepFact(direction: -1 | 1) {
    const ordered = [...nodes.value].sort((a, b) => b.updated_at - a.updated_at || a.id.localeCompare(b.id))
    if (!ordered.length) return
    const at = ordered.findIndex(item => item.id === selectedId.value)
    const next = at < 0 ? 0 : Math.max(0, Math.min(ordered.length - 1, at + direction))
    selectedId.value = ordered[next].id
  }

  /**
   * The keyboard grammar: a letter opens a lens, Escape steps out, Enter steps
   * in, arrows walk siblings and the hierarchy, brackets walk the facts, and
   * the browser's own back and forward move through places.
   */
  function keydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
      if (event.key === 'Escape') target.blur()
      return
    }
    if (event.key === '/') {
      event.preventDefault()
      changeLens('recall')
      return
    }
    if (event.key === 'Escape') { void ascend(); return }
    if (event.key === 'Enter' && selectedId.value) { void descend(selectedId.value); return }
    if (event.altKey && event.key === 'ArrowLeft') { event.preventDefault(); void back(); return }
    if (event.altKey && event.key === 'ArrowRight') { event.preventDefault(); void forward(); return }
    if (event.key === '[') { event.preventDefault(); stepFact(-1); return }
    if (event.key === ']') { event.preventDefault(); stepFact(1); return }
    // The outline is a tree and owns its own arrow walking, including the
    // scrolling that keeps the focused row on screen; two handlers on one key
    // would fight each other.
    if (place.value.lens !== 'outline') {
      if (event.key === 'ArrowLeft') { event.preventDefault(); walk('prev'); return }
      if (event.key === 'ArrowRight') { event.preventDefault(); walk('next'); return }
      if (event.key === 'ArrowUp') { event.preventDefault(); walk('out'); return }
      if (event.key === 'ArrowDown') { event.preventDefault(); walk('in'); return }
    }
    if (!event.metaKey && !event.ctrlKey && !event.altKey && LENS_KEYS[event.key]) {
      event.preventDefault()
      changeLens(LENS_KEYS[event.key])
    }
  }

  /**
   * What a lens hands back as the reader rearranges a place. It is written
   * against wherever the reader is standing now, which is the place the
   * arrangement belongs to.
   */
  function rememberViewport(value: ViewportMemory) {
    navigation.rememberViewport(value)
    viewport.value = { ...viewport.value, ...value }
  }

  watch(query, queueSearch)
  watch(searchMode, () => { if (query.value.trim()) void runSearch() })
  watch(entryId, () => { void loadAll() })
  // Which record the reader was reading is part of how they had a place
  // arranged, so it is remembered as they choose it rather than as they leave.
  watch(selectedId, id => { if (id) rememberViewport({ selectedId: id }) })
  onMounted(() => {
    disposers.push(on(projectionTopic(), () => { void refresh() }))
    disposers.push(on(stateTopic(), () => { void refresh() }))
    refreshTimer = setInterval(refresh, 15000)
    clockTimer = setInterval(() => { clock.value = Math.floor(Date.now() / 1000) }, 30000)
    window.addEventListener('keydown', keydown)
  })
  onBeforeUnmount(() => {
    clearTimeout(searchTimer)
    clearTimeout(assemblyTimer)
    if (refreshTimer) clearInterval(refreshTimer)
    if (clockTimer) clearInterval(clockTimer)
    for (const dispose of disposers) dispose()
    window.removeEventListener('keydown', keydown)
    cancelWholeGraph()
  })

  return {
    navigation, place, lens, focus, graphId, focusRecord,
    graphs, graphWindow, health, cursors, spans, spanCounts, workControl, tasks, taskHasMore, events, buckets, bucketWidthS, stats,
    selectedId, loading, error, query, searchMode, searchResults, searchLoading,
    timeline, timelineLoading, searchInput, clock,
    activeGraph, nodes, edges, nodeById, selectedNode, presence, touchedIds,
    foldedCount, activeCount, maxDepth, outsideWindow, wholeLoad, recordActivity,
    assembly, assembling, recomputeMap, viewport, rememberViewport,
    healthLabel, loadAll, refresh, selectGraph, selectNode, descend, ascend, toCrumb, back, forward,
    changeLens, runSearch, openSearchResult, openTimeline, jumpToRecord, labelIndex, walk, stepFact,
    loadWholeGraphNow, cancelWholeGraph,
    canBack: computed(() => { void place.value; return navigation.canBack }),
    canForward: computed(() => { void place.value; return navigation.canForward }),
  }
}
