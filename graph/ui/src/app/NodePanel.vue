<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { COLOR_CHOICES } from './color-choices'
import { renderMarkdown } from './markdown'
import { parseHandles, type HandleDef } from './graph-sync'
import MaterialCard from './MaterialCard.vue'
import type { GraphMaterial, GraphNode, GraphTypeDef } from './types'

const props = defineProps<{
  readOnly?: boolean
  node: GraphNode
  nodeTypes: GraphTypeDef[]
  materialTypes: GraphTypeDef[]
  materials: GraphMaterial[]
  hasChildren: boolean
  expanded: boolean
}>()
const emit = defineEmits<{
  (e: 'update', patch: Record<string, unknown>): void
  (e: 'delete'): void
  (e: 'material-add', kind: string): void
  (e: 'component-ref-add', kind: string): void
  (e: 'material-update', payload: { id: string; patch: Record<string, unknown> }): void
  (e: 'material-remove', id: string): void
  (e: 'drill'): void
  (e: 'toggle-expand'): void
  (e: 'collapse'): void
  (e: 'close'): void
}>()

const editing = ref<string | null>(null)
const editVal = ref('')
const tagDraft = ref('')
const showAddMat = ref(false)
const styleOpen = ref(false)
const openMats = ref<Set<string>>(new Set())

// A freshly attached material opens for editing; everything else stays folded.
watch(() => props.materials.length, (len, prev) => {
  if (len > (prev ?? 0)) {
    const last = props.materials[props.materials.length - 1]
    if (last) openMats.value = new Set([...openMats.value, last.id])
  }
})
watch(() => props.node.id, () => { openMats.value = new Set(); styleOpen.value = false; editing.value = null })

const props_ = computed(() => props.node.properties || {})
const accent = computed(() => String(props_.value.accent || props_.value.color || nodeTypeColor(props.node.type)))
const borderStyle = computed(() => String(props_.value.style || 'solid'))
const animation = computed(() => String(props_.value.animation || ''))
const width = computed(() => Number(props_.value.width || 210))
const radius = computed(() => Number(props_.value.radius ?? 6))

const sortedNodeTypes = computed(() => [...props.nodeTypes].sort((a, b) => (a.title || a.id).localeCompare(b.title || b.id)))
const matTypesForNode = computed(() => props.materialTypes.filter(d => !d.targets || d.targets.includes('node')))

function nodeTypeColor(type: string): string {
  // Decorative domain fallback for a node category, not a success state.
  return String(props.nodeTypes.find(d => d.id === type)?.color || 'var(--p-primary-color)')
}

function startEdit(field: string, value: string) { editing.value = field; editVal.value = value }
function saveEdit(field: string) {
  editing.value = null
  const cur = field === 'name' ? props.node.name : (props.node.description || '')
  if (editVal.value !== cur) emit('update', { [field]: editVal.value })
}
function setType(type: string) { if (type !== props.node.type) emit('update', { type }) }
function setProp(key: string, value: unknown) { emit('update', { properties: { ...props_.value, [key]: value } }) }

function addTag() {
  const t = tagDraft.value.trim()
  if (!t) return
  const tags = props.node.tags || []
  if (!tags.includes(t)) emit('update', { tags: [...tags, t] })
  tagDraft.value = ''
}
function removeTag(t: string) { emit('update', { tags: (props.node.tags || []).filter(x => x !== t) }) }

// ── Ports ──
function getHandles(): HandleDef[] { return parseHandles(props_.value.handles) }
function portCount(side: string): number { return getHandles().filter(h => h.side === side).length }
function counter(side: string): number {
  const c = props_.value[`_port_${side}`]
  return typeof c === 'number' ? c : portCount(side)
}
function addPort(side: HandleDef['side']) {
  const list = [...getHandles()]
  const n = counter(side)
  const type: HandleDef['type'] = side === 'top' || side === 'left' ? 'target' : 'source'
  list.push({ id: `${side}-${n}`, type, side })
  emit('update', { properties: { ...props_.value, handles: JSON.stringify(list), [`_port_${side}`]: n + 1 } })
}
function removePort(side: HandleDef['side']) {
  const list = [...getHandles()]
  const sideHandles = list.filter(h => h.side === side)
  if (!sideHandles.length) return
  const last = sideHandles[sideHandles.length - 1]
  const idx = list.findIndex(h => h.id === last.id)
  if (idx >= 0) list.splice(idx, 1)
  emit('update', { properties: { ...props_.value, handles: JSON.stringify(list), [`_port_${side}`]: counter(side) } })
}

