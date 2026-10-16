<script setup lang="ts">
import { COLOR_CHOICES } from './color-choices'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { rendererAttrs } from '../entry-rendering'
import type { Entry, EntryType } from '../types'
import { useComponentEvents, useComponentProps } from '../constants'
import { useWorkspaceApi } from './useWorkspaceApi'
import { Button, EmptyState, FormField, IconButton, IconField, Notice, Pill, SearchField, Spinner, TextInput } from './shared'
import EntryRenderer from './EntryRenderer.vue'
import MenuLayer from './MenuLayer.vue'
import ShareHost from './ShareHost.vue'
import ComponentView from './ComponentView.vue'

// chestor-workspace -- the canonical shell. It OWNS navigation (breadcrumbs +
// back), the entry tree (list/grid), create/upload/import, a resizable preview,
// a right-click menu, and a Properties dialog. Every action is gated by the
// actor's component access mask; type behaviour comes from the registry alone.
const api = useWorkspaceApi()
const wprops = useComponentProps()
const emitNav = useComponentEvents()

const ACCESS = { READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 }
function can(e: Entry | null | undefined, bit: number): boolean {
  const a = e?.access_level
  return a == null || (Number(a) & bit) === bit
}
// One containment test everywhere: declared folders and container kinds behave
// identically (navigation, drops, menus, delete rationale).
function isContainer(e: Entry | null | undefined): boolean {
  return !!e && (e.type === 'folder' || !!e.container)
}
function formatAccess(a: unknown): string {
  if (a == null) return 'Full'
  const m = Number(a)
  const parts = [[ACCESS.READ, 'Read'], [ACCESS.WRITE, 'Write'], [ACCESS.DELETE, 'Delete'], [ACCESS.ADMIN, 'Admin']] as const
  const out = parts.filter(([bit]) => (m & bit) === bit).map(([, label]) => label)
  return out.length ? out.join(' · ') : 'None'
}

const entries = ref<Entry[]>([])
const query = ref('')
const breadcrumbs = ref<{ id: string; name: string; type: string }[]>([])
const currentParent = ref<string | null>(null)
const currentFolder = ref<Entry | null>(null)
const selected = ref<Entry | null>(null)
const loading = ref(false)
const error = ref('')
const viewMode = ref<'list' | 'grid'>((localStorage.getItem('ws-view') as 'list' | 'grid') || 'list')

const showCreate = ref(false)
const creating = ref<EntryType | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const dragOver = ref(false)

// ── Type registry (icons/colors/renderers) ──
const typeMap = computed<Record<string, EntryType>>(() => {
  const m: Record<string, EntryType> = {}
  for (const t of api.types.value) m[t.value] = t
  return m
})
// Several registry declarations can share one entry value (six providers all
// declare value "connection"); any of their labels would mislabel the rest, so
// colliding values fall back to the generic segment name.
const ambiguousTypeValues = computed<Set<string>>(() => {
  const seen = new Set<string>(), dup = new Set<string>()
  for (const t of api.types.value) (seen.has(t.value) ? dup : seen).add(t.value)
  return dup
})
// Only kinds with a create surface belong in the "+" picker; uploads is creatable
// programmatically (provisioned singleton) but declares no create view. Folder leads
// (the common case); the rest follow alphabetically.
const creatableTypes = computed(() => api.types.value
  .filter(t => t.creatable && !t.picker_excluded && t.create?.view)
  .sort((a, b) => (a.value === 'folder' ? -1 : b.value === 'folder' ? 1 : (a.label || '').localeCompare(b.label || ''))))
const canWriteHere = computed(() => can(currentFolder.value, ACCESS.WRITE))
// Folders and container kinds always list first, each group alphabetical; the
// filter narrows by name within the current folder.
const visibleEntries = computed<Entry[]>(() => {
  const q = query.value.trim().toLowerCase()
  const base = q ? entries.value.filter(e => (e.name || '').toLowerCase().includes(q)) : [...entries.value]
  return base.sort((a, b) => {
    const ga = isContainer(a) ? 0 : 1, gb = isContainer(b) ? 0 : 1
    if (ga !== gb) return ga - gb
    return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
  })
})

