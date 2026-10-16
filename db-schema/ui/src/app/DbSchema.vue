<script setup lang="ts">
// Event-sourced schema graph rendered with @vue-flow (the Beacon model). The thread
// is the source of truth: every edit is a typed COMMAND (POST /apply) that appends
// an event; the view is the read model (GET state) the projection worker folds.
//
// Reactivity follows Beacon: nodes/edges are MUTABLE refs bound with v-model (a
// computed crashes vue-flow's internal mutation). rebuildFlow() diffs the read
// model into those refs; a realtime sync rebuilds WITHOUT re-fitting and honours
// recentSaves so a just-dragged node never snaps back — keeping sync sleek.
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useProps } from '@wippy-fe/webcomponent-vue'
import { api, on } from '@wippy-fe/proxy'
import { VueFlow, useVueFlow, MarkerType, type Node as FlowNode, type Edge as FlowEdge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import SchemaNode from './SchemaNode.vue'
import ContextMenu from './ContextMenu.vue'
import { EV, inverseBatch, type Cmd, type StateSnap } from './history'
import { buildDbml, buildSql } from './export'

interface Props { entryId?: string; mode?: string; readOnly?: boolean }
const props = useProps<Props>()
// props.value can be undefined on the first render tick — guard everything.
const entryId = computed(() => props.value?.entryId || '')
const isFull = computed(() => (props.value?.mode || 'preview') === 'full')
const canEdit = computed(() => isFull.value && !props.value?.readOnly)

type Column = { id: string; table_id: string; name: string; col_type?: string; primary_key?: boolean; nullable?: boolean; unique_col?: boolean }
type Table = { id: string; name: string; description?: string; columns: Column[]; layout?: { x: number; y: number } }
type Relation = { id: string; from_table_id: string; to_table_id: string; from_column_id?: string; to_column_id?: string; relation_type: string; name?: string }

const tables = ref<Table[]>([])
const relations = ref<Relation[]>([])
const nodes = ref<FlowNode[]>([])
const edges = ref<FlowEdge[]>([])
const threadId = ref('')
const loading = ref(true)
const error = ref('')
const selectedTableId = ref<string | null>(null)
const selectedRelationId = ref<string | null>(null)
const COL_TYPES = ['TEXT', 'INTEGER', 'BIGINT', 'BOOLEAN', 'NUMERIC', 'TIMESTAMP', 'UUID', 'JSONB']
const REL_TYPES = [
  { value: 'one_to_one', label: '1:1' },
  { value: 'one_to_many', label: '1:N' },
  { value: 'many_to_one', label: 'N:1' },
  { value: 'many_to_many', label: 'N:N' },
]
const REL_LABEL: Record<string, string> = { one_to_many: '1:N', many_to_one: 'N:1', one_to_one: '1:1', many_to_many: 'N:N' }
// Decorative categorical palette for relation types; these colors carry no severity.
const REL_COLOR: Record<string, string> = {
  one_to_one: 'var(--de-rel-one-to-one)',
  one_to_many: 'var(--de-accent)',
  many_to_one: 'var(--de-rel-many-to-one)',
  many_to_many: 'var(--de-rel-many-to-many)',
}
const PROJECTION_KIND = 'chestor.db_schema:state'

function errorMessage(error: unknown, fallback: string): string {
  const value = error as { response?: { data?: { error?: unknown } }; message?: unknown }
  const server = value?.response?.data?.error
  if (typeof server === 'string' && server) return server
  if (typeof value?.message === 'string' && value.message && !/request failed|status code/i.test(value.message)) return value.message
  return fallback
}

const base = () => `/api/v1/workspace/db-schema/${entryId.value}`
const selectedTable = () => tables.value.find(t => t.id === selectedTableId.value) || null
const selectedRelation = () => relations.value.find(r => r.id === selectedRelationId.value) || null
const relTableName = (id?: string) => tables.value.find(t => t.id === id)?.name || '?'
const relColName = (id?: string) => { for (const t of tables.value) { const c = (t.columns || []).find(c => c.id === id); if (c) return c.name } return null }
const colCount = () => tables.value.reduce((n, t) => n + (t.columns || []).length, 0)

const vfId = `dbflow-${entryId.value || 'x'}-${props.value?.mode || 'preview'}`
// Only fitView + screenToFlowCoordinate are needed from the instance. Canvas
// events are bound via template @-handlers below (plain functions) — NOT the
// useVueFlow on* hook registrars, which take a callback; binding a registrar as an
// @-handler feeds it the event object and later calls it as a function (vue-flow
// "x is not a function" crash).
const { fitView, screenToFlowCoordinate, onNodesInitialized } = useVueFlow(vfId)

// Right-click context menu (consistent with the workspace tree menu).
type MenuItem = { label: string; danger?: boolean; action: () => void }
const menu = ref<{ x: number; y: number; items: MenuItem[] } | null>(null)
function openMenu(ev: MouseEvent, items: MenuItem[]) { ev.preventDefault?.(); menu.value = { x: ev.clientX, y: ev.clientY, items } }
function closeMenu() { menu.value = null }

// recentSaves: a node the user just dragged keeps its local position for a moment
// so a realtime reload (which may not have folded yet) does not snap it back.
const recentSaves = new Map<string, { x: number; y: number; ts: number }>()
let didInitialFit = false

function posOf(t: Table, i: number): { x: number; y: number } {
  const r = recentSaves.get(t.id)
  if (r && Date.now() - r.ts < 5000) return { x: r.x, y: r.y }
  if (t.layout && typeof t.layout.x === 'number') return { x: t.layout.x, y: t.layout.y }
  return { x: 60 + (i % 4) * 320, y: 60 + Math.floor(i / 4) * 300 }
}
const nodeTypes = { schemaTable: markRaw(SchemaNode) }

// rebuildFlow: project the read model into the mutable node/edge refs. vue-flow
// diffs by id, so unchanged nodes keep their on-canvas position — no jump.
function rebuildFlow() {
  const nextNodes: FlowNode[] = tables.value.map((t, i) => ({
    id: t.id, type: 'schemaTable', position: posOf(t, i),
    data: { label: t.name, tableId: t.id, columns: t.columns || [], columnCount: (t.columns || []).length },
  }))
  nodes.value = nextNodes
  const ids = new Set(tables.value.map(t => t.id))
  const nextEdges: FlowEdge[] = relations.value
    .filter(r => ids.has(r.from_table_id) && ids.has(r.to_table_id))
    .map(r => {
      const color = REL_COLOR[r.relation_type] || 'var(--de-accent)'
      return {
        id: r.id, source: r.from_table_id, target: r.to_table_id,
        sourceHandle: r.from_column_id ? 'source-' + r.from_column_id : undefined,
        targetHandle: r.to_column_id ? 'target-' + r.to_column_id : undefined,
        type: 'smoothstep', class: 'rel-edge', label: r.name || REL_LABEL[r.relation_type] || r.relation_type,
        data: { relation_type: r.relation_type },
        style: { stroke: color, strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 11, color },
      }
    })
  edges.value = nextEdges
}

function setState(s: any) {
  tables.value = s?.tables ?? []
  relations.value = s?.relations ?? []
  if (s?.thread_id) threadId.value = s.thread_id
  rebuildFlow()
}
async function load(background = false) {
  if (!background) loading.value = true
  try {
    const { data } = await api.get(base())
    if (!data.success) throw new Error(data.error || 'Couldn’t load the schema.')
    setState(data.schema)
    error.value = ''
  } catch (e) { error.value = errorMessage(e, 'Couldn’t load the schema.') }
  finally { if (!background) loading.value = false }
}
// ── Undo / redo ──
// The thread stays append-only: undo applies the inverse command as a new
// event, computed against the read model captured just before the original.
const undoStack: Array<{ undo: Cmd[]; redo: Cmd[] }> = []
const redoStack: Array<{ undo: Cmd[]; redo: Cmd[] }> = []
function snapshot(): StateSnap {
  return JSON.parse(JSON.stringify({ tables: tables.value, relations: relations.value })) as StateSnap
}
async function applyCmds(commands: { type: string; body: Record<string, unknown> }[], record = true) {
  if (!canEdit.value) return
  error.value = ''
  if (record) {
    const inverse = inverseBatch(commands, snapshot())
    if (inverse) {
      undoStack.push({ undo: inverse, redo: commands })
      if (undoStack.length > 100) undoStack.shift()
      redoStack.length = 0
    }
  }
  try {
    const { data } = await api.post(`${base()}/apply`, { commands })
    if (!data.success) { error.value = data.error || 'apply failed'; return }
    setState(data.schema)
    error.value = ''
  } catch (e) { error.value = errorMessage(e, 'Couldn’t save the schema.') }
}
async function undo() {
  if (!canEdit.value) return
  const entry = undoStack.pop()
  if (!entry) return
  redoStack.push(entry)
  await applyCmds(entry.undo, false)
}
async function redo() {
  if (!canEdit.value) return
  const entry = redoStack.pop()
  if (!entry) return
  undoStack.push(entry)
  await applyCmds(entry.redo, false)
}
const apply = (type: string, body: Record<string, unknown>) => applyCmds([{ type, body }])
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))
async function doFit() {
  try { await fitView({ padding: 0.2, maxZoom: 1 }) }
  catch (err) { error.value = errorMessage(err, 'Couldn’t fit the schema. Try Fit again.') }
}

