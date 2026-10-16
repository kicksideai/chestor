<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { COLOR_CHOICES } from './color-choices'
import { ROUTE_CYCLE } from './graph-sync'
import MaterialCard from './MaterialCard.vue'
import type { GraphEdge, GraphMaterial, GraphTypeDef } from './types'

const props = defineProps<{
  readOnly?: boolean
  edge: GraphEdge
  edgeTypes: GraphTypeDef[]
  materialTypes: GraphTypeDef[]
  materials: GraphMaterial[]
  sourceName?: string
  targetName?: string
}>()
const emit = defineEmits<{
  (e: 'update', patch: Record<string, unknown>): void
  (e: 'reverse'): void
  (e: 'delete'): void
  (e: 'material-add', kind: string): void
  (e: 'component-ref-add', kind: string): void
  (e: 'material-update', payload: { id: string; patch: Record<string, unknown> }): void
  (e: 'material-remove', id: string): void
  (e: 'collapse'): void
  (e: 'close'): void
}>()

const editingLabel = ref(false)
const labelVal = ref('')
const showAddMat = ref(false)
const styleOpen = ref(false)
const openMats = ref<Set<string>>(new Set())

watch(() => props.materials.length, (len, prev) => {
  if (len > (prev ?? 0)) {
    const last = props.materials[props.materials.length - 1]
    if (last) openMats.value = new Set([...openMats.value, last.id])
  }
})
watch(() => props.edge.id, () => { openMats.value = new Set(); styleOpen.value = false; editingLabel.value = false })

const p = computed(() => props.edge.properties || {})
const animated = computed(() => p.value.animated === true || p.value.animated === 'true')
const bidirectional = computed(() => p.value.bidirectional === true || p.value.direction === 'bidirectional')
const stroke = computed(() => String(p.value.stroke || ''))
const strokeWidth = computed(() => Number(p.value.strokeWidth || 0))
const routing = computed(() => String(p.value.routing || 'default'))
const matTypesForEdge = computed(() => props.materialTypes.filter(d => !d.targets || d.targets.includes('edge')))

function startLabel() { editingLabel.value = true; labelVal.value = props.edge.label || '' }
function saveLabel() { editingLabel.value = false; if (labelVal.value !== (props.edge.label || '')) emit('update', { label: labelVal.value }) }
function setType(type: string) { if (type !== props.edge.type) emit('update', { type }) }
function setProp(key: string, value: unknown) { emit('update', { properties: { ...p.value, [key]: value } }) }
function setBidirectional(value: boolean) { setProp('direction', value ? 'bidirectional' : 'directed') }

function addMaterial(kind: string) { showAddMat.value = false; emit('material-add', kind) }
function componentRefKind(): string {
  return matTypesForEdge.value.find(d => d.id === 'reference')?.id
    || matTypesForEdge.value.find(d => d.id === 'component')?.id
    || matTypesForEdge.value[0]?.id
    || 'reference'
}
function toggleMat(id: string) {
  const next = new Set(openMats.value)
  if (next.has(id)) next.delete(id); else next.add(id)
  openMats.value = next
}

</script>