// ── Materials ──
function addMaterial(kind: string) { showAddMat.value = false; emit('material-add', kind) }
function componentRefKind(): string {
  return matTypesForNode.value.find(d => d.id === 'reference')?.id
    || matTypesForNode.value.find(d => d.id === 'component')?.id
    || matTypesForNode.value[0]?.id
    || 'reference'
}
function toggleMat(id: string) {
  const next = new Set(openMats.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  openMats.value = next
}

const ANIMS = ['', 'pulse', 'glow', 'blink', 'breathe', 'shake']
const SIDES: Array<{ k: HandleDef['side']; l: string }> = [
  { k: 'top', l: 'T' }, { k: 'left', l: 'L' }, { k: 'right', l: 'R' }, { k: 'bottom', l: 'B' },
]
</script>

<template>
  <div class="kg-panel-inner">
    <div v-if="readOnly" class="kg-hdr">
      <div class="kg-hdr-top"><span class="kg-kicker">Node</span><button class="kg-x" aria-label="Close node inspector" @click="emit('close')">×</button></div>
      <h3 class="kg-editable-title">{{ node.name }}</h3>
      <div class="kg-desc-preview" v-html="renderMarkdown(node.description || node.name)" />
      <p class="kg-muted">Read only</p>
    </div>
    <template v-else>
    <div class="kg-hdr" :style="{ borderLeftColor: accent }">
      <div class="kg-hdr-top">
        <span class="kg-hdr-dot" :style="{ background: accent }"></span>
        <select class="kg-type-sel" :value="node.type" @change="setType(($event.target as HTMLSelectElement).value)">
          <option v-for="d in sortedNodeTypes" :key="d.id" :value="d.id">{{ d.title || d.id }}</option>
          <option v-if="!sortedNodeTypes.length" value="note">note</option>
        </select>
        <button class="kg-x kg-x--chev" title="Hide inspector" aria-label="Hide inspector" @click="emit('collapse')">»</button>
        <button class="kg-x" title="Close" aria-label="Close node inspector" @click="emit('close')">×</button>
      </div>
      <div v-if="editing === 'name'" class="kg-editrow">
        <input class="kg-input kg-title-input" v-model="editVal" @keyup.enter="saveEdit('name')" @blur="saveEdit('name')" autofocus />
      </div>
      <div v-else class="kg-editable-title" role="button" tabindex="0" @click="startEdit('name', node.name)" @keydown.enter="startEdit('name', node.name)" @keydown.space.prevent="startEdit('name', node.name)">{{ node.name }}</div>
      <div v-if="editing === 'description'" class="kg-editrow">
        <textarea class="kg-textarea" rows="4" v-model="editVal" @blur="saveEdit('description')" autofocus></textarea>
      </div>
      <div v-else class="kg-desc-preview" role="button" tabindex="0" @click="startEdit('description', node.description || '')" @keydown.enter="startEdit('description', node.description || '')" @keydown.space.prevent="startEdit('description', node.description || '')"
        v-html="node.description ? renderMarkdown(node.description) : '<em>add description…</em>'"></div>
    </div>

    <div v-if="hasChildren" class="kg-row">
      <button class="kg-btn kg-btn--ghost" @click="emit('toggle-expand')">{{ expanded ? 'Collapse' : 'Expand' }}</button>
      <button class="kg-btn kg-btn--ghost" @click="emit('drill')">Open ›</button>
    </div>

    <button class="kg-disclosure" :class="{ open: styleOpen }" @click="styleOpen = !styleOpen">
      <span>Style</span>
      <span class="kg-disclosure-meta">
        <span class="kg-swatch kg-swatch--peek" :style="{ background: accent }"></span>
      </span>
      <span class="kg-disclosure-chevron">›</span>
    </button>
    <div v-if="styleOpen" class="kg-disclosure-body">
      <div class="kg-colorrow">
        <button v-for="c in COLOR_CHOICES" :key="c.value" class="kg-swatch" :class="{ active: accent === c.value }" :style="{ background: c.value }" :aria-label="`Use node color ${c.label}`" @click="setProp('accent', c.value)"></button>
      </div>
      <div class="kg-inline-field">
        <span class="kg-mini-label">Border</span>
        <button class="kg-chip" :class="{ active: borderStyle === 'solid' }" @click="setProp('style', 'solid')">solid</button>
        <button class="kg-chip" :class="{ active: borderStyle === 'dashed' }" @click="setProp('style', 'dashed')">dashed</button>
      </div>
      <div class="kg-inline-field kg-wrap">
        <span class="kg-mini-label">Animate</span>
        <button v-for="a in ANIMS" :key="a" class="kg-chip" :class="{ active: animation === a }" @click="setProp('animation', a)">{{ a || 'none' }}</button>
      </div>
      <div class="kg-slider-row">
        <span class="kg-mini-label">W</span>
        <input type="range" min="150" max="640" step="10" :value="width" @input="setProp('width', Number(($event.target as HTMLInputElement).value))" />
        <span class="kg-slider-val">{{ width }}</span>
        <span class="kg-mini-label">R</span>
        <input type="range" min="0" max="30" step="2" :value="radius" @input="setProp('radius', Number(($event.target as HTMLInputElement).value))" />
        <span class="kg-slider-val">{{ radius }}</span>
      </div>
    </div>

    <div class="kg-inline-field">
      <span class="kg-mini-label">Ports</span>
      <div class="kg-ports">
        <div v-for="s in SIDES" :key="s.k" class="kg-port-cell">
          <button class="kg-mini" :aria-label="`Remove ${s.k} port`" @click="removePort(s.k)">−</button>
          <span class="kg-port-n">{{ portCount(s.k) }}</span>
          <button class="kg-mini" :aria-label="`Add ${s.k} port`" @click="addPort(s.k)">+</button>
          <span class="kg-port-lbl">{{ s.l }}</span>
        </div>
      </div>
    </div>

    <label class="kg-label">Tags</label>
    <div class="kg-tags-edit">
      <span v-for="t in node.tags || []" :key="t" class="kg-tagchip">{{ t }}<button class="kg-tagx" :aria-label="`Remove tag ${t}`" @click="removeTag(t)">×</button></span>
    </div>
    <input class="kg-input kg-small" v-model="tagDraft" placeholder="add tag + Enter" @keyup.enter="addTag" />

    <div class="kg-section-head">
      <span>Materials</span>
      <button class="kg-mini kg-mini--wide" title="Attach a workspace component reference" @click="emit('component-ref-add', componentRefKind())">+ Component ref</button>
      <div class="kg-add-wrap">
        <button class="kg-mini" :title="matTypesForNode.length ? 'Attach material' : 'No material types — open Types'" aria-label="Attach material" @click="showAddMat = !showAddMat">+</button>
        <div v-if="showAddMat" class="kg-add-menu">
          <button v-for="d in matTypesForNode" :key="d.id" class="kg-add-item" @click="addMaterial(d.id)">{{ d.title || d.id }}</button>
          <div v-if="!matTypesForNode.length" class="kg-add-empty">no material types</div>
        </div>
      </div>
    </div>
    <div class="kg-materials">
      <MaterialCard
        v-for="mat in materials"
        :key="mat.id"
        :material="mat"
        :material-types="materialTypes"
        :expanded="openMats.has(mat.id)"
        @toggle="toggleMat(mat.id)"
        @update="(patch) => emit('material-update', { id: mat.id, patch })"
        @remove="emit('material-remove', mat.id)"
      />
      <div v-if="!materials.length" class="kg-empty-line">no materials yet</div>
    </div>

    <button class="kg-btn kg-danger kg-block" @click="emit('delete')">Delete node</button>
    </template>
  </div>
</template>