// ── structure commands ──
// Fresh names never collide — colliding names would export duplicate CREATE
// TABLE statements and read as one table on the canvas.
function nextName(base_: string, taken: string[]): string {
  if (!taken.includes(base_)) return base_
  let i = 2
  while (taken.includes(`${base_}_${i}`)) i++
  return `${base_}_${i}`
}
function focusPanelName() {
  void nextTick(() => {
    const root = (document.activeElement?.getRootNode?.() ?? document) as ParentNode
    const el = (root.querySelector?.('.de-panel-name') ?? document.querySelector('.de-panel-name')) as HTMLInputElement | null
    el?.focus()
    el?.select()
  })
}
function addTable(at?: { x: number; y: number }): string {
  const id = uid()
  const name = nextName('new_table', tables.value.map(t => t.name))
  const cmds: Cmd[] = [
    { type: EV.TABLE_ADDED, body: { id, name } },
    { type: EV.COLUMN_ADDED, body: { id: uid(), table_id: id, name: 'id', col_type: 'UUID', primary_key: true } },
  ]
  if (at) cmds.push({ type: EV.LAYOUT_POSITION_SET, body: { table_id: id, x: Math.round(at.x), y: Math.round(at.y) } })
  void applyCmds(cmds).then(() => { selectedRelationId.value = null; selectedTableId.value = id; focusPanelName() })
  return id
}
function duplicateTable(t: Table) {
  const id = uid()
  const name = nextName(t.name, tables.value.map(x => x.name))
  const cmds: Cmd[] = [{ type: EV.TABLE_ADDED, body: { id, name, description: t.description } }]
  for (const c of t.columns || []) {
    cmds.push({ type: EV.COLUMN_ADDED, body: { id: uid(), table_id: id, name: c.name, col_type: c.col_type, primary_key: c.primary_key, nullable: c.nullable, unique_col: c.unique_col } })
  }
  const at = t.layout && typeof t.layout.x === 'number' ? { x: t.layout.x + 40, y: t.layout.y + 40 } : undefined
  if (at) cmds.push({ type: EV.LAYOUT_POSITION_SET, body: { table_id: id, x: Math.round(at.x), y: Math.round(at.y) } })
  void applyCmds(cmds).then(() => { selectedRelationId.value = null; selectedTableId.value = id })
}
function renameTable(t: Table, name: string) { if (name && name !== t.name) apply(EV.TABLE_UPDATED, { id: t.id, name }) }
function describeTable(t: Table, description: string) { apply(EV.TABLE_UPDATED, { id: t.id, description }) }
function removeTable(t: Table) { apply(EV.TABLE_REMOVED, { id: t.id }); if (selectedTableId.value === t.id) selectedTableId.value = null }
function addColumn(t: Table) {
  const name = nextName('column', (t.columns || []).map(c => c.name))
  apply(EV.COLUMN_ADDED, { id: uid(), table_id: t.id, name, col_type: 'TEXT' })
}
function updateColumn(c: Column, patch: Record<string, unknown>) { apply(EV.COLUMN_UPDATED, { id: c.id, ...patch }) }
function removeColumn(c: Column) { apply(EV.COLUMN_REMOVED, { id: c.id }) }
// ── relation commands ──
function setRelationType(r: Relation, relation_type: string) { if (relation_type !== r.relation_type) apply(EV.RELATION_UPDATED, { id: r.id, relation_type }) }
function nameRelation(r: Relation, name: string) { if (name !== (r.name || '')) apply(EV.RELATION_UPDATED, { id: r.id, name }) }
function removeRelation(r: Relation) { apply(EV.RELATION_REMOVED, { id: r.id }); if (selectedRelationId.value === r.id) selectedRelationId.value = null }

