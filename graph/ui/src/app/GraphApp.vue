<script setup lang="ts">
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useProps } from '@wippy-fe/webcomponent-vue'
import { api, on } from '@wippy-fe/proxy'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import type { Connection, EdgeMouseEvent, NodeDragEvent, NodeMouseEvent, NodeTypesObject } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import GraphNode from './GraphNode.vue'
import BoundaryNode from './BoundaryNode.vue'
import PortalNode from './PortalNode.vue'
import NodePanel from './NodePanel.vue'
import EdgePanel from './EdgePanel.vue'
import SchemaPanel from './SchemaPanel.vue'
import GraphSearch from './GraphSearch.vue'
import MaterialCard from './MaterialCard.vue'
import ContextMenu, { type MenuItem } from './ContextMenu.vue'
import { connectMenuItems, paneMenuItems } from './pane-menu'
import { looseConnectTarget } from './loose-connect'
import { snapToGuides, type Guide, type Rect } from './helper-lines'
import { alignRects, distributeRects, type AlignMode } from './align'
import { pastePlan, type Clip } from './clipboard'
import { ancestorPath } from './search'
import { RESIZE_NODE_KEY } from './resize'
import { forgetPendingRevision, projectionTopic, reconcilePendingLayouts, rememberPendingLayouts, type PendingLayouts } from './live-sync'
import { buildFlowData, flattenGraph, typeMap, autoLayout, isPortalStub, ROUTE_CYCLE } from './graph-sync'
import * as C from './commands'
import { healPlan } from './heal'
import { isEditingTarget, resolveAction, resolveTypeIntent } from './keymap'
import { NODE_EDIT_KEY, type NodeEditState } from './canvas-edit'
import { PROJECTION_KIND, type FlatGraph, type GraphNode as StateNode, type GraphState } from './types'

interface Props { entryId?: string; mode?: string; readOnly?: boolean }

const props = useProps<Props>()
const entryId = computed(() => props.value?.entryId || '')
const isFull = computed(() => (props.value?.mode || 'preview') === 'full')
const canEdit = computed(() => isFull.value && !props.value?.readOnly && state.value !== null)

const state = ref<GraphState | null>(null)
const flat = ref<FlatGraph>(flattenGraph([]))
const nodes = ref<any[]>([])
const edges = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const selectedNodeId = ref<string | null>(null)
const selectedEdgeId = ref<string | null>(null)
// A selected virtual/rolled-up edge has no backing record to edit; it opens a
// read-only provenance card listing the real relations it stands for.
const aggEdge = ref<{ label: string; count: number; members: Array<{ id: string; type: string; label: string; source: string; target: string; sourceId: string; targetId: string }> } | null>(null)
const expandedNodes = ref<Set<string>>(new Set())
const treeExpanded = ref<Set<string>>(new Set())
const treeOpen = ref(true)
const panelOpen = ref(true)
const schemaOpen = ref(false)
const viewStack = ref<string[]>([])
const layoutDir = ref<'TB' | 'LR'>('TB')
const contextMenu = ref<{ x: number; y: number; items: MenuItem[] } | null>(null)
const connecting = ref(false)
const searchRef = ref<InstanceType<typeof GraphSearch> | null>(null)
const rootEl = ref<HTMLElement | null>(null)
const narrow = ref(false)
let resizeObserver: ResizeObserver | undefined
function toggleStructure() {
  treeOpen.value = !treeOpen.value
  if (narrow.value && treeOpen.value) panelOpen.value = false
}
watch([selectedNodeId, selectedEdgeId, schemaOpen], () => {
  if (narrow.value && (selectedNodeId.value || selectedEdgeId.value || schemaOpen.value)) treeOpen.value = false
})
// The canvas owns an in-progress drag until the committed projection reaches
// the same coordinates. Commands stay ordered; projection reads are monotonic.
const pendingLayouts: PendingLayouts = new Map()
let layoutRevision = 0
let loadRevision = 0
let mutationTail: Promise<void> = Promise.resolve()

// ── Inline rename on the canvas node ──
const nodeEdit = ref<NodeEditState | null>(null)
function startNodeEdit(id: string, seed: string | null) {
  if (!canEdit.value) return
  // Only plain nodes render the inline editor; boundaries keep their title.
  if (nodes.value.find(n => n.id === id)?.type !== 'graphNode') return
  nodeEdit.value = { id, seed }
}
function closeNodeEdit() {
  nodeEdit.value = null
  rootEl.value?.focus()
}
provide(NODE_EDIT_KEY, {
  state: nodeEdit,
  commit: (id: string, name: string) => {
    const trimmed = name.trim()
    const current = flat.value.nodeById.get(id)?.name
    if (trimmed && trimmed !== current) apply([C.updateNode(id, { name: trimmed })])
    closeNodeEdit()
  },
  close: closeNodeEdit,
})
watch(selectedNodeId, (id) => { if (nodeEdit.value && nodeEdit.value.id !== id) nodeEdit.value = null })

// Vue Flow's NodeComponent type requires every injected runtime prop to be
// declared by custom SFCs, although Vue Flow supplies those props itself.
const nodeTypes = { graphNode: markRaw(GraphNode), boundary: markRaw(BoundaryNode), portalNode: markRaw(PortalNode) } as unknown as NodeTypesObject
const flowId = `graph-${entryId.value || 'entry'}-${props.value?.mode || 'preview'}`
const { fitView, getSelectedNodes, setCenter, viewport, screenToFlowCoordinate, getNodes, onNodesInitialized } = useVueFlow(flowId)

const base = () => `/api/v1/workspace/graphs/${entryId.value}`

// Human error surface: prefer the server's message (validation copy like
// "node parent cycle refused" is already human), map known stack-exhaustion
// messages, and never leak transport text like "Request failed with status 400".
function serverError(e: unknown): string {
  const data = (e as { response?: { data?: { error?: unknown } }; data?: { error?: unknown } } | null)
  const raw = data?.response?.data?.error ?? data?.data?.error
  if (typeof raw === 'string' && raw) return raw
  if (e instanceof Error && e.message && !/^request failed/i.test(e.message) && !/status code/i.test(e.message)) return e.message
  return ''
}
function humanError(e: unknown, fallback: string): string {
  const s = serverError(e)
  if (!s) return fallback
  if (/nothing to undo/i.test(s)) return 'Nothing to undo.'
  if (/nothing to redo/i.test(s)) return 'Nothing to redo.'
  return s
}