function iconOf(e: Entry): string {
  return e.icon || (e.meta?.icon as string) || typeMap.value[e.type]?.icon || 'tabler:file'
}
function colorOf(e: Entry): string {
  return (e.meta?.color as string) || typeMap.value[e.type]?.color || 'var(--km-muted)'
}
function chip(e: Entry): string {
  const label = ambiguousTypeValues.value.has(e.type) ? '' : typeMap.value[e.type]?.label
  if (label) return label.toUpperCase()
  // Unlabeled kinds show their last id segment, not the raw namespaced id.
  const seg = (e.type || 'item').split('.').pop() || 'item'
  return seg.replace(/[_-]+/g, ' ').toUpperCase()
}
function toDate(v: unknown): Date | null {
  if (v == null || v === '') return null
  if (typeof v === 'number') return new Date(v < 2e10 ? v * 1000 : v)
  const d = new Date(String(v))
  return isNaN(d.getTime()) ? null : d
}
function formatAge(v: unknown): string {
  const d = toDate(v); if (!d) return ''
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60) return 'now'
  if (s < 3600) return Math.floor(s / 60) + 'm'
  if (s < 86400) return Math.floor(s / 3600) + 'h'
  return Math.floor(s / 86400) + 'd'
}
function formatDate(v: unknown): string {
  const d = toDate(v); if (!d) return '—'
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Renderer mount: same renderer, two modes (preview = compact in the panel,
// full = the manage view). Mode is passed to the element so the type renders its
// own preview vs manage surface, exactly like Beacon's sub-path split. ──
function tagFor(e: Entry): string {
  // Prefer the entry's own renderer (resolved from its kind binding) so any kind
  // reuses its module page; fall back to the type registry for legacy kinds.
  const r = e.renderer || typeMap.value[e.type]?.renderer
  if (!r) return ''
  return r.startsWith('/c/') ? r.slice(3) : r
}
function attrsFor(e: Entry, mode: 'preview' | 'full'): Record<string, string> {
  // entry-id for typed renderers (wc-resource-view); route is the entry id for
  // route-driven module pages (e.g. kickside-knowledge deep-links to the KB by id).
  const a = rendererAttrs(e, mode)
  const uploadId = e.meta?.upload_id as string | undefined
  if (uploadId) {
    a['source-url'] = `/api/v1/uploads/${uploadId}/raw`
    a['content-type'] = (e.meta?.content_type as string) || ''
    a['filename'] = e.name
  }
  return a
}

// Route = the single focused entry id at /workspace/<id> (the shell owns the URL;
// route's first segment is that id). It restores the whole view from one id: a
// folder id lists that folder, a leaf id lists the leaf's own folder AND opens
// its full manage view. The API's breadcrumbs turn the one id back into the full
// chain, so reload or share of /workspace/<id> lands exactly here. All user
// navigation emits `navigate` (never calls nav directly) so every folder change
// round-trips through the shell URL; resolveRoute is the single nav driver. Only
// same-folder data refreshes (post-action re-list) call nav in place. "" = tree.
const managing = ref<Entry | null>(null)
const routeId = computed(() => String(wprops.value.route || '').replace(/^\/+|\/+$/g, '').split('/')[0] || '')
function openManage(e: Entry) {
  closeMenu()
  emitNav('navigate', e.id)
}
function closeManage() { emitNav('navigate', currentParent.value || '') }
// Resolve the route id into the tree: empty → root; folder → list it; leaf → list
// its parent folder then open its manage view. Resolve from the loaded list first,
// else fetch the entry. Guards skip redundant re-lists so switching between leaves
// in the same folder (or reopening the current folder) does not reload the list.
async function resolveRoute() {
  const id = routeId.value
  if (!id) {
    managing.value = null
    if (currentParent.value !== null || entries.value.length === 0) await nav(null)
    return
  }
  let entry = entries.value.find(e => e.id === id) || null
  if (!entry) {
    try { entry = await api.get(id) }
    catch (e) { error.value = e instanceof Error ? e.message : 'failed to open entry'; return }
  }
  if (!entry) { error.value = 'entry not found'; return }
  if (isContainer(entry)) {
    managing.value = null
    if (currentParent.value !== id) await nav(id)
    return
  }
  const parent = entry.parent_id ?? null
  if (currentParent.value !== parent || entries.value.length === 0) await nav(parent)
  managing.value = entry
}
watch(routeId, resolveRoute)

// ── Navigation ──
let navSeq = 0
async function nav(parentId: string | null) {
  // A refresh (same folder — e.g. the post-action re-list from refreshSoon) keeps the
  // current list and preview on screen and swaps the data in place: no spinner, no white
  // flash. Only a real navigation (folder change) or the first load clears the selection
  // and shows the loading spinner.
  const isRefresh = parentId === currentParent.value && entries.value.length > 0
  currentParent.value = parentId
  if (!isRefresh) { selected.value = null; query.value = ''; loading.value = true }
  closeMenu()
  error.value = ''
  const seq = ++navSeq
  try {
    const next = await api.list(parentId)
    if (seq !== navSeq) return
    entries.value = next
    // Drop a stale selection whose entry vanished in the refresh (deleted elsewhere).
    const sel = selected.value
    if (sel && !next.some(e => e.id === sel.id)) selected.value = null
    breadcrumbs.value = parentId ? await api.breadcrumbs(parentId) : []
    currentFolder.value = parentId ? await api.get(parentId) : null
    if (seq !== navSeq) return
  } catch (e) {
    if (seq !== navSeq) return
    error.value = e instanceof Error ? e.message : 'failed to load'
    if (!isRefresh) entries.value = []
  } finally {
    if (seq === navSeq) loading.value = false
  }
}

function open(e: Entry) {
  // Folder browse goes through the shell URL; leaf preview stays local (out of the URL).
  if (isContainer(e)) { emitNav('navigate', e.id); return }
  selected.value = selected.value?.id === e.id ? null : e
}

// ── Create / upload ──
// Picking a creatable type mounts that kind's declared create.view (a web
// component) in a popup; the kind owns its create form. The shell only reacts to
// the bubbling `created`/`close` events the create element emits.
const createAttrs = computed(() => ({
  type: creating.value?.value || '',
  'parent-id': currentParent.value || '',
  mode: 'create',
}))
// The built-in name+icon create dialog (entry_types.lua GENERIC_CREATE_TAG) is
// self-contained: it renders its own centered dialog, so it mounts straight on the
// backdrop. Custom create views (agent/kb/automations) are embedded and instead get
// the create-panel chrome -- wrapping the generic one there would nest two dialogs.
const GENERIC_CREATE_TAG = 'wc-entry-create'
const isGenericCreate = computed(() => creating.value?.create?.view === GENERIC_CREATE_TAG)
function pickType(t: EntryType) { showCreate.value = false; creating.value = t }
function onCreated() { creating.value = null; nav(currentParent.value) }
// The upload pipeline creates the file component asynchronously (on completion),
// so re-list a few times to pick it up without a realtime channel.
function refreshSoon() {
  nav(currentParent.value)
  for (const ms of [900, 2200, 4500]) setTimeout(() => nav(currentParent.value), ms)
}
async function uploadFilesTo(files: File[], parentId: string | null) {
  uploading.value = true; error.value = ''
  try {
    for (const f of files) await api.uploadFile(f, parentId)
    refreshSoon()
  } catch (e) { error.value = e instanceof Error ? e.message : 'upload failed' }
  finally { uploading.value = false }
}
// Every dropped file enters the shared uploads pipeline. Transfer bundles are handled
// there by kickside.transfer's upload stage; normal files are filed by workspace's
// upload stage. The workspace shell does not own a second import path.
async function dropFilesTo(files: File[], parentId: string | null) {
  await uploadFilesTo(files, parentId)
}
function uploadFiles(files: FileList) { void uploadFilesTo(Array.from(files), currentParent.value) }
function onPickFiles(ev: Event) {
  const input = ev.target as HTMLInputElement
  if (input.files?.length) uploadFiles(input.files)
  input.value = ''
}
function onDrop(e: DragEvent) {
  e.preventDefault(); dragOver.value = false
  if (draggedId.value) return
  if (!canWriteHere.value) return
  const files = e.dataTransfer?.files
  if (files?.length) void dropFilesTo(Array.from(files), currentParent.value)
}

// ── Drag-to-move (entry -> folder / breadcrumb / home) ──
const draggedId = ref<string | null>(null)
const dropTarget = ref<string | null>(null)
function onRowDragStart(e: DragEvent, entry: Entry) {
  if (!can(entry, ACCESS.WRITE)) { e.preventDefault(); return }
  draggedId.value = entry.id
  e.dataTransfer?.setData('text/plain', entry.id)
}
function onRowDragEnd() { draggedId.value = null; dropTarget.value = null }
async function dropOn(targetId: string | null, targetEntry?: Entry) {
  const id = draggedId.value
  draggedId.value = null; dropTarget.value = null
  if (!id || id === targetId) return
  if (targetEntry && !can(targetEntry, ACCESS.WRITE)) return
  try { await api.move(id, targetId); nav(currentParent.value) }
  catch (e) { error.value = e instanceof Error ? e.message : 'move failed' }
}
// A drop on a container row is either an internal move or files aimed at THAT
// container — never the current folder.
function onRowDrop(ev: DragEvent, e: Entry) {
  ev.preventDefault(); ev.stopPropagation(); dragOver.value = false
  if (!isContainer(e)) return
  if (draggedId.value) { void dropOn(e.id, e); return }
  const files = ev.dataTransfer?.files
  if (files?.length && can(e, ACCESS.WRITE)) void dropFilesTo(Array.from(files), e.id)
}
function onRowDragOver(ev: DragEvent, e: Entry) {
  if (!isContainer(e)) return
  ev.preventDefault()
  dropTarget.value = e.id
}

// ── Right-click / actions menu ──
const menu = reactive<{ entry: Entry | null; x: number; y: number }>({ entry: null, x: 0, y: 0 })
function openMenu(e: Entry, ev: MouseEvent) {
  ev.preventDefault(); ev.stopPropagation()
  menu.entry = e
  menu.x = ev.clientX
  menu.y = ev.clientY
}
function closeMenu() { menu.entry = null }
const flash = ref('')
let flashTimer: ReturnType<typeof setTimeout> | undefined
function showFlash(msg: string) {
  flash.value = msg
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => { flash.value = '' }, 1800)
}
async function copyId(e: Entry) {
  closeMenu()
  try { await navigator.clipboard.writeText(e.id); showFlash('ID copied') }
  catch { error.value = 'clipboard unavailable' }
}

// ── Move dialog (the non-drag path to /move) ──
const moveFor = ref<Entry | null>(null)
const moveCwd = ref<string | null>(null)
const moveCrumbs = ref<{ id: string; name: string; type: string }[]>([])
const moveFolders = ref<Entry[]>([])
const moveLoading = ref(false)
async function moveBrowse(parentId: string | null) {
  moveLoading.value = true
  try {
    moveCwd.value = parentId
    const all = await api.list(parentId)
    moveFolders.value = all.filter(e => isContainer(e) && e.id !== moveFor.value?.id && can(e, ACCESS.WRITE))
    moveCrumbs.value = parentId ? await api.breadcrumbs(parentId) : []
  } catch (e) { error.value = e instanceof Error ? e.message : 'failed to browse' }
  finally { moveLoading.value = false }
}
function openMove(e: Entry) { closeMenu(); moveFor.value = e; void moveBrowse(currentParent.value) }
async function doMove() {
  const e = moveFor.value
  if (!e) return
  const target = moveCwd.value
  moveFor.value = null
  if (target === (e.parent_id ?? null)) return
  try { await api.move(e.id, target); showFlash(`Moved to ${moveCrumbs.value.at(-1)?.name || 'root'}`); nav(currentParent.value) }
  catch (err) { error.value = err instanceof Error ? err.message : 'move failed' }
}

async function exportEntry(e: Entry) {
  closeMenu()
  try {
    const blob = await api.exportEntry(e.id)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${e.name || 'entry'}.kxb`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (err) { error.value = err instanceof Error ? err.message : 'export failed' }
}

// ── Row keyboard: arrows traverse, F2 renames, Delete deletes ──
function onRowKey(ev: KeyboardEvent, e: Entry) {
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    ev.preventDefault()
    const el = ev.currentTarget as HTMLElement
    const rows = [...(el.parentElement?.children || [])].filter(x => (x as HTMLElement).matches?.('.ws-row, .ws-tile')) as HTMLElement[]
    const i = rows.indexOf(el)
    const next = rows[ev.key === 'ArrowDown' ? i + 1 : i - 1]
    next?.focus()
  } else if (ev.key === 'F2' && can(e, ACCESS.WRITE)) {
    ev.preventDefault(); openProps(e)
  } else if (ev.key === 'Delete' && can(e, ACCESS.DELETE)) {
    ev.preventDefault(); void remove(e)
  }
}
// Delete confirms through an in-app dialog: the native window.confirm is suppressed
// in embedded/webview hosts, which silently aborted every delete (no popup, no-op).
const confirmingDelete = ref<Entry | null>(null)
const deleting = ref('')
const deleteDescendantCount = ref<number | null>(null)
async function remove(e: Entry) {
  closeMenu()
  confirmingDelete.value = e
  deleteDescendantCount.value = null
  if (isContainer(e)) {
    try { deleteDescendantCount.value = await api.countDescendants(e.id) }
    catch (err) { error.value = err instanceof Error ? err.message : 'failed to inspect folder' }
  }
}
async function doDelete() {
  const e = confirmingDelete.value
  confirmingDelete.value = null
  deleteDescendantCount.value = null
  if (!e) return
  try {
    const outcome = await api.remove(e.id)
    deleting.value = outcome.inProgress ? `Deleting "${e.name}": cleanup is in progress and continues in the background.` : ''
    if (selected.value?.id === e.id) selected.value = null
    if (managing.value?.id === e.id) closeManage()
    nav(currentParent.value)
  } catch (err) { error.value = err instanceof Error ? err.message : 'failed to delete' }
}

// ── Properties dialog ──
const props = reactive<{ open: boolean; entry: Entry | null; name: string; icon: string; color: string }>(
  { open: false, entry: null, name: '', icon: '', color: '' })
const SWATCHES = [{ label: 'Default', value: '' }, ...COLOR_CHOICES]
const propsError = ref('')
const propsDialogEl = ref<HTMLElement | null>(null)
function openProps(e: Entry) {
  closeMenu()
  props.entry = e; props.name = e.name; props.icon = (e.meta?.icon as string) || ''
  props.color = (e.meta?.color as string) || ''
  propsError.value = ''
  props.open = true
  void nextTick(() => {
    const input = propsDialogEl.value?.querySelector('.ws-name-row input[type="text"], .ws-name-row input:not([type])') as HTMLInputElement | null
    input?.focus(); input?.select()
  })
}
async function saveProps() {
  if (!props.entry) return
  propsError.value = ''
  try {
    await api.update(props.entry.id, { name: props.name.trim() || props.entry.name, icon: props.icon, color: props.color })
    props.open = false
    nav(currentParent.value)
  } catch (e) { propsError.value = e instanceof Error ? e.message : 'failed to save' }
}

function toggleView() {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
  localStorage.setItem('ws-view', viewMode.value)
}

// ── Sharing ──
const shareFor = ref<Entry | null>(null)
// kickside-share self-drives off these generic component access endpoints (the
// same ones agents/connections/skills pass) -- entries are components.
const shareConfig = computed(() => {
  const e = shareFor.value
  if (!e) return ''
  return JSON.stringify({
    resource_id: e.id,
    title: e.name,
    access_url: `/api/v1/component-access/grants/${e.id}`,
    share_url: `/api/v1/component-access/share/${e.id}`,
  })
})

// ── Resizable preview panel ──
const panelWidth = ref(parseInt(localStorage.getItem('ws-panel-w') || '440', 10))
const resizing = ref(false)
let resizeOrigin: { pointerId: number; x: number; width: number } | null = null
function startResize(event: PointerEvent) {
  event.preventDefault()
  resizeOrigin = { pointerId: event.pointerId, x: event.clientX, width: panelWidth.value }
  resizing.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}
function moveResize(event: PointerEvent) {
  if (!resizeOrigin || event.pointerId !== resizeOrigin.pointerId) return
  const width = resizeOrigin.width + resizeOrigin.x - event.clientX
  panelWidth.value = Math.max(280, Math.min(Math.floor(window.innerWidth * 0.92), width))
}
function finishResize() {
  if (!resizeOrigin) return
  resizeOrigin = null
  resizing.value = false
  localStorage.setItem('ws-panel-w', String(panelWidth.value))
}

function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { closeMenu(); if (confirmingDelete.value) { confirmingDelete.value = null; deleteDescendantCount.value = null } else if (showCreate.value) showCreate.value = false; else if (creating.value) creating.value = null; else if (shareFor.value) shareFor.value = null; else if (moveFor.value) moveFor.value = null; else if (props.open) props.open = false; else if (managing.value) closeManage() } }
onMounted(async () => {
  window.addEventListener('keydown', onKey)
  await api.loadTypes()
  if (api.error.value) error.value = api.error.value
  await resolveRoute()
})
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="ws" @click="closeMenu">
    <!-- Breadcrumb line (always lets you step back up) + actions -->
    <div class="ws-strip">
      <button class="ws-home" title="Workspace root" aria-label="Workspace root" :class="{ 'ws-crumb--drop': draggedId && dropTarget === '' }"
        @click="emitNav('navigate', '')"
        @dragover.prevent="dropTarget = ''" @dragleave="dropTarget = null" @drop="dropOn(null)"><Icon icon="tabler:home" /></button>
      <div class="ws-crumbs">
        <template v-for="c in breadcrumbs" :key="c.id">
          <span class="ws-sep">/</span>
          <button class="ws-crumb" :title="c.name" :class="{ 'ws-crumb--drop': draggedId && dropTarget === c.id }"
            @click="emitNav('navigate', c.id)"
            @dragover.prevent="dropTarget = c.id" @dragleave="dropTarget = null" @drop="dropOn(c.id)">{{ c.name }}</button>
        </template>
      </div>
      <span class="ws-spacer" />
      <SearchField v-model="query" placeholder="Filter this folder" class="ws-filter" />
      <IconButton :icon="viewMode === 'list' ? 'tabler:layout-grid' : 'tabler:list'"
        :label="viewMode === 'list' ? 'Grid view' : 'List view'" size="sm" @click="toggleView" />
      <IconButton icon="tabler:upload" label="Upload files" size="sm" :spin="uploading" :disabled="!canWriteHere" @click="fileInput?.click()" />
      <Button icon="tabler:plus" small @click="showCreate = true">New</Button>
      <input ref="fileInput" type="file" multiple hidden @change="onPickFiles" />
    </div>

    <Notice v-if="error" tone="error" @dismiss="error = ''">{{ error }} <Button variant="ghost" small @click="nav(currentParent)">Retry</Button></Notice>
    <Notice v-if="flash" @dismiss="flash = ''">{{ flash }}</Notice>
    <Notice v-if="deleting" @dismiss="deleting = ''">{{ deleting }}</Notice>

    <div class="ws-body">
      <div class="ws-list-pane" :class="{ 'ws-list-pane--aside': selected, 'ws-list-pane--drop': dragOver }"
        @dragover.prevent="dragOver = !draggedId" @dragleave="dragOver = false" @drop="onDrop">
        <div v-if="dragOver" class="ws-drop-hint"><Icon icon="tabler:upload" /> Drop to upload</div>
        <Spinner v-if="loading" label="Loading…" />

        <!-- List -->
        <div v-else-if="visibleEntries.length && viewMode === 'list'" class="ws-list">
          <div v-for="e in visibleEntries" :key="e.id" class="ws-row" :class="{
              'ws-row--sel': selected?.id === e.id,
              'ws-row--drop': dropTarget === e.id,
              'ws-row--drag': draggedId === e.id }"
            :draggable="can(e, ACCESS.WRITE)"
            role="button" tabindex="0"
            @dragstart="onRowDragStart($event, e)" @dragend="onRowDragEnd"
            @dragover="onRowDragOver($event, e)" @dragleave="dropTarget = null"
            @drop="onRowDrop($event, e)"
            @click="open(e)" @dblclick="isContainer(e) ? emitNav('navigate', e.id) : openManage(e)"
            @keydown.enter="open(e)" @keydown.space.prevent="open(e)" @keydown="onRowKey($event, e)"
            @contextmenu="openMenu(e, $event)">
            <span class="ws-edge" />
            <Icon :icon="iconOf(e)" class="ws-row-ico" :style="{ color: colorOf(e) }" />
            <span class="ws-row-name">{{ e.name }}</span>
            <Pill tone="muted">{{ chip(e) }}</Pill>
            <span class="ws-age">{{ formatAge(e.updated_at) }}</span>
            <button class="ws-row-menu" title="Actions" :aria-label="`Actions for ${e.name}`" @click.stop="openMenu(e, $event)"><Icon icon="tabler:dots" /></button>
          </div>
        </div>

        <!-- Grid -->
        <div v-else-if="visibleEntries.length" class="ws-grid">
          <div v-for="e in visibleEntries" :key="e.id" class="ws-tile" :class="{
              'ws-tile--sel': selected?.id === e.id, 'ws-row--drop': dropTarget === e.id }"
            :draggable="can(e, ACCESS.WRITE)"
            role="button" tabindex="0"
            @dragstart="onRowDragStart($event, e)" @dragend="onRowDragEnd"
            @dragover="onRowDragOver($event, e)" @dragleave="dropTarget = null"
            @drop="onRowDrop($event, e)"
            @click="open(e)" @dblclick="isContainer(e) ? emitNav('navigate', e.id) : openManage(e)"
            @keydown.enter="open(e)" @keydown.space.prevent="open(e)" @keydown="onRowKey($event, e)"
            @contextmenu="openMenu(e, $event)">
            <button class="ws-row-menu ws-tile-menu" title="Actions" :aria-label="`Actions for ${e.name}`" @click.stop="openMenu(e, $event)"><Icon icon="tabler:dots" /></button>
            <Icon :icon="iconOf(e)" class="ws-tile-ico" :style="{ color: colorOf(e) }" />
            <span class="ws-tile-name" :title="e.name">{{ e.name }}</span>
          </div>
        </div>



        <EmptyState v-else-if="entries.length" icon="tabler:search-off" title="No matches"
          :hint="`Nothing here matches “${query}”.`" cta="Clear filter" cta-icon="tabler:x" @cta="query = ''" />
        <EmptyState v-else-if="canWriteHere" icon="tabler:folder-open" title="Empty"
          hint="Create a folder or entry, or upload files."
          cta="New entry" cta-icon="tabler:plus" @cta="showCreate = true" />
        <EmptyState v-else icon="tabler:folder-open" title="Empty" hint="Nothing has been shared into this folder yet." />
      </div>

      <!-- Resizable preview -->
      <template v-if="selected">
        <div class="ws-divider" :class="{ resizing }" @pointerdown="startResize" @pointermove="moveResize" @pointerup="finishResize" @pointercancel="finishResize" @lostpointercapture="finishResize" />
        <aside class="ws-preview" :style="{ '--ws-preview-width': panelWidth + 'px' }">
          <div class="ws-preview-head">
            <Icon :icon="iconOf(selected)" :style="{ color: colorOf(selected) }" />
            <span class="ws-preview-title">{{ selected.name }}</span>
            <span class="ws-spacer" />
            <IconButton v-if="selected.type !== 'folder'" icon="tabler:maximize" label="Open (full)" size="sm" @click="openManage(selected!)" />
            <IconButton v-if="can(selected, ACCESS.ADMIN)" icon="tabler:share-3" label="Share" size="sm" @click="shareFor = selected" />
            <IconButton icon="tabler:adjustments" label="Properties" size="sm" @click="openProps(selected!)" />
            <IconButton icon="tabler:x" label="Close" size="sm" @click="selected = null" />
          </div>
          <EntryRenderer v-if="tagFor(selected)" :tag="tagFor(selected)" :attrs="attrsFor(selected, 'preview')" class="ws-renderer" />
          <ComponentView v-else :entry="selected" mode="preview" class="ws-renderer" />
        </aside>
      </template>
    </div>

    <!-- Context menu -->
    <MenuLayer v-if="menu.entry" :x="menu.x" :y="menu.y" @close="closeMenu">
      <button v-if="isContainer(menu.entry)" class="ws-menu-item" @click="emitNav('navigate', menu.entry!.id); closeMenu()"><Icon icon="tabler:folder-open" /> Open</button>
      <template v-else>
        <button class="ws-menu-item" @click="open(menu.entry!); closeMenu()"><Icon icon="tabler:eye" /> Preview</button>
        <button class="ws-menu-item" @click="openManage(menu.entry!)"><Icon icon="tabler:maximize" /> Open (manage)</button>
      </template>
      <button v-if="can(menu.entry, ACCESS.WRITE)" class="ws-menu-item" @click="openProps(menu.entry!)"><Icon icon="tabler:cursor-text" /> Rename…</button>
      <button v-if="can(menu.entry, ACCESS.WRITE)" class="ws-menu-item" @click="openMove(menu.entry!)"><Icon icon="tabler:folder-symlink" /> Move to…</button>
      <button v-if="can(menu.entry, ACCESS.ADMIN)" class="ws-menu-item" @click="shareFor = menu.entry; closeMenu()"><Icon icon="tabler:user-plus" /> Share…</button>
      <button class="ws-menu-item" @click="exportEntry(menu.entry!)"><Icon icon="tabler:package-export" /> Export</button>
      <button class="ws-menu-item" @click="copyId(menu.entry!)"><Icon icon="tabler:copy" /> Copy ID</button>
      <div v-if="can(menu.entry, ACCESS.DELETE)" class="ws-menu-div" />
      <button v-if="can(menu.entry, ACCESS.DELETE)" class="ws-menu-item ws-menu-danger" @click="remove(menu.entry!)"><Icon icon="tabler:trash" /> Delete</button>
    </MenuLayer>

    <!-- Create: pick a kind, then mount its declared create.view -->
    <div v-if="showCreate" class="ws-modal" role="dialog" aria-modal="true" aria-labelledby="ws-new-heading" @click.self="showCreate = false">
      <div class="ws-dialog">
        <div class="ws-dialog-head" id="ws-new-heading">New entry<span class="ws-spacer" /><IconButton icon="tabler:x" label="Close new entry" size="sm" @click="showCreate = false" /></div>
        <div class="ws-type-grid">
          <button v-for="t in creatableTypes" :key="t.value" type="button" class="ws-type-btn"
            :title="t.description || t.label" @click="pickType(t)">
            <Icon :icon="t.icon" :style="{ color: t.color }" />
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create surface: the kind's create.view, mounted in a popup. The host owns
         dismissal -- backdrop click or Escape -- so a popup is never trapped by its
         content; the element's own created/close (composed CustomEvents) drive it too. -->
    <div v-if="creating?.create?.view && isGenericCreate" class="ws-modal" @created="onCreated" @close="creating = null" @click.self="creating = null">
      <EntryRenderer :tag="creating.create.view" :attrs="createAttrs" />
    </div>
    <div v-else-if="creating?.create?.view" class="ws-modal" @created="onCreated" @close="creating = null" @click.self="creating = null">
      <div class="ws-create-panel">
        <EntryRenderer :tag="creating.create.view" :attrs="createAttrs" :fill="false" class="ws-create-mount" />
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="confirmingDelete" class="ws-modal" @click.self="confirmingDelete = null; deleteDescendantCount = null">
      <div class="ws-dialog">
        <div class="ws-dialog-head">Delete {{ isContainer(confirmingDelete) ? 'folder' : 'entry' }}</div>
        <div v-if="isContainer(confirmingDelete)" class="ws-confirm-body">
          Deletes this folder and {{ deleteDescendantCount ?? '…' }} entries. Uploaded files stay in Files.
        </div>
        <div v-else-if="confirmingDelete.type === 'file'" class="ws-confirm-body">Removes it from the workspace. The file stays in Files.</div>
        <div v-else class="ws-confirm-body">Deletes this entry from the workspace.</div>
        <div class="ws-dialog-foot">
          <Button variant="ghost" @click="confirmingDelete = null; deleteDescendantCount = null">Cancel</Button>
          <Button icon="tabler:trash" @click="doDelete">Delete</Button>
        </div>
      </div>
    </div>

    <!-- Properties -->
    <div v-if="props.open && props.entry" class="ws-modal" @click.self="props.open = false">
      <div ref="propsDialogEl" class="ws-dialog">
        <div class="ws-dialog-head">Properties<span class="ws-spacer" /><IconButton icon="tabler:x" label="Close" size="sm" @click="props.open = false" /></div>
        <Notice v-if="propsError" tone="error" @dismiss="propsError = ''">{{ propsError }}</Notice>
        <FormField label="Name">
          <div class="ws-name-row">
            <IconField v-model="props.icon" :fallback="typeMap[props.entry.type]?.icon" />
            <TextInput v-model="props.name" />
          </div>
        </FormField>
        <FormField label="Color">
          <div class="ws-swatches">
            <button v-for="s in SWATCHES" :key="s.value" type="button" class="ws-swatch" :class="{ on: props.color === s.value }"
              :title="s.label" :aria-label="`Use color ${s.label}`" :style="{ background: s.value || 'transparent' }" @click="props.color = s.value">
              <Icon v-if="!s.value" icon="tabler:ban" />
            </button>
          </div>
        </FormField>
        <div class="ws-meta-grid">

          <div><span>Type</span><span>{{ chip(props.entry) }}</span></div>
          <div><span>Status</span><code>{{ props.entry.status }}</code></div>
          <div><span>Access</span><code>{{ formatAccess(props.entry.access_level) }}</code></div>
          <div><span>Created</span><code>{{ formatDate(props.entry.created_at) }}</code></div>
          <div><span>Updated</span><code>{{ formatDate(props.entry.updated_at) }}</code></div>
        </div>
        <div class="ws-dialog-foot">
          <Button variant="ghost" @click="props.open = false">Close</Button>
          <Button v-if="can(props.entry, ACCESS.WRITE)" icon="tabler:device-floppy" @click="saveProps">Save</Button>
        </div>
      </div>
    </div>

    <!-- Move to… : browse folders, land the entry where you stand -->
    <div v-if="moveFor" class="ws-modal" @click.self="moveFor = null">
      <div class="ws-dialog">
        <div class="ws-dialog-head">Move “{{ moveFor.name }}”<span class="ws-spacer" /><IconButton icon="tabler:x" label="Close" size="sm" @click="moveFor = null" /></div>
        <div class="ws-move-crumbs">
          <button class="ws-crumb" @click="moveBrowse(null)"><Icon icon="tabler:home" /></button>
          <template v-for="c in moveCrumbs" :key="c.id">
            <span class="ws-sep">/</span>
            <button class="ws-crumb" @click="moveBrowse(c.id)">{{ c.name }}</button>
          </template>
        </div>
        <div class="ws-move-list">
          <Spinner v-if="moveLoading" label="Loading…" />
          <template v-else>
            <button v-for="f in moveFolders" :key="f.id" class="ws-move-folder" @click="moveBrowse(f.id)">
              <Icon :icon="iconOf(f)" :style="{ color: colorOf(f) }" />
              <span>{{ f.name }}</span>
              <Icon icon="tabler:chevron-right" class="ws-move-into" />
            </button>
            <p v-if="!moveFolders.length" class="ws-move-none">No folders here.</p>
          </template>
        </div>
        <div class="ws-dialog-foot">
          <Button variant="ghost" @click="moveFor = null">Cancel</Button>
          <Button icon="tabler:folder-symlink" :disabled="moveCwd === (moveFor.parent_id ?? null)" @click="doMove">Move here</Button>
        </div>
      </div>
    </div>

    <!-- Manage: full-screen view, renderer in 'full' mode -->
    <div v-if="managing" class="ws-manage">
      <div class="ws-manage-head">
        <IconButton icon="tabler:arrow-left" label="Back" size="sm" @click="closeManage()" />
        <Icon :icon="iconOf(managing)" :style="{ color: colorOf(managing) }" />
        <span class="ws-manage-title">{{ managing.name }}</span>
        <Pill tone="muted">{{ chip(managing) }}</Pill>
        <span class="ws-spacer" />
        <IconButton v-if="can(managing, ACCESS.ADMIN)" icon="tabler:share-3" label="Share" size="sm" @click="shareFor = managing" />
        <IconButton icon="tabler:adjustments" label="Properties" size="sm" @click="openProps(managing!)" />
        <IconButton icon="tabler:x" label="Close" size="sm" @click="closeManage()" />
      </div>
      <EntryRenderer v-if="tagFor(managing)" :tag="tagFor(managing)" :attrs="attrsFor(managing, 'full')" class="ws-manage-body" />
      <ComponentView v-else :entry="managing" mode="full" class="ws-manage-body" />
    </div>

    <!-- Share — kickside-share is a self-contained popup (its own backdrop + panel),
         so it's mounted bare and we just react to its close/changed events. -->
    <ShareHost
      v-if="shareFor"
      :config="shareConfig"
      @close="shareFor = null"
      @changed="nav(currentParent)"
    />
  </div>
</template>