// ── canvas event handlers (bound via template @-events) ──
// vue-flow measures async-added nodes only after they mount; fitView before that
// no-ops (the viewport stays at identity and the graph sits at raw coordinates).
// onNodesInitialized fires once the nodes have real dimensions -- the correct
// moment for the one-time initial fit. Realtime reloads never refit (the guard).
onNodesInitialized(() => { if (!didInitialFit && nodes.value.length) { didInitialFit = true; doFit() } })
function onNodeDragStop({ nodes: dragged }: any) {
  const cmds: { type: string; body: Record<string, unknown> }[] = []
  for (const n of dragged || []) {
    const x = Math.round(n.position.x), y = Math.round(n.position.y)
    recentSaves.set(n.id, { x, y, ts: Date.now() })
    cmds.push({ type: EV.LAYOUT_POSITION_SET, body: { table_id: n.id, x, y } })
  }
  if (cmds.length) applyCmds(cmds)
}
let dragFrom: { table: string; column?: string } | null = null
let dragConnected = false
function onConnectStart(params: any) {
  dragConnected = false
  dragFrom = params?.nodeId && params?.handleType === 'source'
    ? { table: params.nodeId, column: (params.handleId || '').replace('source-', '') || undefined }
    : null
}
function onConnect(c: any) {
  dragConnected = true
  if (!canEdit.value || !c.source || !c.target) return
  const from_column_id = (c.sourceHandle || '').replace('source-', '') || undefined
  const to_column_id = (c.targetHandle || '').replace('target-', '') || undefined
  // The same pair of endpoints related twice reads as one line and exports twice.
  const dup = relations.value.some(r =>
    r.from_table_id === c.source && r.to_table_id === c.target &&
    (r.from_column_id || undefined) === from_column_id && (r.to_column_id || undefined) === to_column_id)
  if (dup) return
  apply(EV.RELATION_ADDED, {
    id: uid(), from_table_id: c.source, to_table_id: c.target,
    from_column_id, to_column_id,
    relation_type: 'one_to_many',
  })
}
// A relation drag released on empty canvas creates the referenced table right
// there, already wired — the add-place-connect gesture.
function onConnectEnd(e?: MouseEvent | TouchEvent) {
  const from = dragFrom
  dragFrom = null
  if (dragConnected || !from || !canEdit.value) return
  if (!(e instanceof MouseEvent)) return
  const target = e.target as HTMLElement | null
  if (!target || !target.classList.contains('vue-flow__pane')) return
  const at = screenToFlowCoordinate({ x: e.clientX, y: e.clientY })
  const id = uid()
  const pk = uid()
  const name = nextName('new_table', tables.value.map(t => t.name))
  void applyCmds([
    { type: EV.TABLE_ADDED, body: { id, name } },
    { type: EV.COLUMN_ADDED, body: { id: pk, table_id: id, name: 'id', col_type: 'UUID', primary_key: true } },
    { type: EV.LAYOUT_POSITION_SET, body: { table_id: id, x: Math.round(at.x), y: Math.round(at.y) } },
    { type: EV.RELATION_ADDED, body: { id: uid(), from_table_id: from.table, to_table_id: id, from_column_id: from.column, to_column_id: pk, relation_type: 'one_to_many' } },
  ]).then(() => { selectedRelationId.value = null; selectedTableId.value = id; focusPanelName() })
}
// Hovering a table spotlights its relation neighborhood: connected tables and
// edges stay full, everything else dims (the Liam/ChartDB pattern).
function setHover(id: string | null) {
  const keepN = new Set<string>(), keepE = new Set<string>()
  if (id) {
    keepN.add(id)
    for (const r of relations.value) {
      if (r.from_table_id === id || r.to_table_id === id) { keepE.add(r.id); keepN.add(r.from_table_id); keepN.add(r.to_table_id) }
    }
  }
  for (const n of nodes.value) n.class = id && !keepN.has(n.id) ? 'de-dim' : ''
  for (const e of edges.value) e.class = id ? (keepE.has(e.id) ? 'rel-edge de-edge-hot' : 'rel-edge de-dim') : 'rel-edge'
}
function onNodeMouseEnter({ node }: any) { if (node?.id) setHover(node.id) }
function onNodeMouseLeave() { setHover(null) }
function onNodeClick({ node }: any) { if (isFull.value) { selectedRelationId.value = null; selectedTableId.value = node.id } }
function onEdgeClick({ edge }: any) { if (isFull.value && edge?.id) { selectedTableId.value = null; selectedRelationId.value = edge.id } }
function onPaneClick() { selectedTableId.value = null; selectedRelationId.value = null; closeMenu() }