const viewRoot = computed(() => viewStack.value.length ? viewStack.value[viewStack.value.length - 1] : undefined)
const selectedNode = computed(() => selectedNodeId.value ? flat.value.nodeById.get(selectedNodeId.value) || null : null)
const selectedEdge = computed(() => selectedEdgeId.value ? (state.value?.edges || []).find(e => e.id === selectedEdgeId.value) || null : null)
const nodeTypeDefs = computed(() => state.value?.schema.node_types || [])
const edgeTypeDefs = computed(() => state.value?.schema.edge_types || [])
const materialTypeDefs = computed(() => state.value?.schema.material_types || [])
const nodeTypeMap = computed(() => typeMap(nodeTypeDefs.value))
const edgeTypeMap = computed(() => typeMap(edgeTypeDefs.value))
const sortedNodeTypes = computed(() => [...nodeTypeDefs.value].sort((a, b) => (a.title || a.id).localeCompare(b.title || b.id)))
const graphMaterials = computed(() => state.value?.materials || [])
const openGraphMats = ref<Set<string>>(new Set())
watch(() => graphMaterials.value.length, (len, prev) => {
  if (len > (prev ?? 0)) {
    const last = graphMaterials.value[graphMaterials.value.length - 1]
    if (last) openGraphMats.value = new Set([...openGraphMats.value, last.id])
  }
})
function toggleGraphMat(id: string) {
  const next = new Set(openGraphMats.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  openGraphMats.value = next
}
const counts = computed(() => ({
  nodes: nodes.value.filter(n => n.type === 'graphNode').length,
  edges: edges.value.length,
}))
const hasSelectedChildren = computed(() => !!(selectedNode.value && (flat.value.childrenByParent.get(selectedNode.value.id) || []).length))

const treeItems = computed(() => {
  const items: Array<{ node: StateNode; depth: number; childCount: number; expanded: boolean }> = []
  function walk(parentId: string, depth: number) {
    for (const node of flat.value.childrenByParent.get(parentId) || []) {
      const children = flat.value.childrenByParent.get(node.id) || []
      const expanded = treeExpanded.value.has(node.id)
      items.push({ node, depth, childCount: children.length, expanded })
      if (expanded) walk(node.id, depth + 1)
    }
  }
  walk('', 0)
  return items
})

const breadcrumbs = computed(() => viewStack.value.map(id => ({ id, name: flat.value.nodeById.get(id)?.name || id })))

// Decorative domain fallback for graph entity types; it does not encode status.
function nodeDotColor(type: string): string { return String(nodeTypeMap.value.get(type)?.color || 'var(--p-primary-color)') }
function defaultNodeType(): string { return nodeTypeDefs.value[0]?.id || 'note' }
function defaultEdgeType(): string { return edgeTypeDefs.value[0]?.id || 'relates-to' }
function defaultMaterialType(target: 'graph' | 'node' | 'edge'): string {
  return (materialTypeDefs.value.find(d => !d.targets || d.targets.includes(target))?.id) || 'note'
}
let pendingFit = false
onNodesInitialized(() => {
  if (pendingFit) { pendingFit = false; void fit() }
})

function rebuild(refit = false) {
  if (!state.value) return
  const built = buildFlowData(state.value, expandedNodes.value, viewRoot.value)
  flat.value = built.flat
  nodes.value = built.flowNodes
  edges.value = built.flowEdges
  if (refit) {
    pendingFit = true
    if (!nodes.value.length) pendingFit = false
  }
}

function setState(next: GraphState, refit = false, options: { committed?: boolean; preserveCanvas?: boolean } = {}) {
  const reconciled = reconcilePendingLayouts(next, pendingLayouts, options.committed === true)
  state.value = {
    ...reconciled,
    nodes: reconciled.nodes || [],
    edges: reconciled.edges || [],
    materials: reconciled.materials || [],
    schema: {
      node_types: reconciled.schema?.node_types || [],
      edge_types: reconciled.schema?.edge_types || [],
      material_types: reconciled.schema?.material_types || [],
    },
    layout: { positions: reconciled.layout?.positions || {}, viewport: reconciled.layout?.viewport },
    settings: reconciled.settings || {},
    can_undo: reconciled.can_undo === true,
    can_redo: reconciled.can_redo === true,
  }
  if (!options.preserveCanvas) rebuild(refit)
}

async function load(refit = false, committed = false) {
  if (!entryId.value) { error.value = 'entry id required'; loading.value = false; return }
  const revision = ++loadRevision
  try {
    const { data } = await api.get(base())
    if (!data.success) throw new Error(data.error || 'failed to load graph')
    if (revision !== loadRevision) return
    setState(data.graph, refit, { committed })
    error.value = ''
  } catch (err) {
    if (revision !== loadRevision) return
    error.value = humanError(err, 'Couldn’t load the graph.')
  } finally {
    if (revision === loadRevision) loading.value = false
  }
}

function enqueueMutation(task: () => Promise<void>): Promise<void> {
  const queued = mutationTail.then(task)
  mutationTail = queued.catch(err => { error.value = humanError(err, 'Couldn’t save the change.') })
  return queued
}

async function applyNow(commands: C.Command[], refit = false, options: { layoutRevision?: number; preserveCanvas?: boolean } = {}) {
  if (!commands.length) return
  try {
    const { data } = await api.post(`${base()}/apply`, { commands })
    if (!data.success) throw new Error(data.error || 'apply failed')
    setState(data.graph, refit, { preserveCanvas: options.preserveCanvas })
    error.value = ''
  } catch (err) {
    if (options.layoutRevision !== undefined) {
      forgetPendingRevision(pendingLayouts, options.layoutRevision)
      await load(false)
    }
    error.value = humanError(err, 'Couldn’t save the change.')
  }
}

function apply(commands: C.Command[], refit = false, options: { layoutRevision?: number; preserveCanvas?: boolean } = {}): Promise<void> {
  if (!canEdit.value || !commands.length) return Promise.resolve()
  return enqueueMutation(() => applyNow(commands, refit, options))
}

async function runHistoryNow(action: 'undo' | 'redo') {
  if (!state.value) return
  if (action === 'undo' && !state.value.can_undo) return
  if (action === 'redo' && !state.value.can_redo) return
  try {
    pendingLayouts.clear()
    const { data } = await api.post(`${base()}/${action}`, {})
    if (!data.success) throw new Error(data.error || `${action} failed`)
    setState(data.graph)
    error.value = ''
  } catch (err) {
    error.value = humanError(err, action === 'undo' ? 'Nothing to undo.' : 'Nothing to redo.')
  }
}

function runHistory(action: 'undo' | 'redo'): Promise<void> {
  if (!canEdit.value) return Promise.resolve()
  return enqueueMutation(() => runHistoryNow(action))
}

// ── Node / edge mutations ──
function updateNode(patch: Record<string, unknown>) {
  if (selectedNode.value) apply([C.updateNode(selectedNode.value.id, patch)])
}
function updateEdge(patch: Record<string, unknown>) {
  if (selectedEdge.value) apply([C.updateEdge(selectedEdge.value.id, patch)])
}
function reverseSelectedEdge() {
  if (selectedEdge.value) apply([C.reverseEdge(selectedEdge.value)])
}
function addNode(type = defaultNodeType(), parentId = viewRoot.value, at?: { x: number; y: number }): string {
  const id = C.uid()
  const cmds = [C.addNode({ id, type, name: 'New node', parentId })]
  if (at) cmds.push(C.setPosition(id, Math.round(at.x), Math.round(at.y)))
  apply(cmds)
  selectedNodeId.value = id
  selectedEdgeId.value = null
  schemaOpen.value = false
  panelOpen.value = true
  return id
}
// Duplicate keeps the incoming wires (the "same inputs, different content"
// iteration loop) and offsets the copy so it never lands exactly on the source.
// ── Copy / paste ──
const clipboard = ref<Clip | null>(null)
function copySelected() {
  const flow = getSelectedNodes.value.length
    ? getSelectedNodes.value
    : (selectedNodeId.value ? getNodes.value.filter(n => n.id === selectedNodeId.value) : [])
  if (!flow.length) return
  const ids = new Set(flow.map(n => String(n.id)))
  const nodes = flow.flatMap(n => {
    const src = flat.value.nodeById.get(String(n.id))
    if (!src) return []
    return [{ id: src.id, type: src.type, name: src.name, properties: src.properties, tags: src.tags, x: n.position.x, y: n.position.y }]
  })
  const edges = (state.value?.edges || [])
    .filter(e => ids.has(e.source_id) && ids.has(e.target_id))
    .map(e => ({ type: e.type, source_id: e.source_id, target_id: e.target_id, label: e.label, properties: e.properties }))
  clipboard.value = { nodes, edges }
}
function pasteClipboard() {
  const clip = clipboard.value
  if (!clip || !clip.nodes.length) return
  const plan = pastePlan(clip, C.uid)
  const cmds: C.Command[] = []
  for (const n of plan.nodes) {
    cmds.push(C.addNode({ id: n.id, type: n.type, name: n.name, parentId: viewRoot.value, properties: n.properties, tags: n.tags }))
    cmds.push(C.setPosition(n.id, Math.round(n.x), Math.round(n.y)))
  }
  for (const e of plan.edges) cmds.push(C.addEdge({ type: e.type, sourceId: e.source_id, targetId: e.target_id, label: e.label, properties: e.properties }))
  apply(cmds)
  if (plan.nodes.length === 1) selectedNodeId.value = plan.nodes[0].id
}
// ── Align / distribute ──
function applyAlign(mode: AlignMode) {
  const rects = getSelectedNodes.value.filter(n => n.dimensions?.width).map(nodeRect)
  const moves = alignRects(rects, mode)
  if (moves.length) apply(moves.map(m => C.setPosition(m.id, m.x, m.y)))
}
function applyDistribute(axis: 'h' | 'v') {
  const rects = getSelectedNodes.value.filter(n => n.dimensions?.width).map(nodeRect)
  const moves = distributeRects(rects, axis)
  if (moves.length) apply(moves.map(m => C.setPosition(m.id, m.x, m.y)))
}
function duplicateSelected() {
  const source = selectedNodeId.value ? flat.value.nodeById.get(selectedNodeId.value) : null
  if (!source) return
  const id = C.uid()
  const flowNode = getNodes.value.find(n => n.id === source.id)
  const pos = flowNode ? flowNode.position : { x: 0, y: 0 }
  const cmds = [
    C.addNode({ id, type: source.type, name: source.name, parentId: source.parent_id ?? undefined, properties: source.properties, tags: source.tags }),
    C.setPosition(id, Math.round(pos.x + 32), Math.round(pos.y + 32)),
  ]
  for (const edge of state.value?.edges || []) {
    if (edge.target_id === source.id) {
      cmds.push(C.addEdge({ type: edge.type, sourceId: edge.source_id, targetId: id, label: edge.label, properties: edge.properties }))
    }
  }
  apply(cmds)
  selectedNodeId.value = id
}
function addChild(parentId: string) {
  const id = C.uid()
  apply([C.addNode({ id, type: defaultNodeType(), name: 'New child', parentId })])
}
// Removing nodes bridges the connections that flowed through them, so a
// chain survives losing its middle (the heal plan runs in the same batch).
function removeNodesHealed(ids: string[]) {
  ids = ids.filter(id => !isPortalStub(id))
  if (!ids.length) return
  const edges = (state.value?.edges || []) as any[]
  const bridges = healPlan(ids, edges.map((e: any) => ({ id: String(e.id), type: String(e.type), source_id: String(e.source_id), target_id: String(e.target_id) })))
  apply([
    ...bridges.map(b => C.addEdge({ type: b.type, sourceId: b.source_id, targetId: b.target_id })),
    ...ids.map(id => C.removeNode(id)),
  ])
}
function deleteSelected() {
  const multi = getSelectedNodes.value
  if (multi.length > 1) {
    selectedNodeId.value = null
    removeNodesHealed(multi.map((n: any) => String(n.id)))
    return
  }
  if (selectedEdge.value) { const id = selectedEdge.value.id; selectedEdgeId.value = null; apply([C.removeEdge(id)]) }
  else if (selectedNode.value) { const id = selectedNode.value.id; selectedNodeId.value = null; removeNodesHealed([id]) }
}
function reparent(ids: string[], parentId: string | null) { apply(ids.map(id => C.reparentNode(id, parentId))) }

let connectStartNode: string | null = null
let connectMade = false
function onConnectStart(params: { nodeId?: string | null }) {
  if (!canEdit.value) return
  connecting.value = true
  connectMade = false
  connectStartNode = params?.nodeId ?? null
}
function onConnect(conn: Connection) {
  if (!canEdit.value) return
  if (!conn.source || !conn.target || conn.source === conn.target) return
  connectMade = true
  const properties: Record<string, unknown> = {}
  if (conn.sourceHandle) properties.sourceHandle = conn.sourceHandle
  if (conn.targetHandle) properties.targetHandle = conn.targetHandle
  apply([C.addEdge({ type: defaultEdgeType(), sourceId: conn.source, targetId: conn.target, properties })])
}
// A drag released over a node's body — not its 9px port — still connects: the
// port is the precise path, the body the forgiving one.
function onConnectEnd(e?: MouseEvent | TouchEvent) {
  connecting.value = false
  const start = connectStartNode
  connectStartNode = null
  if (connectMade || !start || !(e instanceof MouseEvent)) return
  const point = screenToFlowCoordinate({ x: e.clientX, y: e.clientY })
  const rects = getNodes.value.map(n => ({
    id: n.id,
    x: n.computedPosition?.x ?? n.position.x,
    y: n.computedPosition?.y ?? n.position.y,
    width: n.dimensions?.width ?? 0,
    height: n.dimensions?.height ?? 0,
  }))
  const target = looseConnectTarget(start, point, rects)
  if (target) {
    apply([C.addEdge({ type: defaultEdgeType(), sourceId: start, targetId: target, properties: {} })])
    return
  }
  // Dropped on empty canvas: offer creation wired to the drag source — the
  // add-place-connect gesture every serious graph tool converges on.
  const items = connectMenuItems({
    nodeTypes: sortedNodeTypes.value,
    addConnected: (type?: string) => {
      const id = addNode(type ?? defaultNodeType(), viewRoot.value, point)
      apply([C.addEdge({ type: defaultEdgeType(), sourceId: start, targetId: id, properties: {} })])
    },
  })
  menuGuardUntil = Date.now() + 300
  contextMenu.value = { x: e.clientX, y: e.clientY, items }
}

// Canvas grip resize commits through the same command pipeline as the panel
// width slider; nodes receive the callback via provide so Vue Flow's node
// mounting stays prop-free.
function resizeNodeWidth(id: string, width: number) {
  const node = flat.value.nodeById.get(id)
  if (!node) return
  apply([C.updateNode(id, { properties: { ...(node.properties || {}), width } })])
}
provide(RESIZE_NODE_KEY, resizeNodeWidth)

// ── Helper lines ──
// Guides render live while dragging; the snap itself lands on drop, so the
// pointer never fights the store mid-drag. Ctrl bypasses both.
const dragGuides = ref<Guide[]>([])
function nodeRect(n: { id: string; position: { x: number; y: number }; dimensions?: { width: number; height: number } }): Rect {
  return { id: String(n.id), x: n.position.x, y: n.position.y, width: Number(n.dimensions?.width || 0), height: Number(n.dimensions?.height || 0) }
}
function guideOthers(excludeId: string): Rect[] {
  return getNodes.value.filter(n => n.id !== excludeId && n.dimensions?.width).map(nodeRect)
}
function onNodeDrag(event: NodeDragEvent) {
  const single = !(event.nodes?.length > 1)
  const raw = event.event as MouseEvent | undefined
  if (!single || raw?.ctrlKey) { dragGuides.value = []; return }
  dragGuides.value = snapToGuides(nodeRect(event.node), guideOthers(String(event.node.id)), 6).guides
}
function onNodeDragStop(event: NodeDragEvent) {
  if (!canEdit.value) return
  dragGuides.value = []
  const moved = event.nodes?.length ? event.nodes : [event.node]
  const raw = event.event as MouseEvent | undefined
  if (moved.length === 1 && moved[0] && !raw?.ctrlKey) {
    const snapped = snapToGuides(nodeRect(moved[0]), guideOthers(String(moved[0].id)), 6)
    moved[0].position = { x: snapped.x, y: snapped.y }
  }
  const commands = moved.filter(Boolean).map(n => C.setPosition(
    String(n.id), n.position.x, n.position.y,
    Number(n.dimensions?.width || 0) || undefined,
    Number(n.dimensions?.height || 0) || undefined,
  ))
  const revision = ++layoutRevision
  rememberPendingLayouts(pendingLayouts, commands, revision)
  void apply(commands, false, { layoutRevision: revision, preserveCanvas: true })
}

// ── Materials ──
function addMaterial(targetType: 'graph' | 'node' | 'edge', kind: string, targetId?: string) {
  apply([C.attachMaterial({ targetType, targetId, kind })])
}
function addComponentRef(targetType: 'node' | 'edge', kind: string, targetId: string) {
  apply([C.attachMaterial({ targetType, targetId, kind, title: 'Component ref', source: { type: 'component' } })])
}
function updateMaterial(payload: { id: string; patch: Record<string, unknown> }) {
  apply([C.updateMaterial(payload.id, payload.patch)])
}
function removeMaterial(id: string) { apply([C.detachMaterial(id)]) }

// ── Types ──
function addType(kind: 'node' | 'edge' | 'material') {
  const id = `${kind}-${Math.floor(Math.random() * 10000)}`
  const def: Record<string, unknown> = { id, title: kind === 'node' ? 'Node' : kind === 'edge' ? 'Relation' : 'Note' }
  // Decorative defaults distinguish graph entity kinds, not state or severity.
  if (kind === 'node') def.color = 'var(--p-primary-color)'
  if (kind === 'edge') { def.color = 'var(--p-text-muted-color)'; def.stroke = 'var(--p-text-muted-color)' }
  if (kind === 'material') { def.targets = ['graph', 'node', 'edge']; def.display = 'panel' }
  apply([C.registerType(kind, def)])
}
function updateType(payload: { kind: 'node' | 'edge' | 'material'; id: string; patch: Record<string, unknown> }) {
  apply([C.updateType(payload.kind, payload.id, payload.patch)])
}
function removeType(payload: { kind: 'node' | 'edge' | 'material'; id: string }) {
  apply([C.removeType(payload.kind, payload.id)])
}
function seedDefaults() {
  const cmds: C.Command[] = []
  // Decorative domain palettes: these colors distinguish graph entity types,
  // never success, warning, or error states.
  // A general thinking vocabulary, not a software-architecture one: the graph
  // serves planning, research, and knowledge work by default. A team modeling
  // systems registers its own domain types on top. Note stays first — it is
  // the default type every quick-create gesture reaches for.
  const nodes_ = [
    ['note', 'Note', 'var(--p-text-muted-color)'], ['idea', 'Idea', 'color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))'], ['topic', 'Topic', 'color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))'],
    ['task', 'Task', 'var(--p-primary-color)'], ['question', 'Question', 'color-mix(in srgb, var(--p-primary-color) 40%, var(--p-text-color))'], ['decision', 'Decision', 'color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))'],
    ['person', 'Person', 'color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))'], ['resource', 'Resource', 'color-mix(in srgb, var(--p-primary-color) 65%, var(--p-text-color))'], ['goal', 'Goal', 'color-mix(in srgb, var(--p-primary-color) 90%, var(--p-text-color))'],
  ]
  for (const [id, title, color] of nodes_) cmds.push(C.registerType('node', { id, title, color }))
  const edges_ = [
    ['relates-to', 'Relates To', 'var(--p-text-muted-color)', false], ['leads-to', 'Leads To', 'color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))', false],
    ['depends-on', 'Depends On', 'color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))', false], ['supports', 'Supports', 'var(--p-primary-color)', false],
    ['blocks', 'Blocks', 'color-mix(in srgb, var(--p-primary-color) 60%, var(--p-text-color))', false], ['part-of', 'Part Of', 'color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))', false],
  ]
  for (const [id, title, color, animated] of edges_) cmds.push(C.registerType('edge', { id, title, color, stroke: color, animated }))
  const mats = [
    ['note', 'Note', 'panel'], ['reference', 'Reference', 'badge'], ['constraint', 'Constraint', 'badge'], ['metric', 'Metric', 'badge'],
  ]
  for (const [id, title, display] of mats) cmds.push(C.registerType('material', { id, title, display, targets: ['graph', 'node', 'edge'] }))
  apply(cmds)
}

// ── Selection / navigation ──
function onNodeClick(e: NodeMouseEvent) {
  // A portal chip is a reference, not a node: clicking it opens the real node
  // instead of selecting a canvas object the backend has never heard of.
  const portalTarget = (e.node.data as { portalTarget?: string } | undefined)?.portalTarget
  if (portalTarget) { onSearchPick(portalTarget); return }
  selectedNodeId.value = e.node.id; selectedEdgeId.value = null; aggEdge.value = null; schemaOpen.value = false; panelOpen.value = true
}
function onEdgeClick(e: EdgeMouseEvent) {
  const data = e.edge.data as { aggregated?: boolean; count?: number; members?: Array<{ id: string; type: string; label: string; source: string; target: string; sourceId: string; targetId: string }> } | undefined
  if (data?.aggregated) {
    aggEdge.value = { label: e.edge.label as string || '', count: data.count || (data.members?.length ?? 0), members: data.members || [] }
    selectedEdgeId.value = null; selectedNodeId.value = null; schemaOpen.value = false; panelOpen.value = true
    return
  }
  aggEdge.value = null
  selectedEdgeId.value = e.edge.id; selectedNodeId.value = null; schemaOpen.value = false; panelOpen.value = true
}
const screenGuides = computed(() => {
  const vp = viewport.value
  return dragGuides.value.map(g => g.axis === 'x'
    ? { key: `x${g.at}`, left: g.at * vp.zoom + vp.x, top: g.from * vp.zoom + vp.y, length: (g.to - g.from) * vp.zoom, vertical: true }
    : { key: `y${g.at}`, left: g.from * vp.zoom + vp.x, top: g.at * vp.zoom + vp.y, length: (g.to - g.from) * vp.zoom, vertical: false })
})

let menuGuardUntil = 0
function onPaneClick() {
  selectedNodeId.value = null
  selectedEdgeId.value = null
  aggEdge.value = null
  // The mouse-up ending a connection drag fires pane-click too; a menu opened
  // by that very release must survive its own click.
  if (Date.now() >= menuGuardUntil) contextMenu.value = null
}
function onNodeDoubleClick(e: NodeMouseEvent) {
  // A portal stub is not a real node — jumping through it navigates to the
  // external endpoint it stands for rather than drilling or editing.
  const portalTarget = (e.node.data as { portalTarget?: string } | undefined)?.portalTarget
  if (portalTarget) { onSearchPick(portalTarget); return }
  if ((flat.value.childrenByParent.get(e.node.id) || []).length) drillInto(e.node.id)
  else startNodeEdit(e.node.id, null)
}
function onEdgeDoubleClick(e: EdgeMouseEvent) {
  // Virtual edges carry no editable record — double-click jumps through them to
  // where the real relation lives: to the external endpoint for a portal edge,
  // or into the group whose collapsed children the relation was rolled up from.
  if ((e.edge.data as { aggregated?: boolean } | undefined)?.aggregated) {
    const portalId = [e.edge.source, e.edge.target].find(id => String(id).startsWith('portal:'))
    if (portalId) { onSearchPick(String(portalId).slice('portal:'.length)); return }
    const drillId = [e.edge.source, e.edge.target].find(id => (flat.value.childrenByParent.get(String(id)) || []).length)
    if (drillId) drillInto(String(drillId))
    return
  }
  const edge = (state.value?.edges || []).find(x => x.id === e.edge.id)
  if (!edge) return
  const cur = String(edge.properties?.routing || 'default')
  const next = ROUTE_CYCLE[(ROUTE_CYCLE.indexOf(cur as any) + 1) % ROUTE_CYCLE.length]
  apply([C.updateEdge(edge.id, { properties: { ...(edge.properties || {}), routing: next } })])
}

function toggleExpanded(id: string) {
  const next = new Set(expandedNodes.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  expandedNodes.value = next
  rebuild()
}
function toggleTree(id: string) {
  const next = new Set(treeExpanded.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  treeExpanded.value = next
}
function drillInto(id: string) {
  const index = viewStack.value.indexOf(id)
  viewStack.value = index >= 0 ? viewStack.value.slice(0, index + 1) : [...viewStack.value, id]
  expandedNodes.value = new Set()
  selectedNodeId.value = null
  selectedEdgeId.value = null
  aggEdge.value = null
  rebuild(true)
}
function navigateTo(index: number) {
  viewStack.value = index < 0 ? [] : viewStack.value.slice(0, index + 1)
  expandedNodes.value = new Set()
  selectedNodeId.value = null
  selectedEdgeId.value = null
  aggEdge.value = null
  rebuild(true)
}
function navigateUp() { if (viewStack.value.length) navigateTo(viewStack.value.length - 2) }

// ── Search ──
// Picking a result drills to the node's level when it is not on the current
// canvas, then selects and centers it.
function onSearchPick(id: string) {
  const target = ancestorPath(flat.value.nodeById, id)
  const visible = nodes.value.some(n => n.id === id)
  if (!visible && JSON.stringify(target) !== JSON.stringify(viewStack.value)) {
    viewStack.value = target
    expandedNodes.value = new Set()
    rebuild()
  }
  selectedNodeId.value = id
  selectedEdgeId.value = null
  schemaOpen.value = false
  panelOpen.value = true
  nextTick(async () => {
    const fn = nodes.value.find(n => n.id === id)
    if (!fn) return
    const w = Number(fn.dimensions?.width || fn.data?.width || 210)
    const h = Number(fn.dimensions?.height || 104)
    const zoom = Math.max(viewport.value.zoom || 1, 0.85)
    try { await setCenter(fn.position.x + w / 2, fn.position.y + h / 2, { zoom, duration: 250 }) }
    catch (err) { error.value = humanError(err, 'Couldn’t center this node. Try Fit view.') }
  })
}

// ── Context menus ──
function clientXY(e: MouseEvent | TouchEvent): { x: number; y: number } {
  const m = e instanceof MouseEvent ? e : e.touches[0]
  return { x: m.clientX, y: m.clientY }
}
function onNodeContextMenu(e: NodeMouseEvent) {
  if (!canEdit.value) return
  e.event.preventDefault()
  if (!state.value) return
  const id = e.node.id
  const portalTarget = (e.node.data as { portalTarget?: string } | undefined)?.portalTarget
  if (portalTarget) {
    const { x, y } = clientXY(e.event as MouseEvent)
    contextMenu.value = { x, y, items: [{ label: 'Open real node', action: () => onSearchPick(portalTarget) }] }
    return
  }
  const items: MenuItem[] = []
  const multi = getSelectedNodes.value
  const multiIds = multi.length > 1 ? multi.map((n: any) => String(n.id)) : null

  if (multiIds) {
    const modes: Array<[string, AlignMode]> = [
      ['Align left', 'left'], ['Align centers', 'center-h'], ['Align right', 'right'],
      ['Align top', 'top'], ['Align middles', 'center-v'], ['Align bottom', 'bottom'],
    ]
    for (const [label, mode] of modes) items.push({ label, action: () => applyAlign(mode) })
    if (multiIds.length > 2) {
      items.push({ label: 'Distribute horizontally', action: () => applyDistribute('h') })
      items.push({ label: 'Distribute vertically', action: () => applyDistribute('v') })
    }
    for (const t of flat.value.childrenByParent.get(viewRoot.value || '') || []) {
      if (!multiIds.includes(t.id)) items.push({ label: `Move into "${t.name}"`, action: () => reparent(multiIds, t.id) })
    }
    if (viewRoot.value) items.push({ label: 'Move to root', action: () => reparent(multiIds, null) })
    items.push({ label: `Delete ${multiIds.length} nodes`, danger: true, action: () => { selectedNodeId.value = null; removeNodesHealed(multiIds) } })
    const { x, y } = clientXY(e.event as MouseEvent)
    contextMenu.value = { x, y, items }
    return
  }

  const hasChildren = (flat.value.childrenByParent.get(id) || []).length > 0
  if (hasChildren) {
    items.push({ label: 'Drill into', action: () => drillInto(id) })
    items.push({ label: expandedNodes.value.has(id) ? 'Collapse' : 'Expand as boundary', action: () => toggleExpanded(id) })
  }
  items.push({ label: 'Add child', action: () => addChild(id) })
  const siblings = (flat.value.childrenByParent.get(viewRoot.value || '') || []).filter(n => n.id !== id)
  for (const t of siblings.slice(0, 8)) items.push({ label: `Move into "${t.name}"`, action: () => reparent([id], t.id) })
  if (flat.value.nodeById.get(id)?.parent_id) items.push({ label: 'Move to root', action: () => reparent([id], null) })
  items.push({ label: 'Delete', danger: true, action: () => { selectedNodeId.value = null; removeNodesHealed([id]) } })
  const { x, y } = clientXY(e.event as MouseEvent)
  contextMenu.value = { x, y, items }
}
// Double-click on empty canvas creates the default node right there, already
// in rename mode — the canvas-tool convention the palette never beats.
function onPaneDoubleClick(e: MouseEvent) {
  if (!state.value || !canEdit.value) return
  const at = screenToFlowCoordinate({ x: e.clientX, y: e.clientY })
  const id = addNode(defaultNodeType(), viewRoot.value, at)
  startNodeEdit(id, null)
}
function onPaneContextMenu(e: MouseEvent) {
  if (!canEdit.value) return
  e.preventDefault()
  if (!state.value) return
  // New nodes land where the menu was opened, not wherever layout defaults.
  const at = screenToFlowCoordinate({ x: e.clientX, y: e.clientY })
  const items = paneMenuItems({
    viewRoot: viewRoot.value,
    nodeTypes: sortedNodeTypes.value,
    navigateUp: () => navigateUp(),
    addNode: (type?: string) => addNode(type ?? defaultNodeType(), viewRoot.value, at),
  })
  contextMenu.value = { x: e.clientX, y: e.clientY, items }
}

// ── Layout ──
async function runAutoLayout() {
  if (!canEdit.value) return
  if (!state.value) return
  const positions = autoLayout(state.value, layoutDir.value, viewRoot.value)
  const cmds = Object.entries(positions).map(([id, p]) => C.setPosition(id, p.x, p.y))
  if (cmds.length) await apply(cmds, true)
}
function toggleLayoutDir() { layoutDir.value = layoutDir.value === 'TB' ? 'LR' : 'TB'; runAutoLayout() }
async function fit(options: Parameters<typeof fitView>[0] = { padding: 0.16, duration: 200 }) {
  try { await fitView(options) }
  catch (err) { error.value = humanError(err, 'Couldn’t fit the graph. Try Fit view again.') }
}

// ── Keyboard ──
// Consumed keys must not bubble past the component: the workspace shell owns a
// window-level Escape (closes the manage view), so an Escape the graph handles
// (deselect, close menu, navigate up, blur a field) is stopped here. An Escape
// with nothing left to do intentionally falls through to the shell.
function consume(e: KeyboardEvent) { e.preventDefault(); e.stopPropagation() }
function onKeyDown(e: KeyboardEvent) {
  if (!isFull.value) return
  if (isEditingTarget(e.target)) {
    if (e.key === 'Escape') {
      const el = e.target as HTMLElement
      if (typeof el.blur === 'function') el.blur()
      consume(e)
    }
    return
  }
  // Bare typing acts on the canvas: with a node selected it renames the node
  // in place, otherwise it drops into quick-find. Slash always finds.
  const intent = resolveTypeIntent({ key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, target: e.target }, !!selectedNodeId.value)
  if (intent === 'rename' && canEdit.value && selectedNodeId.value) {
    consume(e)
    startNodeEdit(selectedNodeId.value, e.key.length === 1 ? e.key : null)
    return
  }
  if (intent === 'search') {
    consume(e)
    searchRef.value?.focus(e.key === '/' ? '' : e.key)
    return
  }
  const action = resolveAction({ key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey, target: e.target })
  if (!canEdit.value && ['delete', 'undo', 'redo', 'duplicate', 'paste'].includes(action || '')) return
  if (action === 'delete') { consume(e); deleteSelected() }
  else if (action === 'undo') { consume(e); void runHistory('undo') }
  else if (action === 'redo') { consume(e); void runHistory('redo') }
  else if (action === 'duplicate') { consume(e); duplicateSelected() }
  else if (action === 'copy') { copySelected() }
  else if (action === 'paste') { consume(e); pasteClipboard() }
  else if (action === 'fit') { consume(e); fit() }
  else if (action === 'zoom-selection') {
    if (selectedNodeId.value) { consume(e); void fit({ nodes: [selectedNodeId.value], padding: 0.4, duration: 200, maxZoom: 1.2 }) }
  }
  else if (action === 'escape') {
    if (contextMenu.value) { consume(e); contextMenu.value = null }
    else if (selectedNodeId.value || selectedEdgeId.value) { consume(e); selectedNodeId.value = null; selectedEdgeId.value = null }
    else if (viewRoot.value) { consume(e); navigateUp() }
  }
}

function onAddNodeSelect(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  if (v) { addNode(v); (e.target as HTMLSelectElement).value = '' }
}
function toggleSchema() { schemaOpen.value = !schemaOpen.value; if (schemaOpen.value) panelOpen.value = true }

let off: Array<() => void> = []
onMounted(async () => {
  resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return
    const next = entry.contentRect.width <= 900
    if (next && !narrow.value) { treeOpen.value = false; panelOpen.value = false }
    narrow.value = next
  })
  if (rootEl.value) resizeObserver.observe(rootEl.value)
  await load(true)
  const tid = state.value?.thread_id
  if (tid) {
    try { off.push(on(projectionTopic(tid, PROJECTION_KIND), () => { void load(false, true) })) } catch { error.value = 'Live updates are unavailable. Reload to read the latest graph.' }
  }
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  const failures: unknown[] = []
  for (const fn of off) { try { fn() } catch (err) { failures.push(err) } }
  off = []
  if (failures.length) throw new AggregateError(failures, 'Couldn’t close live updates.')
})
</script>

<template>
  <div ref="rootEl" class="kg" :class="{ 'kg--preview': !isFull, 'kg-connecting': connecting }" tabindex="0" @keydown="onKeyDown">
    <div class="kg-top">
      <div class="kg-breadcrumbs">
        <button v-if="isFull" class="kg-icon-btn" :title="treeOpen ? 'Hide structure' : 'Show structure'" :aria-label="treeOpen ? 'Hide structure' : 'Show structure'" @click="toggleStructure"><Icon icon="tabler:layout-sidebar" aria-hidden="true" /></button>
        <button class="kg-crumb" :class="{ active: !breadcrumbs.length }" @click="navigateTo(-1)">Graph</button>
        <template v-for="(crumb, i) in breadcrumbs" :key="crumb.id">
          <span class="kg-sep">/</span>
          <button class="kg-crumb" :class="{ active: i === breadcrumbs.length - 1 }" @click="navigateTo(i)">{{ crumb.name }}</button>
        </template>
      </div>
      <div v-if="isFull" class="kg-actions">
        <GraphSearch ref="searchRef" :nodes="flat.nodes" :node-by-id="flat.nodeById" :type-defs="nodeTypeMap" @pick="onSearchPick" />
        <span class="kg-vsep"></span>
        <select v-if="canEdit" class="kg-sel" @change="onAddNodeSelect">
          <option value="" disabled selected>+ Node</option>
          <option v-for="d in sortedNodeTypes" :key="d.id" :value="d.id">{{ d.title || d.id }}</option>
        </select>
        <span class="kg-vsep"></span>
        <button v-if="canEdit" class="kg-icon-btn" :disabled="!state?.can_undo" title="Undo" aria-label="Undo" @click="runHistory('undo')"><Icon icon="tabler:arrow-back-up" aria-hidden="true" /></button>
        <button v-if="canEdit" class="kg-icon-btn" :disabled="!state?.can_redo" title="Redo" aria-label="Redo" @click="runHistory('redo')"><Icon icon="tabler:arrow-forward-up" aria-hidden="true" /></button>
        <span class="kg-vsep"></span>
        <button class="kg-icon-btn" title="Fit view" aria-label="Fit view" @click="fit()"><Icon icon="tabler:arrows-maximize" aria-hidden="true" /></button>
        <button v-if="canEdit" class="kg-icon-btn" title="Arrange nodes" aria-label="Auto layout" @click="runAutoLayout"><Icon icon="tabler:layout-distribute-horizontal" aria-hidden="true" /></button>
        <button v-if="canEdit" class="kg-icon-btn" :title="layoutDir === 'TB' ? 'Top→Bottom' : 'Left→Right'" :aria-label="layoutDir === 'TB' ? 'Use left-to-right layout' : 'Use top-to-bottom layout'" @click="toggleLayoutDir"><Icon :icon="layoutDir === 'TB' ? 'tabler:arrows-vertical' : 'tabler:arrows-horizontal'" aria-hidden="true" /></button>
        <span class="kg-vsep"></span>
        <button v-if="canEdit" class="kg-btn kg-btn--ghost" :class="{ active: schemaOpen }" @click="toggleSchema">Types</button>
        <span class="kg-count">{{ counts.nodes }} nodes · {{ counts.edges }} edges</span>
      </div>
    </div>

    <div v-if="error" class="kg-error">
      <span>{{ error }}</span>
      <button class="kg-error-x" title="Dismiss" aria-label="Dismiss error" @click="error = ''">×</button>
    </div>

    <div class="kg-body">
      <aside v-if="isFull && treeOpen" class="kg-tree">
        <div class="kg-tree-head">
          <span>Structure</span>
          <span class="kg-muted">{{ flat.nodes.length }}</span>
        </div>
        <div class="kg-tree-list">
          <div
            v-for="item in treeItems"
            :key="item.node.id"
            class="kg-tree-row"
            role="button"
            tabindex="0"
            :class="{ active: selectedNodeId === item.node.id }"
            :style="{ paddingLeft: `${8 + item.depth * 12}px` }"
            @click="selectedNodeId = item.node.id; selectedEdgeId = null; schemaOpen = false; panelOpen = true"
            @keydown.enter="selectedNodeId = item.node.id; selectedEdgeId = null; schemaOpen = false; panelOpen = true"
            @keydown.space.prevent="selectedNodeId = item.node.id; selectedEdgeId = null; schemaOpen = false; panelOpen = true"
            @dblclick="drillInto(item.node.id)"
          >
            <button v-if="item.childCount" class="kg-twist" :aria-label="item.expanded ? `Collapse ${item.node.name}` : `Expand ${item.node.name}`" @click.stop="toggleTree(item.node.id)">{{ item.expanded ? '▾' : '▸' }}</button>
            <span v-else class="kg-twist" aria-hidden="true"></span>
            <span class="kg-tree-dot" :style="{ background: nodeDotColor(item.node.type) }"></span>
            <span class="kg-tree-name">{{ item.node.name }}</span>
            <span v-if="item.childCount" class="kg-tree-count">{{ item.childCount }}</span>
          </div>
          <div v-if="!treeItems.length" class="kg-tree-empty">No nodes</div>
        </div>
      </aside>

      <main class="kg-canvas">
        <VueFlow
          :id="flowId"
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :nodes-draggable="canEdit"
          :nodes-connectable="canEdit"
          :elements-selectable="isFull"
          :selection-key-code="'Shift'"
          :multi-selection-key-code="'Shift'"
          :delete-key-code="null"
          :zoom-on-double-click="false"
          :snap-to-grid="true"
          :snap-grid="[10, 10]"
          :min-zoom="0.1"
          :max-zoom="2.5"
          :connection-radius="40"
          class="kg-flow"
          :class="{ 'kg-connect-live': connecting }"
          @pane-double-click="onPaneDoubleClick"
          @connect-start="onConnectStart"
          @connect-end="onConnectEnd"
          @node-click="onNodeClick"
          @node-double-click="onNodeDoubleClick"
          @edge-click="onEdgeClick"
          @edge-double-click="onEdgeDoubleClick"
          @pane-click="onPaneClick"
          @connect="onConnect"
          @node-drag="onNodeDrag"
          @node-drag-stop="onNodeDragStop"
          @node-context-menu="onNodeContextMenu"
          @pane-context-menu="onPaneContextMenu"
        >
          <Background pattern="dots" :gap="22" :size="1" pattern-color="color-mix(in srgb, var(--kg-muted) 30%, transparent)" />
          <Controls v-if="isFull" position="bottom-left" :show-interactive="false" />
          <MiniMap v-if="isFull" position="bottom-right" :pannable="true" :zoomable="true" />
        </VueFlow>

        <div v-if="screenGuides.length" class="kg-guides" aria-hidden="true">
          <div
            v-for="g in screenGuides"
            :key="g.key"
            class="kg-guide"
            :class="{ vertical: g.vertical }"
            :style="g.vertical
              ? { left: g.left + 'px', top: g.top + 'px', height: g.length + 'px' }
              : { left: g.left + 'px', top: g.top + 'px', width: g.length + 'px' }"
          />
        </div>

        <div v-if="state && !loading && !error && !nodes.length" class="kg-empty">
          <div class="kg-empty-inner">
            <p class="kg-empty-text">{{ viewRoot ? 'No children here' : 'Empty graph' }}</p>
            <button v-if="canEdit" class="kg-btn" @click="addNode()">Add a node</button>
          </div>
        </div>
        <span v-if="canEdit" class="kg-hint">Drag a port to connect · / to find</span>
      </main>

      <button v-if="isFull && !panelOpen" class="kg-panel-rail" title="Show inspector" aria-label="Show inspector" @click="panelOpen = true">‹</button>
      <aside v-else-if="isFull" class="kg-panel">
        <SchemaPanel
          v-if="schemaOpen"
          :node-types="nodeTypeDefs"
          :edge-types="edgeTypeDefs"
          :material-types="materialTypeDefs"
          @type-add="addType"
          @type-update="updateType"
          @type-remove="removeType"
          @seed="seedDefaults"
          @collapse="panelOpen = false"
          @close="schemaOpen = false"
        />
        <NodePanel
            :read-only="!canEdit"
          v-else-if="selectedNode"
          :node="selectedNode"
          :node-types="nodeTypeDefs"
          :material-types="materialTypeDefs"
          :materials="selectedNode.materials || []"
          :has-children="hasSelectedChildren"
          :expanded="expandedNodes.has(selectedNode.id)"
          @update="updateNode"
          @delete="deleteSelected"
          @material-add="(kind) => selectedNode && addMaterial('node', kind, selectedNode.id)"
          @component-ref-add="(kind) => selectedNode && addComponentRef('node', kind, selectedNode.id)"
          @material-update="updateMaterial"
          @material-remove="removeMaterial"
          @drill="() => selectedNode && drillInto(selectedNode.id)"
          @toggle-expand="() => selectedNode && toggleExpanded(selectedNode.id)"
          @collapse="panelOpen = false"
          @close="selectedNodeId = null"
        />
        <div v-else-if="aggEdge" class="kg-panel-inner">
          <div class="kg-panel-head">
            <span class="kg-kicker">Virtual edge</span>
            <button class="kg-x kg-x--chev" title="Hide inspector" aria-label="Hide inspector" @click="panelOpen = false">»</button>
            <button class="kg-x" title="Close" aria-label="Close" @click="aggEdge = null">×</button>
          </div>
          <div class="kg-agg-note">Summarizes {{ aggEdge.count }} relation{{ aggEdge.count === 1 ? '' : 's' }} hidden by the current layer. Double-click the edge to jump to where they live.</div>
          <div class="kg-section-head"><span>Underlying relations</span></div>
          <div class="kg-agg-list">
            <button
              v-for="m in aggEdge.members"
              :key="m.id"
              class="kg-agg-row"
              :title="'Jump to ' + m.source"
              @click="onSearchPick(m.sourceId)"
            >
              <span class="kg-agg-ends">{{ m.source }} <span class="kg-agg-arrow">→</span> {{ m.target }}</span>
              <span class="kg-agg-type">{{ m.label || m.type }}</span>
            </button>
          </div>
        </div>
        <EdgePanel
          :read-only="!canEdit"
          v-else-if="selectedEdge"
          :edge="selectedEdge"
          :edge-types="edgeTypeDefs"
          :material-types="materialTypeDefs"
          :materials="selectedEdge.materials || []"
          :source-name="flat.nodeById.get(selectedEdge.source_id)?.name"
          :target-name="flat.nodeById.get(selectedEdge.target_id)?.name"
          @update="updateEdge"
          @reverse="reverseSelectedEdge"
          @delete="deleteSelected"
          @material-add="(kind) => selectedEdge && addMaterial('edge', kind, selectedEdge.id)"
          @component-ref-add="(kind) => selectedEdge && addComponentRef('edge', kind, selectedEdge.id)"
          @material-update="updateMaterial"
          @material-remove="removeMaterial"
          @collapse="panelOpen = false"
          @close="selectedEdgeId = null"
        />
        <div v-else class="kg-panel-inner">
          <div class="kg-panel-head">
            <span class="kg-panel-title">Graph</span>
            <button class="kg-x kg-x--chev" title="Hide inspector" aria-label="Hide inspector" @click="panelOpen = false">»</button>
          </div>
          <div class="kg-stats">
            <span>{{ counts.nodes }} nodes</span>
            <span>{{ counts.edges }} edges</span>
            <span>{{ graphMaterials.length }} materials</span>
          </div>
          <div class="kg-section-head">
            <span>Graph materials</span>
            <button v-if="canEdit" class="kg-mini" aria-label="Add graph material" @click="addMaterial('graph', defaultMaterialType('graph'))">+</button>
          </div>
          <div v-if="canEdit" class="kg-materials">
            <MaterialCard
              v-for="mat in graphMaterials"
              :key="mat.id"
              :material="mat"
              :material-types="materialTypeDefs"
              :expanded="openGraphMats.has(mat.id)"
              @toggle="toggleGraphMat(mat.id)"
              @update="(patch) => updateMaterial({ id: mat.id, patch })"
              @remove="removeMaterial(mat.id)"
            />
            <div v-if="!graphMaterials.length" class="kg-empty-line">no graph materials</div>
          </div>
        </div>
      </aside>
    </div>

    <ContextMenu v-if="contextMenu" :x="contextMenu.x" :y="contextMenu.y" :items="contextMenu.items" @close="contextMenu = null" />
  </div>
</template>
