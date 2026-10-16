<script setup lang="ts">
import { COLOR_CHOICES } from './color-choices'
import type { GraphTypeDef } from './types'

const props = defineProps<{
  nodeTypes: GraphTypeDef[]
  edgeTypes: GraphTypeDef[]
  materialTypes: GraphTypeDef[]
}>()
const emit = defineEmits<{
  (e: 'type-add', kind: 'node' | 'edge' | 'material'): void
  (e: 'type-update', payload: { kind: 'node' | 'edge' | 'material'; id: string; patch: Record<string, unknown> }): void
  (e: 'type-remove', payload: { kind: 'node' | 'edge' | 'material'; id: string }): void
  (e: 'seed'): void
  (e: 'collapse'): void
  (e: 'close'): void
}>()

const DISPLAYS = ['panel', 'badge', 'both']
const TARGETS: Array<'graph' | 'node' | 'edge'> = ['graph', 'node', 'edge']

function upd(kind: 'node' | 'edge' | 'material', id: string, patch: Record<string, unknown>) {
  emit('type-update', { kind, id, patch })
}
function toggleTarget(def: GraphTypeDef, target: string) {
  const cur = Array.isArray(def.targets) ? def.targets : []
  const next = cur.includes(target) ? cur.filter(t => t !== target) : [...cur, target]
  upd('material', def.id, { targets: next })
}
function hasTarget(def: GraphTypeDef, target: string): boolean {
  return !def.targets || (Array.isArray(def.targets) && def.targets.includes(target))
}
</script>

<template>
  <div class="kg-panel-inner">
    <div class="kg-panel-head">
      <span class="kg-panel-title">Types</span>
      <div class="kg-head-actions">
        <button class="kg-mini kg-mini--wide" title="Seed default types" @click="emit('seed')">Seed</button>
        <button class="kg-x kg-x--chev" title="Hide inspector" aria-label="Hide inspector" @click="emit('collapse')">»</button>
        <button class="kg-x" title="Close" aria-label="Close schema editor" @click="emit('close')">×</button>
      </div>
    </div>

    <div class="kg-type-group">
      <div class="kg-section-head"><span>Node types</span><button class="kg-mini" aria-label="Add node type" @click="emit('type-add', 'node')">+</button></div>
      <div v-for="d in nodeTypes" :key="d.id" class="kg-type-row">
        <input class="kg-input kg-small" :value="d.title || d.id" @change="upd('node', d.id, { title: ($event.target as HTMLInputElement).value })" />
        <!-- Decorative domain fallback for entity categories, not status. -->
        <select class="kg-input kg-small kg-theme-select" :aria-label="`${d.title || d.id} color`" :value="String(d.color || 'var(--p-primary-color)')" @change="upd('node', d.id, { color: ($event.target as HTMLSelectElement).value })">
          <option v-for="c in COLOR_CHOICES" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>

        <button class="kg-mini kg-danger" :aria-label="`Remove node type ${d.title || d.id}`" @click="emit('type-remove', { kind: 'node', id: d.id })">×</button>
      </div>
    </div>

    <div class="kg-type-group">
      <div class="kg-section-head"><span>Edge types</span><button class="kg-mini" aria-label="Add edge type" @click="emit('type-add', 'edge')">+</button></div>
      <div v-for="d in edgeTypes" :key="d.id" class="kg-type-row">
        <input class="kg-input kg-small" :value="d.title || d.id" @change="upd('edge', d.id, { title: ($event.target as HTMLInputElement).value })" />
        <!-- Decorative domain fallback for entity categories, not status. -->
        <select class="kg-input kg-small kg-theme-select" :aria-label="`${d.title || d.id} color`" :value="String(d.color || d.stroke || 'var(--p-text-muted-color)')" @change="upd('edge', d.id, { color: ($event.target as HTMLSelectElement).value, stroke: ($event.target as HTMLSelectElement).value })">
          <option v-for="c in COLOR_CHOICES" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
        <label class="kg-anim-lbl"><input type="checkbox" :checked="d.animated === true" @change="upd('edge', d.id, { animated: ($event.target as HTMLInputElement).checked })" />anim</label>
        <button class="kg-mini kg-danger" :aria-label="`Remove edge type ${d.title || d.id}`" @click="emit('type-remove', { kind: 'edge', id: d.id })">×</button>
      </div>
    </div>

    <div class="kg-type-group">
      <div class="kg-section-head"><span>Material types</span><button class="kg-mini" aria-label="Add material type" @click="emit('type-add', 'material')">+</button></div>
      <div v-for="d in materialTypes" :key="d.id" class="kg-type-row kg-type-row--mat">
        <div class="kg-type-row">
          <input class="kg-input kg-small" :value="d.title || d.id" @change="upd('material', d.id, { title: ($event.target as HTMLInputElement).value })" />
          <select class="kg-input kg-small" :value="String(d.display || 'panel')" @change="upd('material', d.id, { display: ($event.target as HTMLSelectElement).value })">
            <option v-for="x in DISPLAYS" :key="x" :value="x">{{ x }}</option>
          </select>
          <button class="kg-mini kg-danger" :aria-label="`Remove material type ${d.title || d.id}`" @click="emit('type-remove', { kind: 'material', id: d.id })">×</button>
        </div>
        <div class="kg-targets">
          <label v-for="t in TARGETS" :key="t" class="kg-anim-lbl"><input type="checkbox" :checked="hasTarget(d, t)" @change="toggleTarget(d, t)" />{{ t }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