// ── right-click context menus ──
function onNodeContextMenu({ event, node }: any) {
  if (!canEdit.value) return
  const t = tables.value.find(x => x.id === node.id); if (!t) return
  openMenu(event, [
    { label: 'Edit table', action: () => { selectedRelationId.value = null; selectedTableId.value = t.id } },
    { label: 'Add column', action: () => addColumn(t) },
    { label: 'Duplicate table', action: () => duplicateTable(t) },
    { label: 'Delete table', danger: true, action: () => removeTable(t) },
  ])
}
function onEdgeContextMenu({ event, edge }: any) {
  if (!canEdit.value) return
  const r = relations.value.find(x => x.id === edge.id); if (!r) return
  openMenu(event, [
    { label: 'Edit relation', action: () => { selectedTableId.value = null; selectedRelationId.value = r.id } },
    { label: 'Delete relation', danger: true, action: () => removeRelation(r) },
  ])
}
function onPaneContextMenu(e: any) {
  if (!canEdit.value) return
  const ev: MouseEvent = e?.event || e
  ev.preventDefault?.()
  openMenu(ev, [{ label: 'Add table here', action: () => addTableAt(ev) }])
}
function addTableAt(ev: MouseEvent) {
  let at: { x: number; y: number } | undefined
  try { const p = screenToFlowCoordinate({ x: ev.clientX, y: ev.clientY }); at = { x: p.x, y: p.y } }
  catch (err) { error.value = errorMessage(err, 'Couldn’t place this table. Try again.'); return }
  addTable(at)
}