<template>
  <div class="kg-panel-inner">
    <div v-if="readOnly" class="kg-hdr">
      <div class="kg-hdr-top"><span class="kg-kicker">Relation</span><button class="kg-x" aria-label="Close edge inspector" @click="emit('close')">×</button></div>
      <h3>{{ edge.label || 'Relation' }}</h3>
      <p>{{ sourceName || 'Source node' }} → {{ targetName || 'Target node' }}</p>
      <p class="kg-muted">Read only</p>
    </div>
    <template v-else>
    <div class="kg-hdr" :style="{ borderLeftColor: stroke || 'var(--kg-line)' }">
      <div class="kg-hdr-top">
        <span class="kg-kicker">Edge</span>
        <button class="kg-x kg-x--chev" title="Hide inspector" aria-label="Hide inspector" @click="emit('collapse')">»</button>
        <button class="kg-x" title="Close" aria-label="Close edge inspector" @click="emit('close')">×</button>
      </div>
      <input v-if="editingLabel" class="kg-input kg-title-input" v-model="labelVal" @keyup.enter="saveLabel" @blur="saveLabel" autofocus />
      <div v-else class="kg-editable-title" role="button" tabindex="0" @click="startLabel" @keydown.enter="startLabel" @keydown.space.prevent="startLabel">{{ edge.label || 'set label…' }}</div>
      <div class="kg-edge-dir">
        <span class="kg-edge-node" >{{ sourceName || 'Source node' }}</span>
        <span class="kg-edge-arrow">{{ bidirectional ? '↔' : '→' }}</span>
        <span class="kg-edge-node" >{{ targetName || 'Target node' }}</span>
      </div>
    </div>

    <label class="kg-label">Type</label>
    <div class="kg-chiprow">
      <button v-for="d in edgeTypes" :key="d.id" class="kg-chip" :class="{ active: edge.type === d.id }" @click="setType(d.id)">{{ d.title || d.id }}</button>
      <button v-if="!edgeTypes.length" class="kg-chip active">{{ edge.type }}</button>
    </div>

    <label class="kg-label">Direction</label>
    <div class="kg-chiprow">
      <button class="kg-chip" title="Swap source and target" @click="emit('reverse')">reverse</button>
      <button class="kg-chip" :class="{ active: bidirectional }" title="Render arrows in both directions" @click="setBidirectional(!bidirectional)">bidirectional</button>
    </div>

    <button class="kg-disclosure" :class="{ open: styleOpen }" @click="styleOpen = !styleOpen">
      <span>Style</span>
      <span class="kg-disclosure-meta">
        <span class="kg-swatch kg-swatch--peek" :style="{ background: stroke || 'var(--p-text-muted-color)' }"></span>
      </span>
      <span class="kg-disclosure-chevron">›</span>
    </button>
    <div v-if="styleOpen" class="kg-disclosure-body">
      <div class="kg-colorrow">
        <button v-for="c in COLOR_CHOICES" :key="c.value" class="kg-swatch" :class="{ active: stroke === c.value }" :style="{ background: c.value }" :aria-label="`Use edge color ${c.label}`" @click="setProp('stroke', c.value)"></button>
        <select class="kg-input kg-small kg-wsel" :value="strokeWidth || ''" @change="setProp('strokeWidth', Number(($event.target as HTMLSelectElement).value))">
          <option value="">width</option>
          <option value="1">1px</option>
          <option value="2">2px</option>
          <option value="3">3px</option>
          <option value="4">4px</option>
        </select>
      </div>
      <div class="kg-inline-field">
        <span class="kg-mini-label">Effect</span>
        <button class="kg-chip" :class="{ active: animated }" @click="setProp('animated', !animated)">animated</button>
      </div>
      <div class="kg-inline-field kg-wrap">
        <span class="kg-mini-label">Routing</span>
        <button v-for="r in ROUTE_CYCLE" :key="r" class="kg-chip" :class="{ active: routing === r }" @click="setProp('routing', r)">{{ r }}</button>
      </div>
    </div>

    <div class="kg-section-head">
      <span>Materials</span>
      <button class="kg-mini kg-mini--wide" title="Attach a workspace component reference" @click="emit('component-ref-add', componentRefKind())">+ Component ref</button>
      <div class="kg-add-wrap">
        <button class="kg-mini" :title="matTypesForEdge.length ? 'Attach material' : 'No material types — open Types'" aria-label="Attach material" @click="showAddMat = !showAddMat">+</button>
        <div v-if="showAddMat" class="kg-add-menu">
          <button v-for="d in matTypesForEdge" :key="d.id" class="kg-add-item" @click="addMaterial(d.id)">{{ d.title || d.id }}</button>
          <div v-if="!matTypesForEdge.length" class="kg-add-empty">no material types</div>
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
      <div v-if="!materials.length" class="kg-empty-line">none</div>
    </div>

    <button class="kg-btn kg-danger kg-block" @click="emit('delete')">Delete edge</button>
    </template>
  </div>
</template>