function autoLayout() {
  const cmds = tables.value.map((t, i) => ({ type: EV.LAYOUT_POSITION_SET, body: { table_id: t.id, x: 60 + (i % 4) * 340, y: 60 + Math.floor(i / 4) * 320 } }))
  recentSaves.clear()
  if (cmds.length) applyCmds(cmds).then(() => nextTick(doFit))
}

// Export via the pure serializers; the button opens a format menu.
function download(text: string, filename: string, mime: string) {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
function exportMenu(ev: MouseEvent) {
  openMenu(ev, [
    { label: 'SQL (.sql)', action: () => download(buildSql(tables.value, relations.value), 'schema.sql', 'text/sql') },
    { label: 'DBML (.dbml)', action: () => download(buildDbml(tables.value, relations.value), 'schema.dbml', 'text/plain') },
  ])
}

// ── Keyboard ──
// Bound on the root element (the vue-flow pane is focusable, so canvas keys
// bubble here); never fires while a form field is editing.
const rootEl = ref<HTMLElement | null>(null)
function isEditingTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName || ''))
}
function onKeyDown(e: KeyboardEvent) {
  if (!canEdit.value) return
  if (isEditingTarget(e.composedPath()[0] ?? e.target)) {
    if (e.key === 'Escape') (e.composedPath()[0] as HTMLElement)?.blur?.()
    return
  }
  const mod = e.ctrlKey || e.metaKey
  if (mod && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); void (e.shiftKey ? redo() : undo()) }
  else if (mod && (e.key === 'y' || e.key === 'Y')) { e.preventDefault(); void redo() }
  else if (mod && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); const t = selectedTable(); if (t) duplicateTable(t) }
  else if (mod && e.key === 'Enter') {
    e.preventDefault()
    if (e.shiftKey) addTable()
    else { const t = selectedTable(); if (t) addColumn(t) }
  }
  else if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    const r = selectedRelation()
    const t = selectedTable()
    if (r) removeRelation(r)
    else if (t) removeTable(t)
  } else if (e.key === 'Escape') {
    if (menu.value) closeMenu()
    else { selectedTableId.value = null; selectedRelationId.value = null }
  } else if (e.shiftKey && (e.key === '1' || e.key === '!')) { e.preventDefault(); doFit() }
}

// ── realtime read-model sync (no refit, recentSaves keeps drags stable) ──
let offs: Array<() => void> = []
onMounted(async () => {
  await load()
  const tid = threadId.value
  if (tid) {
    for (const t of [`kickside.thread.${tid}.projection.${PROJECTION_KIND}`, `kickside.thread.${tid}`]) {
      try { offs.push(on(t, () => { void load(true) })) } catch { error.value = 'Live updates are unavailable. Reload to read the latest schema.' }
    }
  }
})
onBeforeUnmount(() => {
  const failures: unknown[] = []
  for (const f of offs) { try { f() } catch (err) { failures.push(err) } }
  offs = []
  if (failures.length) throw new AggregateError(failures, 'Couldn’t close live updates.')
})
</script>

<template>
  <div ref="rootEl" class="de" :class="isFull ? 'de--full' : 'de--preview'" tabindex="0" @keydown="onKeyDown">
    <div v-if="error" class="de-error">
      <span>{{ error }}</span>
      <button class="de-btn" :disabled="loading" aria-label="Retry schema loading" @click="load()">Retry</button>
      <button class="de-x de-x-sm" type="button" aria-label="Dismiss error" title="Dismiss" @click="error = ''">×</button>
    </div>

    <div v-if="isFull" class="de-toolbar">
      <button v-if="canEdit" class="de-btn" @click="addTable">+ Table</button>
      <button class="de-btn de-ghost" title="Fit to view" @click="doFit">Fit</button>
      <button v-if="canEdit" class="de-btn de-ghost" title="Auto layout" @click="autoLayout">Arrange</button>
      <button class="de-btn de-ghost" title="Export schema" @click="exportMenu($event)">Export</button>
      <span class="de-spacer" />
      <span class="de-muted de-sm">{{ tables.length }} tables · {{ colCount() }} cols · {{ relations.length }} rel · live</span>
    </div>

    <div class="de-flow-wrap">
      <VueFlow :id="vfId" v-model:nodes="nodes" v-model:edges="edges" :node-types="nodeTypes" class="de-flow schema-canvas"
        :nodes-draggable="canEdit" :nodes-connectable="canEdit"
        :elements-selectable="isFull"
        :connection-line-style="{ stroke: 'var(--de-accent)', strokeWidth: 2, strokeDasharray: '5 4' }" :connection-radius="40"
        :min-zoom="0.15" :max-zoom="2" :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        @node-drag-stop="onNodeDragStop" @node-click="onNodeClick"
        @edge-click="onEdgeClick" @pane-click="onPaneClick"
        @connect-start="onConnectStart" @connect="onConnect" @connect-end="onConnectEnd"
        @node-context-menu="onNodeContextMenu" @edge-context-menu="onEdgeContextMenu" @pane-context-menu="onPaneContextMenu"
        @node-mouse-enter="onNodeMouseEnter" @node-mouse-leave="onNodeMouseLeave">
        <Background pattern="dots" :gap="20" :size="1" pattern-color="color-mix(in srgb, var(--p-text-color) 22%, transparent)" />
        <Controls v-if="isFull" position="bottom-left" :show-interactive="false" />
        <MiniMap v-if="isFull" position="bottom-right" :pannable="true" :zoomable="true" />
      </VueFlow>

      <div v-if="loading" class="de-empty" role="status">Loading schema…</div>
      <div v-if="!tables.length && !loading && !error" class="de-empty">{{ canEdit ? 'No tables — add one to start designing.' : 'No tables in this schema.' }}</div>

      <!-- right-click context menu (backdrop catches the dismiss click) -->
      <ContextMenu v-if="menu" :x="menu.x" :y="menu.y" :items="menu.items" @close="closeMenu" />

      <aside v-if="isFull && !canEdit && selectedTable()" class="de-panel">
        <div class="de-panel-head"><h3 class="de-panel-name">{{ selectedTable()!.name }}</h3><button class="de-x" aria-label="Close table inspector" @click="selectedTableId = null">×</button></div>
        <p v-if="selectedTable()!.description" class="de-read-description">{{ selectedTable()!.description }}</p>
        <div class="de-panel-label">Columns <span class="de-muted">{{ selectedTable()!.columns.length }}</span></div>
        <dl class="de-read-columns"><template v-for="c in selectedTable()!.columns" :key="c.id"><dt>{{ c.name }}</dt><dd>{{ c.col_type }}<span v-if="c.primary_key"> · Primary key</span><span v-if="c.unique_col"> · Unique</span><span v-if="c.nullable === false"> · Required</span></dd></template></dl>
        <p class="de-read-description de-muted">Read only</p>
      </aside>

      <aside v-if="canEdit && selectedTable()" class="de-panel">
        <div class="de-panel-head">
          <span class="de-panel-kind">TABLE</span>
          <input class="de-panel-name" :value="selectedTable()!.name" @change="renameTable(selectedTable()!, ($event.target as HTMLInputElement).value)" />
          <button class="de-x" type="button" aria-label="Close table editor" title="Close" @click="selectedTableId = null">×</button>
        </div>
        <input class="de-panel-desc" :value="selectedTable()!.description || ''" placeholder="Add a description…" @change="describeTable(selectedTable()!, ($event.target as HTMLInputElement).value)" />
        <div class="de-panel-label">Columns <span class="de-muted de-sm">{{ selectedTable()!.columns.length }}</span></div>
        <div class="de-panel-cols">
          <div v-for="c in selectedTable()!.columns" :key="c.id" class="de-panel-col">
            <button class="de-flag de-pk" :class="{ on: c.primary_key }" title="Primary key" @click="updateColumn(c, { primary_key: !c.primary_key })">PK</button>
            <input class="de-col-name" :value="c.name" @change="updateColumn(c, { name: ($event.target as HTMLInputElement).value })" />
            <select class="de-col-type" :value="c.col_type" @change="updateColumn(c, { col_type: ($event.target as HTMLSelectElement).value })">
              <option v-for="ty in COL_TYPES" :key="ty" :value="ty">{{ ty }}</option>
            </select>
            <button class="de-flag de-uq" :class="{ on: c.unique_col }" title="Unique" @click="updateColumn(c, { unique_col: !c.unique_col })">UQ</button>
            <button class="de-flag de-nn" :class="{ on: c.nullable === false }" title="Not null" @click="updateColumn(c, { nullable: !(c.nullable === false) })">NN</button>
            <button class="de-x de-x-sm" type="button" aria-label="Remove column" title="Remove column" @click="removeColumn(c)">×</button>
          </div>
          <p v-if="!selectedTable()!.columns.length" class="de-muted de-sm">No columns yet.</p>
        </div>
        <div class="de-panel-foot">
          <button class="de-btn" @click="addColumn(selectedTable()!)">+ Column</button>
          <button class="de-btn de-danger" @click="removeTable(selectedTable()!)">Delete table</button>
        </div>
      </aside>

      <!-- Relation (edge) editor -->
      <aside v-if="canEdit && selectedRelation()" class="de-panel de-rel-panel">
        <div class="de-panel-head">
          <span class="de-panel-kind" :style="{ color: REL_COLOR[selectedRelation()!.relation_type] }">RELATION</span>
          <span class="de-rel-badge" :style="{ background: 'color-mix(in srgb, ' + (REL_COLOR[selectedRelation()!.relation_type]) + ' 18%, transparent)', color: REL_COLOR[selectedRelation()!.relation_type] }">{{ REL_LABEL[selectedRelation()!.relation_type] || selectedRelation()!.relation_type }}</span>
          <span class="de-spacer" />
          <button class="de-x" type="button" aria-label="Close relation editor" title="Close" @click="selectedRelationId = null">×</button>
        </div>
        <div class="de-rel-ends">
          <div class="de-rel-end">
            <span class="de-rel-tbl">{{ relTableName(selectedRelation()!.from_table_id) }}</span>
            <span v-if="relColName(selectedRelation()!.from_column_id)" class="de-rel-col">{{ relColName(selectedRelation()!.from_column_id) }}</span>
          </div>
          <span class="de-rel-arrow" :style="{ color: REL_COLOR[selectedRelation()!.relation_type] }">→</span>
          <div class="de-rel-end">
            <span class="de-rel-tbl">{{ relTableName(selectedRelation()!.to_table_id) }}</span>
            <span v-if="relColName(selectedRelation()!.to_column_id)" class="de-rel-col">{{ relColName(selectedRelation()!.to_column_id) }}</span>
          </div>
        </div>
        <div class="de-rel-section">
          <label class="de-panel-label">Type</label>
          <div class="de-rel-types">
            <button v-for="rt in REL_TYPES" :key="rt.value" class="de-rel-type"
              :class="{ on: selectedRelation()!.relation_type === rt.value }"
              :style="selectedRelation()!.relation_type === rt.value ? { borderColor: REL_COLOR[rt.value], color: REL_COLOR[rt.value] } : {}"
              @click="setRelationType(selectedRelation()!, rt.value)">{{ rt.label }}</button>
          </div>
        </div>
        <div class="de-rel-section">
          <label class="de-panel-label">Name</label>
          <input class="de-col-name" :value="selectedRelation()!.name || ''" placeholder="fk_name (optional)" @change="nameRelation(selectedRelation()!, ($event.target as HTMLInputElement).value)" />
        </div>
        <div class="de-panel-foot">
          <button class="de-btn de-danger" @click="removeRelation(selectedRelation()!)">Delete relation</button>
        </div>
      </aside>
    </div>
  </div>
</template>
